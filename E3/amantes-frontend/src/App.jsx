import { useCallback, useMemo, useState } from 'react';
import { AmanteApiRepository } from './repositories/amanteApi.repository.js';
import './App.css';

const repo = new AmanteApiRepository();

export default function App() {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [interesesTexto, setInteresesTexto] = useState('');
  const [interesBusqueda, setInteresBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const interesesArray = useMemo(() => {
    return interesesTexto
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [interesesTexto]);

  const onCrear = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);
      setMensaje(null);
      const edadNum = Number(edad);
      const payload = {
        nombre: nombre.trim(),
        edad: edadNum,
        intereses: interesesArray,
      };
      setCargando(true);
      try {
        await repo.crearPerfil(payload);
        setMensaje('Perfil registrado correctamente.');
        setNombre('');
        setEdad('');
        setInteresesTexto('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setCargando(false);
      }
    },
    [nombre, edad, interesesArray]
  );

  const onBuscar = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);
      setMensaje(null);
      setCargando(true);
      try {
        const list = await repo.listarPorInteres(interesBusqueda.trim());
        setResultados(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setResultados([]);
      } finally {
        setCargando(false);
      }
    },
    [interesBusqueda]
  );

  return (
    <div className="layout">
      <header className="header">
        <h1>Amantes ideales</h1>
        <p className="lede">
          Registra perfiles y consulta candidatos por un interés (API REST local, React CSR).
        </p>
      </header>

      <main className="grid">
        <section className="card">
          <h2>Nuevo perfil</h2>
          <form onSubmit={onCrear} className="form">
            <label>
              Nombre
              <input
                value={nombre}
                onChange={(ev) => setNombre(ev.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label>
              Edad
              <input
                type="number"
                min={16}
                max={120}
                value={edad}
                onChange={(ev) => setEdad(ev.target.value)}
                required
              />
            </label>
            <label>
              Intereses (separados por coma)
              <input
                value={interesesTexto}
                onChange={(ev) => setInteresesTexto(ev.target.value)}
                placeholder="música, cine, deportes"
              />
            </label>
            <button type="submit" disabled={cargando || interesesArray.length === 0}>
              {cargando ? 'Enviando…' : 'Registrar'}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Buscar por interés</h2>
          <form onSubmit={onBuscar} className="form">
            <label>
              Interés
              <input
                value={interesBusqueda}
                onChange={(ev) => setInteresBusqueda(ev.target.value)}
                placeholder="música"
                required
              />
            </label>
            <button type="submit" disabled={cargando}>
              {cargando ? 'Buscando…' : 'Consultar'}
            </button>
          </form>

          <ul className="lista">
            {resultados.length === 0 && !cargando && (
              <li className="lista-vacia">Sin resultados o aún no has buscado.</li>
            )}
            {resultados.map((p) => (
              <li key={p._id}>
                <strong>{p.nombre}</strong>
                <span className="meta">
                  {p.edad} años · {Array.isArray(p.intereses) ? p.intereses.join(', ') : ''}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {mensaje && <p className="toast ok">{mensaje}</p>}
      {error && <p className="toast err">{error}</p>}
    </div>
  );
}
