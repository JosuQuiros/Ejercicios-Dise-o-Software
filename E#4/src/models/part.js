/**
 * Domain shape for a motorcycle part listing.
 * @typedef {Object} Part
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {number} price
 * @property {string} createdAt ISO-8601
 */

const MAX_NAME = 200;
const MAX_TYPE = 80;

/**
 * @param {unknown} body Parsed JSON body from POST /parts
 * @returns {{ ok: true, value: { name: string, type: string, price: number } } | { ok: false, errors: string[] }}
 */
function validateCreatePayload(body) {
  const errors = [];
  if (!body || typeof body !== "object") {
    return { ok: false, errors: ["Body must be a JSON object"] };
  }

  const name = body.name;
  const type = body.type;
  const price = body.price;

  if (typeof name !== "string" || name.trim().length === 0) {
    errors.push("name is required and must be a non-empty string");
  } else if (name.length > MAX_NAME) {
    errors.push(`name must be at most ${MAX_NAME} characters`);
  }

  if (typeof type !== "string" || type.trim().length === 0) {
    errors.push("type is required and must be a non-empty string");
  } else if (type.length > MAX_TYPE) {
    errors.push(`type must be at most ${MAX_TYPE} characters`);
  }

  if (typeof price !== "number" || Number.isNaN(price)) {
    errors.push("price is required and must be a number");
  } else if (price < 0) {
    errors.push("price must be >= 0");
  }

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name: name.trim(),
      type: type.trim(),
      price,
    },
  };
}

/**
 * @param {string | undefined} typeQuery
 * @returns {{ ok: true, value: string } | { ok: false, errors: string[] }}
 */
function validateTypeQuery(typeQuery) {
  if (typeof typeQuery !== "string" || typeQuery.trim().length === 0) {
    return { ok: false, errors: ["Query parameter type is required"] };
  }
  const t = typeQuery.trim();
  if (t.length > MAX_TYPE) {
    return { ok: false, errors: [`type must be at most ${MAX_TYPE} characters`] };
  }
  return { ok: true, value: t };
}

module.exports = {
  validateCreatePayload,
  validateTypeQuery,
};
