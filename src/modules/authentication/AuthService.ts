/* eslint-disable @typescript-eslint/no-unused-vars */
import { autoInjectable } from "tsyringe";
import AuthRepository from "./AuthRepository";
import NSignup from "./typings";
import RedisClient from "../../configs/redis.config";
import {
  APIError,
  BadRequestError,
  BaseError,
} from "../../utils/error/ErrorHandler";
import { randomUUID } from "crypto";
import TokenUtils from "../../utils/token.utils";
import CryptoUtils from "../../utils/crypto.utils";

@autoInjectable()
export default class AuthService {
  private authRepository: AuthRepository;
  private tokenUtils: TokenUtils;
  private cryptoUtils: CryptoUtils;
  private redis: RedisClient;

  constructor(
    authRepository: AuthRepository,
    redis: RedisClient,
    tokenUtils: TokenUtils,
    cryptoUtils: CryptoUtils,
  ) {
    this.authRepository = authRepository;
    this.tokenUtils = tokenUtils;
    this.cryptoUtils = cryptoUtils;
    this.redis = redis;
  }

  async testService() {
    return this.authRepository.testRepository();
  }

  async sendOTP(body: NSignup.Body.IOtpSignupBody) {
    try {
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
    } catch (error:any) {
      throw new APIError(error.message);
    }
  }

  async verifyOTP(body: NSignup.Body.IVerifyOTP) {
    try {
      const userExist = await this.authRepository.getUserDataWithNumberEmail({
        number: body.number,
        type: "number",
      });
      const activationDetails: any = await this.redis.get(body.number);
      const parsedDetails: any = JSON.parse(activationDetails);
      if (userExist.userExist && userExist.userData) {
        if (
          parsedDetails.otp === Number(body.otp) &&
          parsedDetails.activationID === body.activationID
        ) {
          const token = this.tokenUtils.generateAuthToken(
            userExist.userData.number,
            userExist.userData.tenetID,
          );
          if (!token) {
            throw new APIError();
          } else {
            const userData = userExist.userData;
            await this.redis.set(
              userData.tenetID,
              JSON.stringify({ token, userData }),
            );
            return {
              message: "OTP verified Successfully",
              status: 201,
              success: true,
              token,
              data: {
                userData,
              },
            };
          }
        } else {
          throw new BadRequestError("Invalid Verification Details");
        }
      } else {
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
            if (!token) {
              throw new APIError();
            } else {
              await this.redis.set(
                user.tenetID,
                JSON.stringify({ token, user }),
              );
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
    } catch (error:any) {
      throw new APIError(error.message);
    }
  }

  async updatePassword(body: any, tenetID: any) {
    try {
      const plainPassword: string = body.password;
      const fetchedUser: any =
        await this.authRepository.getUserByTenetId(tenetID);

      if (
        plainPassword.length >= 8 &&
        fetchedUser?.isPasswordUpdated === false &&
        !fetchedUser?.isOnboarded &&
        fetchedUser?.isNumberVerified
      ) {
        const hashedPassword: string =
          this.cryptoUtils.hashPlainText(plainPassword);
        const update = await this.authRepository.updatePassword(
          hashedPassword,
          tenetID,
        );
        if (update) {
          update.password = "";
          return {
            message: "Password Updated Successfully!",
            status: 200,
            success: true,
            data: update,
          };
        } else {
          throw new BadRequestError("Password Not Updated");
        }
      } else {
        throw new BadRequestError("Invalid Password Update Request");
      }
    } catch (error:any) {
      throw new APIError(error.message);
    }
  }

  // async loginWithPassword(body: any) {
  //   const { number, password } = body;
  //   const userExist = await this.authRepository.getUserDataWithNumberEmail({
  //     number: number,
  //     type: "number",
  //   });
  //   if (!userExist.userExist && !userExist.userData) {
  //     return new BadRequestError("User does not exist!");
  //   } else {
  //     const comparePasswords = await this.cryptoUtils.comparePlainText(
  //       password,
  //       userExist?.userData?.password || "",
  //     );
  //   }
  // }
}
