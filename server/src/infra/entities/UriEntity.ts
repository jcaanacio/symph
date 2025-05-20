import { Uri } from "@app/domain/Uri";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity("short_urls")
export class UriEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 16, unique: true })
  @Index()
  slug: string | undefined;

  @Column({ type: "text" })
  originalUrl!: string;

  @Column({ type: "text" })
  shortUrl!: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  @Index()
  expiresAt?: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  utmSource?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  utmMedium?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  utmCampaign?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  utmTerm?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  utmContent?: string;
  clickCount: any;

  constructor(domain?: Uri) {
    if (!domain) return;
    this.id = domain.id;
    this.slug = domain.slug;
    this.originalUrl = domain.originalUrl;
    this.shortUrl = domain.shortUrl;
    this.createdAt = domain.createdAt;
    this.updatedAt = domain.updatedAt;
    this.expiresAt = domain.expiresAt;
    this.utmSource = domain.utmSource;
    this.utmMedium = domain.utmMedium;
    this.utmCampaign = domain.utmCampaign;
    this.utmTerm = domain.utmTerm;
    this.utmContent = domain.utmContent;
    this.createdAt = domain.createdAt;
    this.updatedAt = domain.updatedAt;
  }
}
