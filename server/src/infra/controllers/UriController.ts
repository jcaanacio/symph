import { ShortenUrlService } from "@app/application/usecases/ShortenUrlService";
import { SymphError } from "@app/domain/SymphError";
import { Request, Response } from "express";

export class UriController {
  constructor(private readonly service: ShortenUrlService) {}

  /**
   * @openapi
   * /api/uri:
   *   post:
   *     summary: Create a new shortened URL
   *     tags:
   *       - URIs
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - originalUrl
   *             properties:
   *               originalUrl:
   *                 type: string
   *                 example: https://example.com/page
   *               slug:
   *                 type: string
   *                 example: custom-slug
   *               expiresAt:
   *                 type: string
   *                 format: date-time
   *                 example: 2025-12-31T23:59:59Z
   *     responses:
   *       201:
   *         description: Created successfully
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Internal server error
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const uri = await this.service.create(req.body);
      res.status(201).json(uri);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * @openapi
   * /api/uri/{id}:
   *   get:
   *     summary: Get a shortened URL by ID
   *     tags:
   *       - URIs
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the URI to retrieve
   *     responses:
   *       200:
   *         description: URI found
   *       404:
   *         description: URI not found
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @openapi
   * /api/uri:
   *   get:
   *     summary: Get all shortened URLs (paginated)
   *     tags:
   *       - URIs
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Items per page
   *     responses:
   *       200:
   *         description: List of URIs
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @openapi
   * /api/uri/{id}:
   *   delete:
   *     summary: Delete a shortened URL by ID
   *     tags:
   *       - URIs
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the URI to delete
   *     responses:
   *       204:
   *         description: Deleted successfully
   *       500:
   *         description: Internal server error
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await this.service.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * @openapi
   * /api/uri/{id}:
   *   put:
   *     summary: Update a shortened URL
   *     tags:
   *       - URIs
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the URI to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               originalUrl:
   *                 type: string
   *               slug:
   *                 type: string
   *               expiresAt:
   *                 type: string
   *                 format: date-time
   *     responses:
   *       200:
   *         description: URI updated successfully
   *       404:
   *         description: URI not found
   *       500:
   *         description: Internal server error
   */
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
