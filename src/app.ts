import "reflect-metadata";
import express, { Express } from "express";
import { container } from "tsyringe";
import cookieParser from "cookie-parser";
import cors from "cors";
import SigninController from "./modules/signin/SigninController";
import SignupController from "./modules/signup/SignupController";
import SignoutController from "./modules/signout/SignoutController";
import UserController from "./user/UserController";

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

export default app;
