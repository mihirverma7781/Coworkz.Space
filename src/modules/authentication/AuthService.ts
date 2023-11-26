/* eslint-disable @typescript-eslint/no-unused-vars */
import { autoInjectable } from "tsyringe";
import AuthRepository from "./AuthRepository";
import NSignup from "./typings";
import RedisClient from "../../configs/redis.config";
import { APIError, BadRequestError } from "../../utils/error/ErrorHandler";
import { randomUUID } from "crypto";
import TokenUtils from "../../utils/token.utils";

@autoInjectable()
export default class AuthService {
  private authRepository: AuthRepository;
  private tokenUtils: TokenUtils;
  private redis: RedisClient;

  constructor(
    authRepository: AuthRepository,
    redis: RedisClient,
    tokenUtils: TokenUtils,
  ) {
    this.authRepository = authRepository;
    this.tokenUtils = tokenUtils;
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
        throw new BadRequestError("Mobile number already registered");
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
      throw error;
    }
  }

  async verifyOTP(body: NSignup.Body.IVerifyOTP) {
    try {
      const userExist = await this.authRepository.checkUserExistance({
        number: body.number,
        type: "number",
      });
      if (userExist) {
        throw new BadRequestError("Mobile number already registered");
      } else {
        const activationDetails: any = await this.redis.get(body.number);
        const parsedDetails: any = JSON.parse(activationDetails);
        if (
          parsedDetails.otp === Number(body.otp) &&
          parsedDetails.activationID === body.activationID
        ) {
          const payload = {
            number: body.number,
            isNumberVerified: true,
          };
          const user = await this.authRepository.createNewUser(payload);
          if (!user) {
            throw new BadRequestError("Error Creating User");
          } else {
            const token = this.tokenUtils.generateAuthToken(
              user.number,
              user.tenetID,
            );
            console.log("🚀 ~ file: AuthService.ts:95 ~ AuthService ~ verifyOTP ~ token:", token)
            if (!token) {
              console.log("inside token")
              throw new APIError();
            } else {
              await this.redis.set(user.tenetID, JSON.stringify(token));
              return {
                message: "OTP verified Successfully",
                status: 201,
                success: true,
                token,
                data: {
                  user,
                },
              };
            }
          }
        } else {
          throw new BadRequestError("Invalid Verification Details");
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
