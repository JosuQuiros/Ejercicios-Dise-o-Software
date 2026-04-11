from __future__ import annotations

from dataclasses import dataclass

from fiestas.models import Invitacion
from fiestas.models.invitacion import EstadoInvitacion
from fiestas.repositories import FiestaRepository, InvitacionRepository


class InvitacionServiceError(Exception):
    pass


@dataclass
class SolicitudInvitadoInput:
    fiesta_id: int
    nombre_invitado: str


class InvitacionService:
    def __init__(
        self,
        inv_repo: InvitacionRepository | None = None,
        fiesta_repo: FiestaRepository | None = None,
    ) -> None:
        self._inv = inv_repo or InvitacionRepository()
        self._fiesta = fiesta_repo or FiestaRepository()

    def solicitar_entrada(self, data: SolicitudInvitadoInput) -> Invitacion:
        nombre = (data.nombre_invitado or "").strip()
        if not nombre:
            raise InvitacionServiceError("nombre_invitado es obligatorio")
        fiesta = self._fiesta.get_by_id(data.fiesta_id)
        if not fiesta:
            raise InvitacionServiceError("fiesta no encontrada")
        return self._inv.create_solicitud(fiesta_id=data.fiesta_id, nombre_invitado=nombre)

    def listar_pendientes(self, fiesta_id: int) -> list[Invitacion]:
        if not self._fiesta.get_by_id(fiesta_id):
            raise InvitacionServiceError("fiesta no encontrada")
        return list(self._inv.list_pendientes_por_fiesta(fiesta_id))

    def aceptar(self, fiesta_id: int, invitacion_id: int) -> Invitacion:
        inv = self._inv.get_by_id(invitacion_id)
        if not inv or inv.fiesta_id != fiesta_id:
            raise InvitacionServiceError("invitación no encontrada")
        if inv.estado != EstadoInvitacion.PENDIENTE:
            raise InvitacionServiceError("solo se pueden aceptar solicitudes pendientes")

        fiesta = self._fiesta.get_by_id(fiesta_id)
        assert fiesta is not None
        aceptadas = self._inv.count_aceptadas(fiesta_id)
        if aceptadas >= fiesta.capacidad:
            raise InvitacionServiceError("cupo completo")

        return self._inv.marcar_aceptada(inv)
