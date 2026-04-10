import { AmanteModel } from '../models/amante.model.js';

export class AmanteRepository {
  /**
   * @param {{ nombre: string, edad: number, intereses: string[] }} data
   */
  async create(data) {
    const doc = await AmanteModel.create(data);
    return doc.toObject();
  }

  /**
   * Coincidencia por interés (comparación insensible a mayúsculas; valor exacto en la lista).
   * @param {string} interesNormalizado lowercase
   */
  async findByInteres(interesNormalizado) {
    const docs = await AmanteModel.find({
      intereses: interesNormalizado,
    })
      .sort({ nombre: 1 })
      .lean()
      .exec();
    return docs;
  }

  async count() {
    return AmanteModel.countDocuments();
  }

  /**
   * @param {Array<{ nombre: string, edad: number, intereses: string[] }>} items
   */
  async insertManyIfEmpty(items) {
    const n = await this.count();
    if (n > 0) return { inserted: 0 };
    await AmanteModel.insertMany(items);
    return { inserted: items.length };
  }
}
