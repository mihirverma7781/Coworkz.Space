import "reflect-metadata";
import express, { Express } from "express";
import { container } from "tsyringe";
import cookieParser from "cookie-parser";
import cors from "cors";
import SigninController from "./signin/SigninController";

// initialize app
const app: Express = express();

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors
app.use(cors());

// const signinRepository = new SigninRepository();
// const signinService = new SigninService(signinRepository);
// const signinController = new SigninController(signinService);

const signinController = container.resolve(SigninController);

// route handling
app.use("/api/users", signinController.routes());

export default app;
