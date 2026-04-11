from django.shortcuts import render


def home(request):
    """Página SSR del monolito: resumen y enlaces a frontends y API."""
    return render(
        request,
        "home.html",
        {
            "titulo": "Fiestas (monolito Django)",
        },
    )
