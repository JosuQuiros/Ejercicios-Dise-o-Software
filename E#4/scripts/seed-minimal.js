/**
 * Inserts a minimal set of sample rows for local demos (idempotent by id).
 *
 * Env: DYNAMODB_ENDPOINT, PARTS_TABLE, AWS_REGION
 */
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
const tableName =
  process.env.PARTS_TABLE || "motorcycle-parts-api-parts-dev";
const region = process.env.AWS_REGION || "us-east-1";

const client = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region,
    endpoint,
    credentials: { accessKeyId: "local", secretAccessKey: "local" },
  }),
  { marshallOptions: { removeUndefinedValues: true } },
);

const samples = [
  {
    id: "seed-brake-001",
    name: "Front brake disc 320mm",
    type: "brakes",
    price: 189.99,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-engine-001",
    name: "Oil filter OEM",
    type: "engine",
    price: 24.5,
    createdAt: new Date().toISOString(),
  },
];

async function main() {
  for (const item of samples) {
    await client.send(
      new PutCommand({
        TableName: tableName,
        Item: item,
      }),
    );
    console.log(`Seeded part ${item.id} (${item.type})`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
