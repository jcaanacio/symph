import { Uri } from "@app/domain/Uri";
import { CONSTANTS } from "@app/infra/utils/constants";
import { IUuid } from "../interfaces/IUuid";
import { IUriInMemoryRepository } from "../interfaces/IUriInMemoryRepository";

export class ShortenUrlService {
  constructor(
    private readonly uriRepo: IUriInMemoryRepository,
    private readonly uuid: IUuid
  ) {}

  async create(input: {
    originalUrl: string;
    slug?: string;
    expiresAt?: Date;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
  }): Promise<Uri> {
    const slug = input.slug || this.generateSlug();
    const shortUrl = `https://symph.co/${slug}`;

    const data = {
      id: this.uuid.getUuid(),
      slug,
      originalUrl: input.originalUrl,
      shortUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: input.expiresAt,
      clickCount: 0,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      utmTerm: input.utmTerm,
      utmContent: input.utmContent,
    };

    return this.uriRepo.save(new Uri(data));
  }

  async getById(id: string): Promise<Uri | null> {
    return this.uriRepo.findById(id);
  }

  async getAll(
    page = CONSTANTS.PAGINATION_PAGE,
    limit = CONSTANTS.PAGINATION_LIMIT
  ): Promise<{ results: Uri[]; page: number; totalPages: number }> {
    const results = await this.uriRepo.findAllPaginated(page, limit);
    const total = await this.uriRepo.countAll();
    const totalPages = Math.ceil(total / limit);

    return {
      results,
      page,
      totalPages,
    };
  }

  private generateSlug(): string {
    return this.uuid.getUuid().replace(/-/g, "").slice(0, 8);
  }

  async delete(id: string): Promise<void> {
    return this.uriRepo.deleteById(id);
  }

  async update(id: string, updateData: Partial<Uri>): Promise<Uri | null> {
    return this.uriRepo.update(id, updateData);
  }
}
