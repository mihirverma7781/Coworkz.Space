import User from "../../models/user.model";

interface IUserExistanceInput {
  number?: string;
  email?: string;
  type: string;
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
      return error;
    }
  }
}
