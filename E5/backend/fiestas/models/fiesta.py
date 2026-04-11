from django.db import models


class Fiesta(models.Model):
    """Evento en una ubicación con cupo máximo de invitados aceptados."""

    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    ubicacion = models.CharField(max_length=500, help_text="Dirección o referencia")
    latitud = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitud = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    capacidad = models.PositiveIntegerField()
    creada_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-creada_en"]

    def __str__(self) -> str:
        return self.nombre
