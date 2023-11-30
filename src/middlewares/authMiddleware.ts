import TokenUtils from "../utils/token.utils";
import RedisClient from "../configs/redis.config";
import { APIError } from "../utils/error/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

const redis = new RedisClient();
const tokenUtils = new TokenUtils();
const userModel = new User();

export default class AuthMiddleware {
  async authenticate(request: Request, response: Response, next: NextFunction) {
    try {
      const token = request.signedCookies["access_token"];
      const userData = request.signedCookies["user_details"];

      if (!token || !Object.keys(userData)) {
        throw new APIError("Invalid Token Error!");
      } else {
        const cachedInfo = await redis.get(userData.tenetID);
        const parsedData = JSON.parse(cachedInfo || "");
        if (parsedData.token !== token) {
          throw new APIError("Invalid Token Error!");
        } else {
          const decodedToken = tokenUtils.verifyAuthToken(token);
          if (
            decodedToken.userId === parsedData.user.tenetID &&
            decodedToken.number === parsedData.user.number &&
            userData.tenetID === parsedData.user.tenetID
          ) {
            request.user = parsedData.user;
            request.token = token;
            next();
          } else {
            throw new APIError("Invalid Token Error!");
          }
        }
      }
    } catch (error: any) {
      return response.status(401).json({ message: "Unauthorized Access!!!" });
    }
  }
}
