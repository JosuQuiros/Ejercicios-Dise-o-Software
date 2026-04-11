from __future__ import annotations

from typing import Any

from fiestas.models import Fiesta, Invitacion


def fiesta_to_dict(f: Fiesta, *, aceptadas: int | None = None, cupo_restante: int | None = None) -> dict[str, Any]:
    out: dict[str, Any] = {
        "id": f.id,
        "nombre": f.nombre,
        "descripcion": f.descripcion,
        "ubicacion": f.ubicacion,
        "capacidad": f.capacidad,
        "latitud": str(f.latitud) if f.latitud is not None else None,
        "longitud": str(f.longitud) if f.longitud is not None else None,
        "creada_en": f.creada_en.isoformat(),
    }
    if aceptadas is not None:
        out["aceptadas"] = aceptadas
    if cupo_restante is not None:
        out["cupo_restante"] = cupo_restante
    if hasattr(f, "aceptadas_count") and aceptadas is None:
        out["aceptadas"] = int(f.aceptadas_count)  # type: ignore[attr-defined]
    if hasattr(f, "cupo_restante") and cupo_restante is None:
        out["cupo_restante"] = int(f.cupo_restante)  # type: ignore[attr-defined]
    return out


def invitacion_to_dict(i: Invitacion) -> dict[str, Any]:
    return {
        "id": i.id,
        "fiesta_id": i.fiesta_id,
        "nombre_invitado": i.nombre_invitado,
        "estado": i.estado,
        "creada_en": i.creada_en.isoformat(),
    }
