import { ShortenUrlService } from "@app/application/usecases/ShortenUrlService";
import { SymphError } from "@app/domain/SymphError";
import { Request, Response } from "express";

export class UriController {
  constructor(private readonly service: ShortenUrlService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const uri = await this.service.create(req.body);
      res.status(201).json(uri);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const uri = await this.service.getById(id);

    if (!uri) {
      throw new SymphError({
        errorCode: 404,
        errorType: "Client",
        message: "The requested URI was not found.",
      });
    }

    res.status(200).json(uri);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const uris = await this.service.getAll(page, limit);
      res.status(200).json(uris);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await this.service.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const updated = await this.service.update(id, req.body);

      if (!updated) {
        res.status(404).json({ message: "URI not found" });
        return;
      }

      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
