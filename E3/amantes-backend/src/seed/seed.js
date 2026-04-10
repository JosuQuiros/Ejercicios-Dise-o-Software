import { AmanteRepository } from '../repositories/amante.repository.js';

const seedItems = [
  { nombre: 'Ana Martínez', edad: 28, intereses: ['música', 'senderismo', 'cine'] },
  { nombre: 'Luis Gómez', edad: 31, intereses: ['lectura', 'cocina', 'música'] },
  { nombre: 'Sofía Ruiz', edad: 26, intereses: ['deportes', 'viajes', 'fotografía'] },
  { nombre: 'Diego Pérez', edad: 29, intereses: ['tecnología', 'juegos', 'música'] },
];

/**
 * Carga datos mínimos solo si la colección está vacía.
 */
export async function runSeed() {
  const repo = new AmanteRepository();
  const { inserted } = await repo.insertManyIfEmpty(seedItems);
  if (inserted > 0) {
    console.log(`[seed] Insertados ${inserted} perfiles de ejemplo.`);
  }
}
