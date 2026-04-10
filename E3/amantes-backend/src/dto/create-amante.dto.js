/**
 * Validación básica del cuerpo POST /amantes (capa DTO).
 * @param {unknown} body
 * @returns {{ ok: true, value: { nombre: string, edad: number, intereses: string[] } } | { ok: false, errors: string[] }}
 */
export function parseCreateAmanteDto(body) {
  const errors = [];

  if (body == null || typeof body !== 'object') {
    return { ok: false, errors: ['El cuerpo debe ser un objeto JSON.'] };
  }

  const { nombre, edad, intereses } = body;

  if (typeof nombre !== 'string' || nombre.trim().length < 2) {
    errors.push('nombre es obligatorio y debe tener al menos 2 caracteres.');
  }

  if (typeof edad !== 'number' || Number.isNaN(edad) || !Number.isInteger(edad)) {
    errors.push('edad es obligatoria y debe ser un número entero.');
  } else if (edad < 16 || edad > 120) {
    errors.push('edad debe estar entre 16 y 120.');
  }

  if (intereses === undefined || intereses === null) {
    errors.push('intereses es obligatorio (array de strings).');
  } else if (!Array.isArray(intereses)) {
    errors.push('intereses debe ser un array.');
  } else if (intereses.length === 0) {
    errors.push('intereses debe incluir al menos un elemento.');
  } else if (!intereses.every((i) => typeof i === 'string' && i.trim().length > 0)) {
    errors.push('cada interés debe ser un string no vacío.');
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      nombre: nombre.trim(),
      edad,
      intereses: intereses.map((i) => i.trim().toLowerCase()),
    },
  };
}
