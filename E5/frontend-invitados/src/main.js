const api = (path, opts = {}) => fetch(path, { headers: { "Content-Type": "application/json" }, ...opts });

/** Todas las fiestas (el anfitrión puede aceptar pendientes aunque el cupo esté lleno). */
async function cargarFiestas() {
  const r = await api("/fiestas/ubicaciones");
  if (!r.ok) throw new Error("No se pudieron cargar las fiestas");
  const data = await r.json();
  return data.fiestas || [];
}

async function cargarPendientes(fiestaId) {
  const r = await api(`/fiestas/${fiestaId}/invitaciones/pendientes`);
  if (!r.ok) throw new Error("No se pudieron cargar invitaciones");
  const data = await r.json();
  return data.invitaciones || [];
}

async function aceptar(fiestaId, invitacionId) {
  const r = await api(`/fiestas/${fiestaId}/invitaciones/${invitacionId}/aceptar`, { method: "POST", body: "{}" });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || "No se pudo aceptar");
  return data;
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function render(root, state) {
  root.innerHTML = "";
  root.append(
    el(`<h1>Aceptar invitados</h1>
        <p>Elige una fiesta y confirma solicitudes pendientes (respeta el cupo en el servidor).</p>`),
  );

  const sel = document.createElement("select");
  sel.append(new Option("— selecciona fiesta —", ""));
  for (const f of state.fiestas) {
    const label = `${f.nombre} (cupo restante ${f.cupo_restante ?? "?"})`;
    sel.append(new Option(label, String(f.id)));
  }
  root.append(sel);

  const box = document.createElement("div");
  root.append(box);

  sel.addEventListener("change", async () => {
    box.innerHTML = "";
    const id = sel.value;
    if (!id) return;
    box.textContent = "Cargando…";
    try {
      const pend = await cargarPendientes(id);
      box.innerHTML = "";
      if (!pend.length) {
        box.append(el("<p>No hay solicitudes pendientes.</p>"));
        return;
      }
      const ul = document.createElement("ul");
      for (const inv of pend) {
        const li = document.createElement("li");
        li.textContent = `${inv.nombre_invitado} `;
        const btn = document.createElement("button");
        btn.textContent = "Aceptar";
        btn.addEventListener("click", async () => {
          btn.disabled = true;
          try {
            await aceptar(Number(id), inv.id);
            await refresh();
            sel.value = id;
            sel.dispatchEvent(new Event("change"));
          } catch (e) {
            alert(e.message);
            btn.disabled = false;
          }
        });
        li.append(btn);
        ul.append(li);
      }
      box.append(ul);
    } catch (e) {
      box.textContent = e.message;
    }
  });
}

async function refresh() {
  const root = document.getElementById("app");
  const fiestas = await cargarFiestas();
  render(root, { fiestas });
}

refresh().catch((e) => {
  document.getElementById("app").textContent = e.message;
});
