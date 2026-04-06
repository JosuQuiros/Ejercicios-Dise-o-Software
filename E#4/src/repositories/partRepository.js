const { PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { getDocumentClient } = require("../lib/dynamoClient");

class PartRepository {
  /**
   * @param {{ tableName: string }} opts
   */
  constructor(opts) {
    this.tableName = opts.tableName;
    this.doc = getDocumentClient();
  }

  /** @param {{ id: string, name: string, type: string, price: number, createdAt: string }} part */
  async save(part) {
    await this.doc.send(
      new PutCommand({
        TableName: this.tableName,
        Item: part,
      }),
    );
    return part;
  }

  /** @param {string} type */
  async findByType(type) {
    const out = await this.doc.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: "type-index",
        KeyConditionExpression: "#t = :type",
        ExpressionAttributeNames: { "#t": "type" },
        ExpressionAttributeValues: { ":type": type },
      }),
    );
    return /** @type {Array<{ id: string, name: string, type: string, price: number, createdAt: string }>} */ (
      out.Items || []
    );
  }
}

function getTableName() {
  const name = process.env.PARTS_TABLE;
  if (!name) {
    throw new Error("PARTS_TABLE environment variable is not set");
  }
  return name;
}

function createPartRepository() {
  return new PartRepository({ tableName: getTableName() });
}

module.exports = {
  PartRepository,
  createPartRepository,
};
