export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}
