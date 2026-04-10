/**
 * Validación del query GET /amantes?interes=x
 * @param {Record<string, unknown>} query
 */
export function parseListAmantesQueryDto(query) {
  const errors = [];
  const interes = query.interes;

  if (interes === undefined || interes === null || interes === '') {
    errors.push('El parámetro interes es obligatorio.');
  } else if (typeof interes !== 'string' || interes.trim().length < 2) {
    errors.push('interes debe ser un texto de al menos 2 caracteres.');
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: { interes: interes.trim().toLowerCase() } };
}
