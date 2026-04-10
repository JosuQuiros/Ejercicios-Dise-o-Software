/**
 * Repositorio del cliente: acceso HTTP desacoplado de la UI (capa repositories en frontend).
 * En desarrollo usa el proxy de Vite; en preview (`npm start`) usa VITE_API_URL o el backend local.
 */
function apiBase() {
  if (import.meta.env.DEV) return '';
  return import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000';
}

export class AmanteApiRepository {
  /**
   * @param {{ nombre: string, edad: number, intereses: string[] }} payload
   */
  async crearPerfil(payload) {
    const res = await fetch(`${apiBase()}/amantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        throw new Error(data.errors.join(' '));
      }
      const msg = data?.message || res.statusText;
      throw new Error(typeof msg === 'string' ? msg : 'Error al crear perfil');
    }
    return data;
  }

  /**
   * @param {string} interes
   */
  async listarPorInteres(interes) {
    const q = new URLSearchParams({ interes });
    const res = await fetch(`${apiBase()}/amantes?${q.toString()}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        throw new Error(data.errors.join(' '));
      }
      const msg = data?.message || res.statusText;
      throw new Error(typeof msg === 'string' ? msg : 'Error al listar');
    }
    return data;
  }
}
