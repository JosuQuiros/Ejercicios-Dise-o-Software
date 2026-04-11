import L from "leaflet";
import "leaflet/dist/leaflet.css";

async function cargarUbicaciones() {
  const r = await fetch("/fiestas/ubicaciones");
  if (!r.ok) throw new Error("No se pudieron cargar ubicaciones");
  const data = await r.json();
  return data.fiestas || [];
}

function fixDefaultIcons() {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

async function main() {
  const root = document.getElementById("app");
  root.innerHTML = `<h1>Ubicaciones</h1><p>Fiestas registradas (texto y mapa).</p><div id="map" style="height:360px;border-radius:8px"></div><ul id="lista"></ul>`;

  const fiestas = await cargarUbicaciones();
  const lista = root.querySelector("#lista");
  for (const f of fiestas) {
    const li = document.createElement("li");
    li.textContent = `${f.nombre} — ${f.ubicacion}`;
    lista.append(li);
  }

  fixDefaultIcons();
  const map = L.map("map").setView([19.43, -99.13], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  const markers = [];
  for (const f of fiestas) {
    if (f.latitud && f.longitud) {
      const lat = Number(f.latitud);
      const lng = Number(f.longitud);
      const m = L.marker([lat, lng]).addTo(map);
      m.bindPopup(`<strong>${f.nombre}</strong><br>${f.ubicacion}`);
      markers.push(m);
    }
  }
  if (markers.length) {
    const g = L.featureGroup(markers);
    map.fitBounds(g.getBounds().pad(0.2));
  }
}

main().catch((e) => {
  document.getElementById("app").textContent = e.message;
});
