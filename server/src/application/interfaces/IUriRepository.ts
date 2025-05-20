import { Uri } from "@app/domain/Uri";

export interface IUriRepository {
  findById(id: string): Promise<Uri | null>;
  save(uri: Uri): Promise<Uri>;
  deleteById(id: string): Promise<void>;
  update(id: string, updatedFields: Partial<Uri>): Promise<Uri | null>;
  findAllPaginated(page?: number, limit?: number): Promise<Uri[]>;
  countAll(): Promise<number>;
}
