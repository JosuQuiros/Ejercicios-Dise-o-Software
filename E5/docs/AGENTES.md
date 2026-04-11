# Agentes y uso de IA (entregable curso)

Este ejemplo se diseñó para cumplir el enunciado: monolito Django (SSR + JSON), capas modelo / repositorio / servicio / vista, dos frontends empaquetados por separado y SQLite local.

## Rol del asistente de código

Se utilizó un asistente de código (por ejemplo Cursor Agent) con estas instrucciones efectivas:

1. **Arquitectura**: mantener la lógica de negocio fuera de las vistas HTTP; los repositorios solo acceden a Django ORM; los servicios validan reglas (cupo, estados).
2. **Contrato HTTP**: `GET /fiestas` y `POST /fiestas` exactamente bajo el prefijo del monolito; rutas adicionales documentadas en la plantilla SSR.
3. **Frontends**: Vite en puertos distintos con `proxy` hacia `127.0.0.1:8000` para evitar CORS en desarrollo (CORS también está configurado en Django).
4. **Operabilidad**: scripts independientes para servidor y cada bundle.

## Preguntas frecuentes (defensa oral / escrita)

- **Paradigma**: orientación a capas dentro de un monolito; no es microservicios; los frontends son clientes del mismo despliegue.
- **Topología**: un proceso Django + dos dev servers de Vite; en producción se publicarían estáticos o dominios distintos detrás del mismo API.
- **SSR**: la ruta `/` renderiza plantilla Django; las operaciones de listado/escritura del enunciado están en JSON para los clientes ligeros.

## Commits en parejas

Cada integrante debe tener commits propios en GitHub (merge, features o capas distintas) según lo que pida el profesor.

## Cómo ejecutar el proyecto

Instrucciones actualizadas de entorno, orden de arranque (Django primero, luego los dos Vite) y solución de problemas comunes: ver [README.md](../README.md) en la raíz del monorepo `E5/`.
