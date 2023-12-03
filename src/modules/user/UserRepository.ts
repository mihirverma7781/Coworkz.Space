import { APIError } from "../../utils/error/ErrorHandler";
import User from "../../models/user.model";
import NUser from "./typings";

export default class UserRepository {
  private userModel;
  constructor() {
    this.userModel = User;
  }
  testRepository() {
    return { message: "test successfull" };
  }

  async updateBasicDetails(userData: NUser.Body.IBasicDetails, tenetID: any) {
    try {
      if (!userData) {
        throw new APIError("Invalid Input Data");
      } else {
        const udpatedData: any = await this.userModel.findOneAndUpdate(
          {
            tenetID: tenetID,
          },
          { basicDetails: userData },
          {
            new: true,
          },
        );
        return udpatedData;
      }
    } catch (error: any) {
      throw new APIError(error.message);
    }
  }

  async updateOnboarded(tenetID: any) {
    try {
      const udpatedData: any = await this.userModel.findByIdAndUpdate(
        {
          tenetID: tenetID,
        },
        { isOnboarded: true },
        {
          new: true,
        },
      );
      return udpatedData;
    } catch (error: any) {
      throw new APIError(error.message);
    }
  }
}
