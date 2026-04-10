import { AmanteService } from '../services/amante.service.js';

export class AmanteController {
  /** @param {AmanteService} service */
  constructor(service = new AmanteService()) {
    this.service = service;
  }

  crear = async (req, res) => {
    const result = await this.service.crearPerfil(req.body);
    res.status(result.status).json(result.body);
  };

  listar = async (req, res) => {
    const result = await this.service.listarPorInteres(req.query);
    res.status(result.status).json(result.body);
  };
}
