/* eslint-disable @typescript-eslint/no-namespace */
declare namespace NSignup {
  namespace Body {
    interface IOtpSignupBody {
      number: string;
    }

    interface IVerifyOTP {
      number: string;
      otp: string;
      activationID: string;
    }
  }
}

export default NSignup;
