import { Uri } from "@app/domain/Uri";
import { UriRepository } from "./UriRepository";
import { redis } from "../cache/redis";
import { IUriInMemoryRepository } from "@app/application/interfaces/IUriInMemoryRepository";
import { IUriRepository } from "@app/application/interfaces/IUriRepository";

export class UriInMemoryRepository implements IUriInMemoryRepository {
  constructor(private readonly dbRepo: IUriRepository) {}

  async findById(id: string): Promise<Uri | null> {
    const cacheKey = `uri:id:${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return new Uri(JSON.parse(cached));
    }

    const result = await this.dbRepo.findById(id);
    if (result) {
      await redis.set(cacheKey, JSON.stringify(result), {
        EX: 60, // 5 minutes
      });
    }

    return result;
  }

  async save(uri: Uri): Promise<Uri> {
    const saved = await this.dbRepo.save(uri);
    const cacheKey = `uri:id:${saved.id}`;
    await redis.set(cacheKey, JSON.stringify(saved), {
      EX: 60,
    });
    return saved;
  }

  async deleteById(id: string): Promise<void> {
    await this.dbRepo.deleteById(id);
    await redis.del(`uri:id:${id}`);
  }

  async update(id: string, updatedFields: Partial<Uri>): Promise<Uri | null> {
    const updated = await this.dbRepo.update(id, updatedFields);
    if (updated) {
      await redis.set(`uri:id:${id}`, JSON.stringify(updated), {
        EX: 60,
      });
    }
    return updated;
  }

  async findAllPaginated(page = 1, limit = 10): Promise<Uri[]> {
    const cacheKey = `uri:page:${page}:limit:${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsedArray = JSON.parse(cached);
      return parsedArray.map((item: any) => Uri.fromJSON(item));
    }

    const results = await this.dbRepo.findAllPaginated(page, limit);

    if (results.length > 0) {
      await redis.set(cacheKey, JSON.stringify(results), {
        EX: 60, // cache TTL
      });
    }

    return results;
  }

  async countAll(): Promise<number> {
    const cacheKey = "uri:count";
    const cached = await redis.get(cacheKey);

    if (cached) {
      return parseInt(cached, 10);
    }

    const count = await this.dbRepo.countAll();
    await redis.set(cacheKey, count.toString(), { EX: 60 }); // cache for 1 min
    return count;
  }
}
