/* eslint-disable @typescript-eslint/no-namespace */
declare namespace NModel {
  interface IUserModel {
    tenetID: string;
    email: string;
    isEmailVerified: boolean;
    isPasswordUpdated: boolean;
    isOnboarded: boolean;
    number: string;
    isNumberVerified: boolean;
    password: string;
  }
}

export default NModel;
