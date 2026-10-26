import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, sep } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { createLocalBackend, initializeLocal, OWNER_ID } from "./backend.mjs";

test("local dashboard: authentication, persistence, publication, uploads, analytics and logout", async () => {
  const directory = await mkdtemp(resolve(tmpdir(), "mayd-backend-test-"));
  const middleware = await createLocalBackend({ directory });
  const server = createServer(
    (req, res) =>
      void middleware(req, res, () => {
        res.writeHead(404);
        res.end();
      }),
  );
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const api = `${origin}/api/local`;
  const client = () =>
    createClient(api, "mayd-local", { auth: { persistSession: false, autoRefreshToken: false } });
  const owner = client();
  const visitor = client();
  const password = "test-only-local-password";
  try {
    await initializeLocal(directory, password);
    const config = await readFile(resolve(directory, "auth.json"), "utf8");
    assert.ok(!config.includes(password), "password must be stored as a hash");
    const rejected = await owner.auth.signInWithPassword({
      email: "maynd@contact.com",
      password: "wrong-password",
    });
    assert.ok(rejected.error);
    const anonymousWrite = await visitor
      .from("projects")
      .insert({ title: "Unauthorized", slug: "unauthorized" });
    assert.ok(anonymousWrite.error, "anonymous users cannot edit");
    const login = await owner.auth.signInWithPassword({ email: "maynd@contact.com", password });
    assert.ifError(login.error);
    const token = login.data.session.access_token;
    const identity = await owner.auth.getUser();
    assert.ifError(identity.error);
    assert.equal(identity.data.user.id, OWNER_ID);
    assert.equal((await owner.rpc("has_role", { _user_id: OWNER_ID, _role: "admin" })).data, true);
    const created = await owner
      .from("projects")
      .insert({ title: "Local project", slug: "local-project" })
      .select("id")
      .single();
    assert.ifError(created.error);
    const id = created.data.id;
    assert.deepEqual(
      (await visitor.from("projects").select("*")).data,
      [],
      "draft projects stay private",
    );
    const uploaded = await owner.storage
      .from("portfolio")
      .upload(
        `projects/${id}/00000000-0000-4000-8000-000000000002.png`,
        new Blob([Buffer.from("test-image-bytes")], { type: "image/png" }),
      );
    assert.ifError(uploaded.error);
    const path = uploaded.data.path;
    const addedMedia = await owner
      .from("project_media")
      .insert({ project_id: id, kind: "image", url: path });
    assert.ifError(addedMedia.error);
    assert.deepEqual((await visitor.from("project_media").select("*")).data, []);
    const signed = await owner.storage.from("portfolio").createSignedUrl(path, 3600);
    assert.ifError(signed.error);
    assert.equal(
      (await fetch(signed.data.signedUrl)).status,
      404,
      "anonymous requests cannot read draft media",
    );
    const patch = await owner
      .from("projects")
      .update({ is_published: true, cover_url: path })
      .eq("id", id);
    assert.ifError(patch.error);
    assert.equal((await visitor.from("projects").select("*")).data.length, 1);
    const publicSigned = await visitor.storage.from("portfolio").createSignedUrls([path], 3600);
    assert.ifError(publicSigned.error);
    assert.equal(await (await fetch(publicSigned.data[0].signedUrl)).text(), "test-image-bytes");
    const range = await fetch(publicSigned.data[0].signedUrl, { headers: { range: "bytes=0-3" } });
    assert.equal(range.status, 206);
    assert.equal(await range.text(), "test");
    assert.ifError(
      (await owner.from("site_settings").update({ brand_name: "MAYD test" }).eq("id", true)).error,
    );
    assert.equal(
      (await visitor.from("site_settings").select("*").single()).data.brand_name,
      "MAYD test",
    );
    const persisted = JSON.parse(await readFile(resolve(directory, "data.json"), "utf8"));
    assert.equal(persisted.projects[0].title, "Local project");
    assert.equal(persisted.site_settings[0].brand_name, "MAYD test");
    const contact = await visitor
      .from("contact_messages")
      .insert({ name: "Client", contact: "client@example.com", message: "Hello" });
    assert.ifError(contact.error);
    assert.ok(
      (await visitor.from("contact_messages").select("*")).error,
      "private messages require login",
    );
    assert.equal((await owner.from("contact_messages").select("*")).data.length, 1);
    const event = {
      p_visitor: "00000000-0000-4000-8000-000000000003",
      p_kind: "pageview",
      p_path: "/",
    };
    assert.ifError((await visitor.rpc("track_site_event", event)).error);
    assert.ifError(
      (await visitor.rpc("track_site_event", { ...event, p_kind: "click", p_target: "Contact" }))
        .error,
    );
    await visitor.rpc("track_site_event", { ...event, p_path: "/admin" });
    const stats = await owner.rpc("admin_analytics", { p_days: 7 });
    assert.ifError(stats.error);
    assert.equal(stats.data.views, 1);
    assert.equal(stats.data.visitors, 1);
    assert.equal(stats.data.clicks, 1);
    assert.ok((await visitor.rpc("admin_analytics", { p_days: 7 })).error);
    const csrf = await fetch(`${api}/rest/v1/projects?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        origin: "https://untrusted.example",
        "content-type": "application/json",
      },
      body: JSON.stringify({ title: "Unwanted" }),
    });
    assert.equal(csrf.status, 403);
    assert.ifError((await owner.auth.signOut()).error);
    const stale = await fetch(`${api}/rest/v1/contact_messages`, {
      headers: { authorization: `Bearer ${token}` },
    });
    assert.equal(stale.status, 401, "logout revokes the server session");
  } finally {
    await Promise.all([owner.auth.stopAutoRefresh(), visitor.auth.stopAutoRefresh()]);
    await new Promise((resolve) => server.close(resolve));
    const target = resolve(directory);
    if (!target.startsWith(resolve(tmpdir()) + sep) || !target.includes("mayd-backend-test-"))
      throw new Error("Unexpected test directory");
    await rm(target, { recursive: true, force: true });
  }
});
