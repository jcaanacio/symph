export class Uri {
  private _id: string;
  private _slug: string;
  private _originalUrl: string;
  private _shortUrl: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _expiresAt?: Date;

  private _utmSource?: string;
  private _utmMedium?: string;
  private _utmCampaign?: string;
  private _utmTerm?: string;
  private _utmContent?: string;

  constructor(params: {
    id: string;
    slug: string;
    originalUrl: string;
    shortUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
    expiresAt?: Date;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
  }) {
    this._id = params.id;
    this._slug = params.slug;
    this._originalUrl = params.originalUrl;
    this._shortUrl = params.shortUrl;
    this._createdAt = params.createdAt ?? new Date();
    this._updatedAt = params.updatedAt ?? new Date();
    this._expiresAt = params.expiresAt;

    this._utmSource = params.utmSource;
    this._utmMedium = params.utmMedium;
    this._utmCampaign = params.utmCampaign;
    this._utmTerm = params.utmTerm;
    this._utmContent = params.utmContent;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get slug(): string {
    return this._slug;
  }

  get originalUrl(): string {
    return this._originalUrl;
  }

  get shortUrl(): string {
    return this._shortUrl;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get expiresAt(): Date | undefined {
    return this._expiresAt;
  }

  get utmSource(): string | undefined {
    return this._utmSource;
  }

  get utmMedium(): string | undefined {
    return this._utmMedium;
  }

  get utmCampaign(): string | undefined {
    return this._utmCampaign;
  }

  get utmTerm(): string | undefined {
    return this._utmTerm;
  }

  get utmContent(): string | undefined {
    return this._utmContent;
  }

  // Setters
  set id(value: string) {
    this._id = value;
  }

  set slug(value: string) {
    this._slug = value;
  }

  set originalUrl(value: string) {
    this._originalUrl = value;
  }

  set shortUrl(value: string) {
    this._shortUrl = value;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  set expiresAt(value: Date | undefined) {
    this._expiresAt = value;
  }

  set utmSource(value: string | undefined) {
    this._utmSource = value;
  }

  set utmMedium(value: string | undefined) {
    this._utmMedium = value;
  }

  set utmCampaign(value: string | undefined) {
    this._utmCampaign = value;
  }

  set utmTerm(value: string | undefined) {
    this._utmTerm = value;
  }

  set utmContent(value: string | undefined) {
    this._utmContent = value;
  }

  isExpired(): boolean {
    return !!this._expiresAt && new Date() > this._expiresAt;
  }

  toJSON() {
    return {
      id: this.id,
      slug: this.slug,
      originalUrl: this.originalUrl,
      shortUrl: this.shortUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      expiresAt: this.expiresAt,
      utmSource: this.utmSource,
      utmMedium: this.utmMedium,
      utmCampaign: this.utmCampaign,
      utmTerm: this.utmTerm,
      utmContent: this.utmContent,
    };
  }

  static fromJSON(data: any): Uri {
    return new Uri({
      id: data.id,
      slug: data.slug,
      originalUrl: data.originalUrl,
      shortUrl: data.shortUrl,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      utmTerm: data.utmTerm,
      utmContent: data.utmContent,
    });
  }
}
