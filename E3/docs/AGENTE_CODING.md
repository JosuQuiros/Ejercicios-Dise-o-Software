# Agente / IA para generación del código

Este entregable incluye documentación del uso de una **IA especializada en coding** (por ejemplo Cursor Agent o ChatGPT con rol de desarrollador) para producir la implementación.

## Rol del agente

- **Nombre sugerido:** `coding-backend-frontend`
- **Objetivo:** Implementar una API REST en Node (Express) con capas obligatorias y un cliente React CSR, cumpliendo el enunciado del curso sin servicios externos (MongoDB local).

## Prompt base (adaptable)

```
Necesito un ejercicio académico con estas restricciones estrictas:
- Backend: Node.js + Express + REST, MongoDB local con Mongoose.
- Capas obligatorias: controllers, services, repositories, model, dto.
- Endpoints: POST /amantes (nombre, edad, intereses) y GET /amantes?interes=x
- Validaciones básicas en DTOs.
- Seed mínimo si la BD está vacía al arrancar.
- Scripts: npm run dev y npm run start en backend (node --watch / node).
- Frontend: React Vite, client-side rendering, capa repositories separada para llamadas HTTP.
- Scripts frontend: npm run dev (vite) y npm run start (vite preview tras build).
- CORS para desarrollo local. Todo sin APIs de terceros.
Genera dos carpetas de proyecto listas para subir como dos repos: amantes-backend y amantes-frontend.
```

## Commits sugeridos (pareja)

1. `chore: inicializar backend express con capas y seed`
2. `feat: POST/GET amantes con DTOs y repositorio Mongo`
3. `feat: frontend react con repositorio HTTP y UI básica`
4. `docs: agente IA y guía de ejecución local`

Cada integrante puede tomar commits distintos (backend vs frontend o capas alternas) para que quede trazabilidad en GitHub.

## Qué revisar en la defensa oral

- **Paradigma:** orientado a objetos liviano en JS (clases en service/controller/repository) + REST stateless.
- **Topología:** dos procesos locales (API + SPA); el navegador consume JSON por HTTP; la BD es otro proceso (mongod).
- **Desac acoplamiento:** la UI solo conoce el contrato HTTP vía `AmanteApiRepository`; el dominio de persistencia vive en el repositorio del backend.
