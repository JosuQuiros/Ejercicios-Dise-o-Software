from __future__ import annotations

from decimal import Decimal
from django.db.models import Count, Q, QuerySet

from fiestas.models import Fiesta
from fiestas.models.invitacion import EstadoInvitacion


class FiestaRepository:
    """Acceso a datos de fiestas (sin reglas de negocio)."""

    def create(
        self,
        *,
        nombre: str,
        ubicacion: str,
        capacidad: int,
        descripcion: str = "",
        latitud: Decimal | None = None,
        longitud: Decimal | None = None,
    ) -> Fiesta:
        return Fiesta.objects.create(
            nombre=nombre,
            descripcion=descripcion,
            ubicacion=ubicacion,
            capacidad=capacidad,
            latitud=latitud,
            longitud=longitud,
        )

    def get_by_id(self, fiesta_id: int) -> Fiesta | None:
        return Fiesta.objects.filter(pk=fiesta_id).first()

    def list_with_cupo(self) -> QuerySet[Fiesta]:
        """Fiestas con conteo de aceptados y cupo restante (anotación)."""
        aceptadas = Count(
            "invitaciones",
            filter=Q(invitaciones__estado=EstadoInvitacion.ACEPTADA),
        )
        return Fiesta.objects.annotate(aceptadas_count=aceptadas)

    def list_all(self) -> QuerySet[Fiesta]:
        return Fiesta.objects.all()
