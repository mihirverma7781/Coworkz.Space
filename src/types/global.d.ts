import NModel from "../models/typings";

declare module "express" {
  interface Request {
    user?: NModel.IUserModel;
    token?: string;
  }
}

declare module "express-serve-static-core" {
  export interface Request {
    user?: NModel.IUserModel;
    token?: string;
  }
}
