const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

function buildClient() {
  const region = process.env.AWS_REGION || "us-east-1";
  const endpoint = process.env.DYNAMODB_ENDPOINT;

  const client = new DynamoDBClient({
    region,
    ...(endpoint
      ? {
          endpoint,
          credentials: {
            accessKeyId: "local",
            secretAccessKey: "local",
          },
        }
      : {}),
  });

  return DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
  });
}

let singleton;
function getDocumentClient() {
  if (!singleton) singleton = buildClient();
  return singleton;
}

module.exports = { getDocumentClient };
