const { v4: uuidv4 } = require("uuid");
const { validateCreatePayload, validateTypeQuery } = require("../models/part");
const { createPartRepository } = require("../repositories/partRepository");

class PartService {
  /** @param {import('../repositories/partRepository').PartRepository} repository */
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * @param {unknown} body
   */
  async registerPart(body) {
    const parsed = validateCreatePayload(body);
    if (!parsed.ok) {
      return { ok: false, statusCode: 400, errors: parsed.errors };
    }

    const now = new Date().toISOString();
    const part = {
      id: uuidv4(),
      name: parsed.value.name,
      type: parsed.value.type,
      price: parsed.value.price,
      createdAt: now,
    };

    await this.repository.save(part);
    return { ok: true, statusCode: 201, part };
  }

  /**
   * @param {string | undefined} typeQuery from query string
   */
  async listByType(typeQuery) {
    const parsed = validateTypeQuery(typeQuery);
    if (!parsed.ok) {
      return { ok: false, statusCode: 400, errors: parsed.errors };
    }

    const items = await this.repository.findByType(parsed.value);
    return { ok: true, statusCode: 200, parts: items };
  }
}

function createPartService() {
  return new PartService(createPartRepository());
}

module.exports = {
  PartService,
  createPartService,
};
