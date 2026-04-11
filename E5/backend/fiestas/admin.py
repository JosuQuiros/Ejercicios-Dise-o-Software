from django.contrib import admin

from fiestas.models import Fiesta, Invitacion


@admin.register(Fiesta)
class FiestaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "ubicacion", "capacidad", "creada_en")
    search_fields = ("nombre", "ubicacion")


@admin.register(Invitacion)
class InvitacionAdmin(admin.ModelAdmin):
    list_display = ("nombre_invitado", "fiesta", "estado", "creada_en")
    list_filter = ("estado",)
