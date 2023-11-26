import "reflect-metadata";
import express, { Express, NextFunction, Request, Response } from "express";
import "express-async-errors";
import { container } from "tsyringe";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthController from "./modules/authentication/AuthController";
import UserController from "./modules/user/UserController";
import ErrorHandler from "./middlewares/ErrorMiddleware";
import { NotFoundError } from "./utils/error/ErrorHandler";
import Database from "./configs/db.config";

// initialize app
const app: Express = express();

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors
app.use(cors());

// db connection
const db = new Database();
db.connectDB();

// dependency injection
const authController = container.resolve(AuthController);
const currentUserController = container.resolve(UserController);

// route handling
app.use("/api/auth", authController.routes());
app.use("/api/auth", currentUserController.routes());

app.all("*", async () => {
  throw new NotFoundError();
});

// error handler middleware
app.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (err: any, request: Request, response: Response, next: NextFunction) => {
    const errorHandler = new ErrorHandler(err, request, response, next);
    errorHandler.handleError();
  },
);

export default app;
