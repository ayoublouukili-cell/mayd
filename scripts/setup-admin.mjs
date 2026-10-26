import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const password = process.env.MAYD_ADMIN_PASSWORD;
if (!url || !key || !password)
  throw new Error(
    "SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (ou SUPABASE_SERVICE_ROLE_KEY) et MAYD_ADMIN_PASSWORD requis.",
  );
const email = "maynd@contact.com";
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function setup() {
  let user;
  const login = await client.auth.signInWithPassword({ email, password });
  if (!login.error) {
    const { data, error } = await client.rpc("has_role", {
      _user_id: login.data.user.id,
      _role: "admin",
    });
    if (error) throw error;
    if (data) {
      console.log("Compte MAYD connecté et rôle admin vérifié.");
      return;
    }
    user = login.data.user;
  }
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    await client.auth.signOut();
    if (!user) {
      for (let page = 1; ; page++) {
        const { data, error } = await client.auth.admin.listUsers({ page, perPage: 100 });
        if (error) throw error;
        user = data.users.find((candidate) => candidate.email?.toLowerCase() === email);
        if (user || data.users.length < 100) break;
      }
    }
    if (user && !user.email_confirmed_at) {
      const { data, error } = await client.auth.admin.updateUserById(user.id, {
        email_confirm: true,
      });
      if (error) throw error;
      user = data.user;
    }
    if (!user) {
      const { data, error } = await client.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) throw error;
      user = data.user;
    }
    const { error } = await client
      .from("user_roles")
      .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });
    if (error) throw error;
    console.log("Compte MAYD créé et rôle admin attribué.");
    return;
  }
  throw new Error(
    "Activation serveur requise : exécutez supabase/admin/activate-mayd.sql dans le SQL Editor, ou fournissez SUPABASE_SERVICE_ROLE_KEY pour créer/activer le compte sans email.",
  );
}
setup().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
