export class OwlynError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "OwlynError";
  }
}

export function toClientError(error: unknown): Error {
  if (error instanceof OwlynError) {
    return new Error(error.message);
  }

  if (error instanceof Error) {
    return new Error(error.message);
  }

  return new Error("Unknown Owlyn error.");
}
