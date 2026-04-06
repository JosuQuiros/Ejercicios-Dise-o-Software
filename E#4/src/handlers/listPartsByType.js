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
 * GET /parts?type=x — list parts filtered by type (category).
 */
exports.handler = async (event) => {
  const type =
    event.queryStringParameters && event.queryStringParameters.type !== undefined
      ? event.queryStringParameters.type
      : undefined;

  const service = createPartService();
  const result = await service.listByType(type);

  if (!result.ok) {
    return json(result.statusCode, { errors: result.errors });
  }

  return json(result.statusCode, { parts: result.parts });
};
