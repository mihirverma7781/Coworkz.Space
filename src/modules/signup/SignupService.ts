/* eslint-disable @typescript-eslint/no-unused-vars */
import { autoInjectable } from "tsyringe";
import SignupRepository from "./SignupRepository";
import NSignup from "./typings";
import RedisClient from "../../configs/redis.config";
import { APIError } from "../../utils/error/ErrorHandler";
import { randomUUID } from "crypto";

@autoInjectable()
export default class SignupService {
  private signupRepository: SignupRepository;
  private redis: RedisClient;

  constructor(signupRepository: SignupRepository, redis: RedisClient) {
    this.signupRepository = signupRepository;
    this.redis = redis;
  }

  async testService() {
    return this.signupRepository.testRepository();
  }

  async sendOTP(body: NSignup.Body.IOtpSignupBody) {
    try {
      // check user existence
      const input = { ...body, type: "number" };
      const userExist = await this.signupRepository.checkUserExistance(input);
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
      const userExist = await this.signupRepository.checkUserExistance({
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
