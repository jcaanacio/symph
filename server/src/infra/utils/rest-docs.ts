// src/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description: "Symph Take-Home Exam API Docs",
    },
    servers: [{ url: "http://localhost:3001" }],
  },
  apis: ["./src/infra/controllers/*.ts"], // adjust as needed
});
