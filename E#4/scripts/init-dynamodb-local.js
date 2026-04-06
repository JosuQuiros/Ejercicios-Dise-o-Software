/**
 * Creates the Parts table (+ type-index GSI) on DynamoDB Local.
 * Run after: docker compose up -d
 *
 * Env: DYNAMODB_ENDPOINT (default http://localhost:8000), PARTS_TABLE, AWS_REGION
 */
const {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} = require("@aws-sdk/client-dynamodb");

const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
const tableName =
  process.env.PARTS_TABLE || "motorcycle-parts-api-parts-dev";
const region = process.env.AWS_REGION || "us-east-1";

const client = new DynamoDBClient({
  region,
  endpoint,
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
});

async function waitActive(name, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i += 1) {
    const d = await client.send(new DescribeTableCommand({ TableName: name }));
    const status = d.Table && d.Table.TableStatus;
    if (status === "ACTIVE") return;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Table ${name} did not become ACTIVE in time`);
}

async function main() {
  try {
    await client.send(
      new CreateTableCommand({
        TableName: tableName,
        BillingMode: "PAY_PER_REQUEST",
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "S" },
          { AttributeName: "type", AttributeType: "S" },
        ],
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        GlobalSecondaryIndexes: [
          {
            IndexName: "type-index",
            KeySchema: [
              { AttributeName: "type", KeyType: "HASH" },
              { AttributeName: "id", KeyType: "RANGE" },
            ],
            Projection: { ProjectionType: "ALL" },
          },
        ],
      }),
    );
    await waitActive(tableName);
    console.log(`Created table ${tableName} (ACTIVE).`);
  } catch (e) {
    if (e && e.name === "ResourceInUseException") {
      console.log(`Table ${tableName} already exists — skipping create.`);
      return;
    }
    throw e;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
