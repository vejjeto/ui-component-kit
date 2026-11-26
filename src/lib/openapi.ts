import { env } from "@/lib/env";

export function getForgeOpenApiSpec(): Record<string, unknown> {
  return {
    openapi: "3.1.0",
    info: {
      title: "ForgeUI API",
      version: "2.0.0",
      description:
        "API estática/edge de ForgeUI (ui-component-kit) para observabilidad, documentación OpenAPI y Shadcn Registry.",
    },
    servers: [{ url: env.NEXT_PUBLIC_APP_URL }],
    tags: [
      { name: "Observability", description: "Estado stateless del runtime" },
      { name: "Documentation", description: "Especificación OpenAPI 3.1.0" },
      {
        name: "Registry",
        description: "Artefactos compatibles con Shadcn CLI",
      },
    ],
    paths: {
      "/api/health": {
        get: {
          tags: ["Observability"],
          summary: "Verifica la disponibilidad stateless del servicio",
          responses: {
            "200": {
              description:
                "Estado del servicio con uptimeSeconds y x-request-id",
            },
          },
        },
      },
      "/api/openapi.json": {
        get: {
          tags: ["Documentation"],
          summary: "Devuelve la especificación OpenAPI 3.1.0 de ForgeUI",
          responses: {
            "200": {
              description: "Documento JSON OpenAPI 3.1.0",
            },
          },
        },
      },
      "/api/docs": {
        get: {
          tags: ["Documentation"],
          summary: "Consola interactiva Scalar para explorar la API",
          responses: {
            "200": {
              description: "HTML interactivo Scalar",
            },
          },
        },
      },
      "/r/index.json": {
        get: {
          tags: ["Registry"],
          summary: "Índice del Shadcn Registry con los 12 componentes",
          responses: {
            "200": {
              description: "Catálogo JSON del registry",
            },
          },
        },
      },
      "/r/{slug}.json": {
        get: {
          tags: ["Registry"],
          summary:
            "Definición individual de componente compatible con npx shadcn@latest add",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "RegistryItem JSON del componente",
            },
          },
        },
      },
    },
  };
}
