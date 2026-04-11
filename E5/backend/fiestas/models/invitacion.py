from django.db import models

from fiestas.models.fiesta import Fiesta


class EstadoInvitacion(models.TextChoices):
    PENDIENTE = "pendiente", "Pendiente"
    ACEPTADA = "aceptada", "Aceptada"
    RECHAZADA = "rechazada", "Rechazada"


class Invitacion(models.Model):
    fiesta = models.ForeignKey(Fiesta, on_delete=models.CASCADE, related_name="invitaciones")
    nombre_invitado = models.CharField(max_length=200)
    estado = models.CharField(
        max_length=20,
        choices=EstadoInvitacion.choices,
        default=EstadoInvitacion.PENDIENTE,
    )
    creada_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["creada_en"]

    def __str__(self) -> str:
        return f"{self.nombre_invitado} → {self.fiesta_id}"
