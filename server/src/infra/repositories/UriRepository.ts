import { Repository } from "typeorm";
import { UriEntity } from "../entities/UriEntity";
import { Uri } from "@app/domain/Uri";
import { IUriRepository } from "@app/application/interfaces/IUriRepository";

export class UriRepository implements IUriRepository {
  constructor(private readonly repo: Repository<UriEntity>) {}

  async save(domain: Uri): Promise<Uri> {
    const entity = new UriEntity(domain);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async findBySlug(slug: string): Promise<Uri | null> {
    const entity = await this.repo.findOne({ where: { slug } });
    return entity ? this.toDomain(entity) : null;
  }

  async findById(id: string): Promise<Uri | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAllPaginated(page = 1, limit = 10): Promise<Uri[]> {
    const offset = (page - 1) * limit;

    const entities = await this.repo.find({
      order: { createdAt: "DESC" },
      skip: offset,
      take: limit,
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  private toDomain(entity: UriEntity): Uri {
    return new Uri({
      id: entity.id,
      slug: entity.slug!,
      originalUrl: entity.originalUrl,
      shortUrl: entity.shortUrl,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      expiresAt: entity.expiresAt,
      utmSource: entity.utmSource,
      utmMedium: entity.utmMedium,
      utmCampaign: entity.utmCampaign,
      utmTerm: entity.utmTerm,
      utmContent: entity.utmContent,
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async update(id: string, updatedFields: Partial<Uri>): Promise<Uri | null> {
    await this.repo.update({ id }, updatedFields);
    const updated = await this.repo.findOne({ where: { id } });
    return updated ? this.toDomain(updated) : null;
  }

  async countAll(): Promise<number> {
    return await this.repo.count();
  }
}
