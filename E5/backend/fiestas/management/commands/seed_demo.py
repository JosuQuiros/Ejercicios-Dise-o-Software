from decimal import Decimal

from django.core.management.base import BaseCommand

from fiestas.repositories import FiestaRepository, InvitacionRepository


class Command(BaseCommand):
    help = "Inserta pocas fiestas e invitaciones de ejemplo en SQLite."

    def handle(self, *args, **options):
        fr = FiestaRepository()
        ir = InvitacionRepository()

        if fr.list_all().exists():
            self.stdout.write(self.style.WARNING("Ya hay datos; no se duplicó el seed."))
            return

        f1 = fr.create(
            nombre="Noche en la finca",
            descripcion="Traer abrigo.",
            ubicacion="Camino Real km 12",
            capacidad=8,
            latitud=Decimal("19.432608"),
            longitud=Decimal("-99.133209"),
        )
        f2 = fr.create(
            nombre="Casa centro",
            ubicacion="Calle Falsa 123",
            capacidad=20,
            latitud=Decimal("19.419481"),
            longitud=Decimal("-99.145535"),
        )
        ir.create_solicitud(fiesta_id=f1.id, nombre_invitado="Ana")
        ir.create_solicitud(fiesta_id=f1.id, nombre_invitado="Luis")
        inv = ir.create_solicitud(fiesta_id=f2.id, nombre_invitado="Marta")
        ir.marcar_aceptada(inv)

        self.stdout.write(self.style.SUCCESS(f"Seed listo: fiestas {f1.id}, {f2.id}"))
