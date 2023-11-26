/* eslint-disable @typescript-eslint/no-unused-vars */
import { autoInjectable } from "tsyringe";
import AuthRepository from "./AuthRepository";
import NSignup from "./typings";
import RedisClient from "../../configs/redis.config";
import { APIError } from "../../utils/error/ErrorHandler";
import { randomUUID } from "crypto";

@autoInjectable()
export default class AuthService {
  private authRepository: AuthRepository;
  private redis: RedisClient;

  constructor(authRepository: AuthRepository, redis: RedisClient) {
    this.authRepository = authRepository;
    this.redis = redis;
  }

  async testService() {
    return this.authRepository.testRepository();
  }

  async sendOTP(body: NSignup.Body.IOtpSignupBody) {
    try {
      // check user existence
      const input = { ...body, type: "number" };
      const userExist = await this.authRepository.checkUserExistance(input);
      if (userExist) {
        throw new APIError("Mobile number already registered");
      } else {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        console.log("OTP: ", OTP);
        const activationID = randomUUID();
        // TODO: ASSUMING WE HAVE SENT THE OTP TO USER get and remove it first

        await this.redis.set(
          body.number,
          JSON.stringify({
            otp: OTP,
            activationID: activationID,
          }),
        );
        return {
          message: "OTP sent successfully",
          status: 200,
          success: true,
          data: {
            activationID,
          },
        };
      }
    } catch (error) {
      return error;
    }
  }

  async verifyOTP(body: NSignup.Body.IVerifyOTP) {
    try {
      const userExist = await this.authRepository.checkUserExistance({
        number: body.number,
        type: "number",
      });
      if (userExist) {
        throw new APIError("Mobile number already registered");
      } else {
        const activationDetails: any = await this.redis.get(body.number);
        if (
          activationDetails.otp === body.otp &&
          activationDetails.activationID === body.activationID
        ) {
          // create a user
        }
      }
    } catch (error) {
      return error;
    }
  }
}
