from __future__ import annotations

from django.db.models import QuerySet

from fiestas.models import Invitacion
from fiestas.models.invitacion import EstadoInvitacion


class InvitacionRepository:
    def create_solicitud(self, *, fiesta_id: int, nombre_invitado: str) -> Invitacion:
        return Invitacion.objects.create(
            fiesta_id=fiesta_id,
            nombre_invitado=nombre_invitado,
            estado=EstadoInvitacion.PENDIENTE,
        )

    def get_by_id(self, invitacion_id: int) -> Invitacion | None:
        return Invitacion.objects.filter(pk=invitacion_id).first()

    def list_pendientes_por_fiesta(self, fiesta_id: int) -> QuerySet[Invitacion]:
        return Invitacion.objects.filter(
            fiesta_id=fiesta_id,
            estado=EstadoInvitacion.PENDIENTE,
        )

    def count_aceptadas(self, fiesta_id: int) -> int:
        return Invitacion.objects.filter(
            fiesta_id=fiesta_id,
            estado=EstadoInvitacion.ACEPTADA,
        ).count()

    def marcar_aceptada(self, invitacion: Invitacion) -> Invitacion:
        invitacion.estado = EstadoInvitacion.ACEPTADA
        invitacion.save(update_fields=["estado"])
        return invitacion

    def marcar_rechazada(self, invitacion: Invitacion) -> Invitacion:
        invitacion.estado = EstadoInvitacion.RECHAZADA
        invitacion.save(update_fields=["estado"])
        return invitacion
