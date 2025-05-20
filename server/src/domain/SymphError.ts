export type ErrorType = "User" | "Service" | "Client";

export class SymphError extends Error {
  public readonly errorCode: number;
  public readonly errorType: ErrorType;

  constructor({
    errorCode,
    errorType,
    message,
  }: {
    errorCode: number;
    errorType: ErrorType;
    message: string;
  }) {
    super(message);
    this.name = "SymphError";
    this.errorCode = errorCode;
    this.errorType = errorType;

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
