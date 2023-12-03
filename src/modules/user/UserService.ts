import { autoInjectable } from "tsyringe";
import UserRepository from "./UserRepository";
import NUser from "./typings";
import { request } from "express";
import { APIError, BadRequestError } from "../../utils/error/ErrorHandler";

@autoInjectable()
export default class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  testService() {
    return this.userRepository.testRepository();
  }

  async updateBasic(body: NUser.Body.IBasicDetails, user: any) {
    try {
      const {
        firstName,
        lastName,
        location,
        profileUrl,
        workAuthorization,
        profileHeadline,
        profileDescription,
        mobileVisible,
        whatsappUpdates,
      } = body;
      const updatedUser: any = await this.userRepository.updateBasicDetails(
        {
          firstName,
          lastName,
          location,
          profileUrl,
          workAuthorization,
          profileHeadline,
          profileDescription,
          mobileVisible,
          whatsappUpdates,
        },
        user?.tenetID,
      );
      if (!updatedUser) {
        throw new BadRequestError("user Not Updated!");
      } else {
        return {
          message: "User Updated Successfully",
          status: 200,
          success: true,
          data: updatedUser,
        };
      }
    } catch (error: any) {
      throw new APIError(error.message);
    }
  }

  async userOnboarded(user: any) {
    try {
      const updatedUser: any = await this.userRepository.updateOnboarded(
        user?.tenetID,
      );
      if (!updatedUser) {
        throw new BadRequestError("user Not Updated!");
      } else {
        return {
          message: "Updated Onboarded Successfully",
          status: 200,
          success: true,
          data: updatedUser,
        };
      }
    } catch (error: any) {
      throw new APIError(error.message);
    }
  }
}
