import {
  APIError,
  BadGatewayError,
  BadRequestError,
} from "@/utils/error/ErrorHandler";
import User from "../../models/user.model";

interface IUserExistanceInput {
  number?: string;
  email?: string;
  type: string;
}

interface IUserCreate {
  number: string;
  isNumberVerified: boolean;
}

export default class AuthRepository {
  private userModel;
  constructor() {
    this.userModel = User;
  }
  testRepository() {
    return { message: "test successfull" };
  }

  async checkUserExistance(data: IUserExistanceInput) {
    try {
      let user;
      if (data.type === "number") {
        user = await this.userModel.findOne({
          number: data.number,
        });
      } else if (data.type === "email") {
        user = await this.userModel.findOne({
          number: data.email,
        });
      }
      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  async getUserByTenetId(tenetID: string) {
    try {
      let user = await this.userModel.findOne({
        tenetID: tenetID,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async createNewUser(data: IUserCreate) {
    try {
      const newUser = await this.userModel.create(data);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(hash: string, tenetID: string) {
    try {
      const updateUser = await this.userModel.findOneAndUpdate(
        {
          tenetID: tenetID,
        },
        {
          password: hash,
          isPasswordUpdated: true,
        },
        {
          new: true,
        },
      );
      return updateUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserDataWithNumberEmail(data: IUserExistanceInput) {
    try {
      let user;
      if (data.type === "number") {
        user = await this.userModel.findOne({
          number: data.number,
        });
      } else if (data.type === "email") {
        user = await this.userModel.findOne({
          number: data.email,
        });
      }
      if (user) {
        return {
          userExist: true,
          userData: user,
        };
      } else {
        return {
          userExist: false,
          userData: null,
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
