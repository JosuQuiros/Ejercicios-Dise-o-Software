from __future__ import annotations

import json
from typing import Any, Callable

from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from fiestas.services import FiestaService, InvitacionService
from fiestas.services.fiesta_service import CrearFiestaInput, FiestaServiceError
from fiestas.services.invitacion_service import InvitacionServiceError, SolicitudInvitadoInput
from fiestas.views.serializers import fiesta_to_dict, invitacion_to_dict


def _json_error(message: str, status: int = 400) -> JsonResponse:
    return JsonResponse({"error": message}, status=status)


def _read_json(request: HttpRequest) -> dict[str, Any]:
    try:
        body = request.body.decode() or "{}"
        data = json.loads(body)
        if not isinstance(data, dict):
            return {}
        return data
    except json.JSONDecodeError:
        return {}


def csrf_exempt_json(view: Callable[..., JsonResponse]) -> Callable[..., JsonResponse]:
    return csrf_exempt(view)


@csrf_exempt_json
@require_http_methods(["GET", "POST"])
def fiestas_collection(request: HttpRequest) -> JsonResponse:
    service = FiestaService()
    if request.method == "GET":
        items = [fiesta_to_dict(f) for f in service.listar_disponibles()]
        return JsonResponse({"fiestas": items}, safe=False)

    data = _read_json(request)
    try:
        f = service.crear(
            CrearFiestaInput(
                nombre=str(data.get("nombre", "")),
                ubicacion=str(data.get("ubicacion", "")),
                capacidad=int(data.get("capacidad", 0)),
                descripcion=str(data.get("descripcion", "")),
                latitud=data.get("latitud") if data.get("latitud") is not None else None,
                longitud=data.get("longitud") if data.get("longitud") is not None else None,
            )
        )
    except (ValueError, TypeError):
        return _json_error("JSON inválido: capacidad debe ser entero")
    except FiestaServiceError as e:
        return _json_error(str(e))

    return JsonResponse(fiesta_to_dict(f), status=201)


@require_GET
def fiestas_ubicaciones(request: HttpRequest) -> JsonResponse:
    """Listado con coordenadas para el frontend de mapa (todas las fiestas)."""
    service = FiestaService()
    items = [fiesta_to_dict(f) for f in service.listar_todas()]
    return JsonResponse({"fiestas": items}, safe=False)


@csrf_exempt_json
@require_http_methods(["POST"])
def fiesta_solicitud_invitacion(request: HttpRequest, fiesta_id: int) -> JsonResponse:
    data = _read_json(request)
    svc = InvitacionService()
    try:
        inv = svc.solicitar_entrada(
            SolicitudInvitadoInput(
                fiesta_id=fiesta_id,
                nombre_invitado=str(data.get("nombre_invitado", "")),
            )
        )
    except InvitacionServiceError as e:
        return _json_error(str(e), 404 if "no encontrada" in str(e) else 400)
    return JsonResponse(invitacion_to_dict(inv), status=201)


@require_GET
def fiesta_invitaciones_pendientes(request: HttpRequest, fiesta_id: int) -> JsonResponse:
    svc = InvitacionService()
    try:
        pend = svc.listar_pendientes(fiesta_id)
    except InvitacionServiceError as e:
        return _json_error(str(e), 404)
    return JsonResponse({"invitaciones": [invitacion_to_dict(i) for i in pend]}, safe=False)


@csrf_exempt_json
@require_http_methods(["POST"])
def fiesta_aceptar_invitacion(request: HttpRequest, fiesta_id: int, invitacion_id: int) -> JsonResponse:
    svc = InvitacionService()
    try:
        inv = svc.aceptar(fiesta_id, invitacion_id)
    except InvitacionServiceError as e:
        status = 404 if "no encontrada" in str(e) else 400
        return _json_error(str(e), status)
    return JsonResponse(invitacion_to_dict(inv))
