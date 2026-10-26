import { Text, useT, useFormMessages } from "@/lib/i18n/Preferences";
import { useState, type FormEvent } from "react";
import { DEMO_NOTICE, type Demo } from "@/lib/demonstrations";
export function DemoForm({ demo, prefix }: { demo: Demo; prefix: string }) {
  const t = useT();
  const validation = useFormMessages();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const cars = demo.theme === "voitures";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    if (String(values.get("name")).trim().length < 2) {
      setError("Indiquez un nom d’au moins deux caractères.");
      return;
    }
    if (cars && String(values.get("end")) <= String(values.get("date"))) {
      setError("La date de retour doit être après la date de départ.");
      return;
    }
    setError("");
    setSent(true);
    form.reset();
  }
  const options = demo.items.length
    ? demo.items.map((i) => i.title)
    : demo.services.map((s) => s.name);
  return (
    <section id={`${prefix}-reservation`} className="demo-form-section">
      <div>
        <p className="demo-kicker">
          <Text value={"Essayez le parcours"} />
        </p>
        <h2>
          <Text value={demo.action} />
        </h2>
        <p>
          <Text
            value={
              "Ce formulaire est une simulation locale. Utilisez des données fictives ; rien n’est enregistré ni transmis. "
            }
          />
        </p>
        <p className="demo-smallprint">
          <Text
            value={
              "Créneaux et disponibilités fictifs. Tarifs illustratifs, sans valeur commerciale. "
            }
          />
        </p>
      </div>
      <form
        {...validation}
        onSubmit={submit}
        className="demo-form"
        onChange={(event) => {
          validation.onInput(event);
          setSent(false);
          setError("");
        }}
      >
        <label htmlFor={`${prefix}-name`}>
          <Text value={"Nom fictif "} />
          <input
            id={`${prefix}-name`}
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="off"
            placeholder={t("Exemple : Camille Démo")}
          />
        </label>
        <label htmlFor={`${prefix}-email`}>
          <Text value={"Email fictif "} />
          <input
            id={`${prefix}-email`}
            name="email"
            type="email"
            required
            maxLength={120}
            autoComplete="off"
            placeholder={t("camille@example.com")}
          />
        </label>
        <label htmlFor={`${prefix}-choice`}>
          <Text
            value={
              demo.theme === "immobilier" ? "Bien à visiter" : cars ? "Véhicule" : "Prestation"
            }
          />
          <select id={`${prefix}-choice`} name="choice" required defaultValue="">
            <option value="" disabled>
              <Text value={"Choisir "} />
            </option>
            {options.map((o) => (
              <option key={o} value={o}>
                <Text value={o} />
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${prefix}-date`}>
          <Text value={cars ? "Date de départ" : "Date souhaitée"} />
          <input
            id={`${prefix}-date`}
            name="date"
            type="date"
            required
            min={new Date().toLocaleDateString("en-CA")}
          />
        </label>
        {cars ? (
          <label htmlFor={`${prefix}-end`}>
            <Text value={"Date de retour "} />
            <input
              id={`${prefix}-end`}
              name="end"
              type="date"
              required
              min={new Date().toLocaleDateString("en-CA")}
            />
          </label>
        ) : (
          <label htmlFor={`${prefix}-time`}>
            <Text value={"Créneau fictif "} />
            <select id={`${prefix}-time`} name="time" required defaultValue="">
              <option value="" disabled>
                <Text value={"Choisir un créneau "} />
              </option>
              {(demo.theme === "restaurant"
                ? ["12:30", "19:30", "21:00"]
                : demo.theme === "sport"
                  ? ["07:30", "12:00", "18:30"]
                  : ["10:00", "14:00", "17:00"]
              ).map((time) => (
                <option key={time} value={time}>
                  <Text value={time} />
                </option>
              ))}
            </select>
          </label>
        )}
        <label htmlFor={`${prefix}-message`}>
          <Text value={"Votre idée (facultatif) "} />
          <textarea
            id={`${prefix}-message`}
            name="message"
            rows={2}
            maxLength={500}
            placeholder={t("Données fictives uniquement")}
          />
        </label>
        <button type="submit" className="demo-primary">
          <Text value={"Tester la demande simulée → "} />
        </button>
        {error && (
          <p role="alert" className="demo-form-error">
            <Text value={error} />
          </p>
        )}
        {sent && (
          <p role="status" className="demo-form-success">
            <Text value={DEMO_NOTICE} />
          </p>
        )}
      </form>
    </section>
  );
}
