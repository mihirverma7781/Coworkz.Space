// ERROR CODES
export enum ErrorCodes {
  OK = 200,
  BAD_REQUEST = 400,
  UN_AUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
  BAD_GATEWAY = 502,
}

// BASE ERROR CLASS
export class BaseError extends Error {
  public readonly name: string;
  public readonly statusCode: number;
  public readonly description: string;
  public readonly isOperational: boolean;

  constructor(name: string, statusCode: number, description: string) {
    super(description);
    this.statusCode = statusCode;
    this.description = description;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 500 INTERNAL SERVER ERROR
export class APIError extends BaseError {
  constructor(description = "Internal Server") {
    super("INTERNAL SERVER ERROR", ErrorCodes.INTERNAL_SERVER, description);
  }
}

// 400 BAD REQUEST ERROR
export class BadRequestError extends BaseError {
  constructor(description = "Bad Request") {
    super("BAD REQUEST ERROR", ErrorCodes.BAD_REQUEST, description);
  }
}

// 403 UN_AUTHORIZED ERROR
export class UnAuthorizError extends BaseError {
  constructor(description = "Un Authorized") {
    super("UNAUTHORIZED ERROR", ErrorCodes.UN_AUTHORIZED, description);
  }
}

// 404 NOT FOUND ERROR
export class NotFoundError extends BaseError {
  constructor(description = "Not Found") {
    super("NOT FOUND ERROR", ErrorCodes.NOT_FOUND, description);
  }
}

// 502 NOT FOUND ERROR
export class BadGatewayError extends BaseError {
  constructor(description = "Bad Gateway") {
    super("BAD GATEWAY ERROR", ErrorCodes.BAD_GATEWAY, description);
  }
}
