from django.urls import path

from fiestas.views import api, ssr

urlpatterns = [
    path("", ssr.home, name="home"),
    path("fiestas", api.fiestas_collection, name="fiestas_collection"),
    path("fiestas/ubicaciones", api.fiestas_ubicaciones, name="fiestas_ubicaciones"),
    path(
        "fiestas/<int:fiesta_id>/invitaciones/pendientes",
        api.fiesta_invitaciones_pendientes,
        name="fiesta_invitaciones_pendientes",
    ),
    path(
        "fiestas/<int:fiesta_id>/invitaciones",
        api.fiesta_solicitud_invitacion,
        name="fiesta_solicitud_invitacion",
    ),
    path(
        "fiestas/<int:fiesta_id>/invitaciones/<int:invitacion_id>/aceptar",
        api.fiesta_aceptar_invitacion,
        name="fiesta_aceptar_invitacion",
    ),
]
