import { parseCreateAmanteDto } from '../dto/create-amante.dto.js';
import { parseListAmantesQueryDto } from '../dto/list-amantes-query.dto.js';
import { AmanteRepository } from '../repositories/amante.repository.js';

export class AmanteService {
  /** @param {AmanteRepository} repository */
  constructor(repository = new AmanteRepository()) {
    this.repository = repository;
  }

  async crearPerfil(body) {
    const parsed = parseCreateAmanteDto(body);
    if (!parsed.ok) {
      return { status: 400, body: { message: 'Validación fallida', errors: parsed.errors } };
    }
    const created = await this.repository.create(parsed.value);
    return { status: 201, body: created };
  }

  async listarPorInteres(query) {
    const parsed = parseListAmantesQueryDto(query);
    if (!parsed.ok) {
      return { status: 400, body: { message: 'Validación fallida', errors: parsed.errors } };
    }
    const list = await this.repository.findByInteres(parsed.value.interes);
    return { status: 200, body: list };
  }
}
