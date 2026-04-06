const { createPartService } = require("../services/partService");

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

/**
 * POST /parts — register a part (name, type, price).
 */
exports.handler = async (event) => {
  let payload;
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return json(400, { message: "Invalid JSON body" });
  }

  const service = createPartService();
  const result = await service.registerPart(payload);

  if (!result.ok) {
    return json(result.statusCode, { errors: result.errors });
  }

  return json(result.statusCode, { part: result.part });
};
