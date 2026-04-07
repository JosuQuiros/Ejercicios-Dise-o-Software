import { useCallback, useEffect, useState } from "react";

const toursUrl = "/api/tours";
const guidesUrl = "/api/guides";

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export default function App() {
  const [tours, setTours] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", location: "", price: "" });
  const [guideForm, setGuideForm] = useState({
    displayName: "",
    contactPhone: "",
    homeLocation: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadTours = useCallback(async () => {
    setLoadingTours(true);
    setError(null);
    try {
      const res = await fetch(toursUrl);
      const body = await parseJsonResponse(res);
      if (!res.ok) throw new Error(typeof body === "string" ? body : JSON.stringify(body));
      setTours(Array.isArray(body) ? body : []);
    } catch (e) {
      setError(e.message ?? "No se pudieron cargar los tours");
      setTours([]);
    } finally {
      setLoadingTours(false);
    }
  }, []);

  const loadGuides = useCallback(async () => {
    setLoadingGuides(true);
    try {
      const res = await fetch(guidesUrl);
      const body = await parseJsonResponse(res);
      if (!res.ok) return;
      setGuides(Array.isArray(body) ? body : []);
    } catch {
      setGuides([]);
    } finally {
      setLoadingGuides(false);
    }
  }, []);

  useEffect(() => {
    loadTours();
    loadGuides();
  }, [loadTours, loadGuides]);

  async function onCreateTour(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const price = Number(form.price);
      if (!form.name.trim() || !form.location.trim() || Number.isNaN(price) || price <= 0) {
        throw new Error("Completa nombre, ubicación y un precio válido");
      }
      const res = await fetch(toursUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          location: form.location.trim(),
          price,
        }),
      });
      const body = await parseJsonResponse(res);
      if (!res.ok) throw new Error(typeof body === "string" ? body : JSON.stringify(body));
      setForm({ name: "", location: "", price: "" });
      await loadTours();
    } catch (e) {
      setError(e.message ?? "Error al publicar el tour");
    } finally {
      setSubmitting(false);
    }
  }

  async function onRegisterGuide(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (!guideForm.displayName.trim()) {
        throw new Error("El nombre del guía es obligatorio");
      }
      const res = await fetch(guidesUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: guideForm.displayName.trim(),
          contactPhone: guideForm.contactPhone.trim() || null,
          homeLocation: guideForm.homeLocation.trim() || null,
        }),
      });
      const body = await parseJsonResponse(res);
      if (!res.ok) throw new Error(typeof body === "string" ? body : JSON.stringify(body));
      setGuideForm({ displayName: "", contactPhone: "", homeLocation: "" });
      await loadGuides();
    } catch (e) {
      setError(e.message ?? "Error al registrar el guía");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-10 border-b border-slate-800 pb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">
          Micronaut · microservicios
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Recorridos en bote — red comunitaria
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Guías locales publican salidas; la lista se sirve desde el microservicio de tours
          (puerto 8080). El registro de guías vive en otro servicio aislado (puerto 8081), sin
          código compartido entre backend y backend.
        </p>
      </header>

      {error && (
        <div
          className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl shadow-cyan-950/20">
          <h2 className="text-lg font-medium text-white">Publicar tour</h2>
          <p className="mt-1 text-sm text-slate-500">POST /tours → tour-service</p>
          <form className="mt-6 space-y-4" onSubmit={onCreateTour}>
            <div>
              <label className="block text-xs font-medium text-slate-400" htmlFor="name">
                Nombre
              </label>
              <input
                id="name"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-cyan-500/40 focus:border-cyan-500 focus:ring-2"
                value={form.name}
                onChange={(ev) => setForm((f) => ({ ...f, name: ev.target.value }))}
                placeholder="Atardecer en manglar"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400" htmlFor="location">
                Ubicación
              </label>
              <input
                id="location"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-cyan-500/40 focus:border-cyan-500 focus:ring-2"
                value={form.location}
                onChange={(ev) => setForm((f) => ({ ...f, location: ev.target.value }))}
                placeholder="Embarcadero norte"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400" htmlFor="price">
                Precio (CRC o unidad local)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-cyan-500/40 focus:border-cyan-500 focus:ring-2"
                value={form.price}
                onChange={(ev) => setForm((f) => ({ ...f, price: ev.target.value }))}
                placeholder="15000"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-500 disabled:opacity-50"
            >
              {submitting ? "Enviando…" : "Publicar tour"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl shadow-slate-950/40">
          <h2 className="text-lg font-medium text-white">Registrar guía</h2>
          <p className="mt-1 text-sm text-slate-500">POST /guides → guide-service</p>
          <form className="mt-6 space-y-4" onSubmit={onRegisterGuide}>
            <div>
              <label className="block text-xs font-medium text-slate-400" htmlFor="gname">
                Nombre visible
              </label>
              <input
                id="gname"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-cyan-500/40 focus:border-cyan-500 focus:ring-2"
                value={guideForm.displayName}
                onChange={(ev) => setGuideForm((f) => ({ ...f, displayName: ev.target.value }))}
                placeholder="María — lancha La Soga"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400" htmlFor="gphone">
                Teléfono (opcional)
              </label>
              <input
                id="gphone"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-cyan-500/40 focus:border-cyan-500 focus:ring-2"
                value={guideForm.contactPhone}
                onChange={(ev) => setGuideForm((f) => ({ ...f, contactPhone: ev.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400" htmlFor="ghome">
                Base / comunidad (opcional)
              </label>
              <input
                id="ghome"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-cyan-500/40 focus:border-cyan-500 focus:ring-2"
                value={guideForm.homeLocation}
                onChange={(ev) => setGuideForm((f) => ({ ...f, homeLocation: ev.target.value }))}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {submitting ? "Enviando…" : "Registrar guía"}
            </button>
          </form>
        </section>
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Tours disponibles</h2>
            <p className="text-sm text-slate-500">GET /tours</p>
          </div>
          <button
            type="button"
            onClick={() => loadTours()}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-cyan-600 hover:text-cyan-300"
          >
            Actualizar
          </button>
        </div>
        {loadingTours ? (
          <p className="mt-6 text-slate-500">Cargando tours…</p>
        ) : tours.length === 0 ? (
          <p className="mt-6 text-slate-500">Aún no hay tours publicados.</p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {tours.map((t) => (
              <li
                key={t.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-cyan-900/60"
              >
                <h3 className="font-medium text-cyan-100">{t.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{t.location}</p>
                <p className="mt-3 text-lg font-semibold text-white">{t.price}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Guías registrados</h2>
            <p className="text-sm text-slate-500">GET /guides (otro microservicio)</p>
          </div>
          <button
            type="button"
            onClick={() => loadGuides()}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-cyan-600 hover:text-cyan-300"
          >
            Actualizar
          </button>
        </div>
        {loadingGuides ? (
          <p className="mt-6 text-slate-500">Cargando guías…</p>
        ) : guides.length === 0 ? (
          <p className="mt-6 text-slate-500">No hay guías en el registro.</p>
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {guides.map((g) => (
              <li
                key={g.id}
                className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm"
              >
                <span className="font-medium text-slate-100">{g.displayName}</span>
                {g.homeLocation && (
                  <span className="mt-1 block text-slate-500">{g.homeLocation}</span>
                )}
                {g.contactPhone && (
                  <span className="mt-1 block text-cyan-600/90">{g.contactPhone}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
