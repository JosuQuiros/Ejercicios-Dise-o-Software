from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal, InvalidOperation

from django.db.models import F

from fiestas.models import Fiesta
from fiestas.repositories import FiestaRepository


@dataclass
class CrearFiestaInput:
    nombre: str
    ubicacion: str
    capacidad: int
    descripcion: str = ""
    latitud: str | None = None
    longitud: str | None = None


class FiestaServiceError(Exception):
    pass


class FiestaService:
    def __init__(self, repo: FiestaRepository | None = None) -> None:
        self._repo = repo or FiestaRepository()

    def crear(self, data: CrearFiestaInput) -> Fiesta:
        nombre = (data.nombre or "").strip()
        ubicacion = (data.ubicacion or "").strip()
        if not nombre or not ubicacion:
            raise FiestaServiceError("nombre y ubicacion son obligatorios")
        if data.capacidad < 1:
            raise FiestaServiceError("capacidad debe ser al menos 1")

        lat, lng = self._parse_coord(data.latitud), self._parse_coord(data.longitud)

        return self._repo.create(
            nombre=nombre,
            descripcion=(data.descripcion or "").strip(),
            ubicacion=ubicacion,
            capacidad=int(data.capacidad),
            latitud=lat,
            longitud=lng,
        )

    def listar_disponibles(self):
        """Fiestas con al menos un cupo libre (aceptadas < capacidad)."""
        qs = self._repo.list_with_cupo().annotate(
            cupo_restante=F("capacidad") - F("aceptadas_count"),
        )
        return qs.filter(cupo_restante__gt=0)

    def listar_todas(self):
        return self._repo.list_with_cupo().annotate(
            cupo_restante=F("capacidad") - F("aceptadas_count"),
        )

    def obtener(self, fiesta_id: int) -> Fiesta | None:
        return self._repo.get_by_id(fiesta_id)

    @staticmethod
    def _parse_coord(value: str | None) -> Decimal | None:
        if value is None or value == "":
            return None
        try:
            return Decimal(str(value))
        except InvalidOperation as exc:
            raise FiestaServiceError("coordenada inválida") from exc
