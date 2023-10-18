import "reflect-metadata";
import express, { Express, NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import cookieParser from "cookie-parser";
import cors from "cors";
import SigninController from "./modules/signin/SigninController";
import SignupController from "./modules/signup/SignupController";
import SignoutController from "./modules/signout/SignoutController";
import UserController from "./user/UserController";
import ErrorHandler from "./middlewares/ErrorMiddleware";

// initialize app
const app: Express = express();

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors
app.use(cors());

// dependancy injection
const signinController = container.resolve(SigninController);
const signupController = container.resolve(SignupController);
const signoutController = container.resolve(SignoutController);
const currentUserController = container.resolve(UserController);

// route handling
app.use("/api/users", signinController.routes());
app.use("/api/users", signupController.routes());
app.use("/api/users", signoutController.routes());
app.use("/api/users", currentUserController.routes());

// error handler middleware

app.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (err: any, request: Request, response: Response, next: NextFunction) => {
    const errorHandler = new ErrorHandler(err, request, response, next);
    errorHandler.handleError();
  },
);

export default app;
