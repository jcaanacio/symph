import "reflect-metadata";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
dotenv.config();

const app = express();
import { db } from "./db/knex";
import { DataSource } from "typeorm";
import { UriEntity } from "./infra/entities/UriEntity";
import { ShortenUrlService } from "./application/usecases/ShortenUrlService";
import { UriRepository } from "./infra/repositories/UriRepository";
import { UriController } from "./infra/controllers/UriController";
import { asyncHandler } from "./infra/middlewares/AsyncHandler";
import { SymphError } from "./domain/SymphError";
import { UriInMemoryRepository } from "./infra/repositories/UriInMemoryRepository";
import { initRedis, redis } from "./infra/cache/redis";
import { Uuid } from "./infra/utils/uuid";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./infra/utils/rest-docs";

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//middleware
app.use(cors());
app.use(express.json());

/*
##################################################
||                                              ||
||              Example endpoints               ||
||                                              ||
##################################################
*/

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "symph",
  password: "symph",
  database: "symph",
  synchronize: true,
  logging: true,
  entities: [UriEntity],
});

AppDataSource.initialize().then(() => {
  initRedis();
  const uriRepo = new UriRepository(AppDataSource.getRepository(UriEntity));
  const cachedRepo = new UriInMemoryRepository(uriRepo);
  const uuid = new Uuid();
  const service = new ShortenUrlService(cachedRepo, uuid);
  const controller = new UriController(service);

  app.post(
    "/api/uri",
    asyncHandler((req, res) => controller.create(req, res))
  );
  app.get(
    "/api/uri/:id",
    asyncHandler((req, res) => controller.getById(req, res))
  );
  app.get(
    "/api/uri",
    asyncHandler((req, res) => controller.getAll(req, res))
  );
  app.delete(
    "/api/uri/:id",
    asyncHandler((req, res) => controller.delete(req, res))
  );
  app.put(
    "/api/uri/:id",
    asyncHandler((req, res) => controller.update(req, res))
  );

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof SymphError) {
      return res.status(400).json({
        errorCode: err.errorCode,
        errorType: err.errorType,
        message: err.message,
      });
    }

    console.error(err);
    res.status(500).json({
      errorCode: "INTERNAL_ERROR",
      errorType: "Service",
      message: "Something went wrong.",
    });
  });

  app.listen(3001, () =>
    console.log("🚀 URL Shortener running on http://localhost:3001")
  );
});
