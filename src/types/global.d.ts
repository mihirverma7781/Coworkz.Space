import NModel from "../models/typings";

declare module "express" {
  interface Request {
    user?: NModel.IUserModel;
  }
}

declare module 'express-serve-static-core' {
  export interface Request {
    user?: NModel.IUserModel;
  }
}