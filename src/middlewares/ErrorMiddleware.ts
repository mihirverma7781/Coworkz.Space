import { BaseError } from "@/utils/error/ErrorHandler";
import { NextFunction, Request, Response } from "express"; // Import the Request type

export default class ErrorHandler {
  private error: BaseError;
  private response: Response;
  private request: Request;
  private next: NextFunction;

  constructor(
    error: BaseError,
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    this.error = error;
    this.response = response;
    this.request = request;
    this.next = next;
  }

  public handleError() {
    // Log the error for debugging purposes

    // Send a JSON response with the error message and status code
    this.response.status(this.error.statusCode).json({
      error: this.error,
    });
  }
}
