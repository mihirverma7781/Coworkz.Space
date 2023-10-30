import { autoInjectable } from "tsyringe";
import SignupRepository from "./SignupRepository";
import NSignup from "./typings";

@autoInjectable()
export default class SignupService {
  private signupRepository: SignupRepository;

  constructor(signupRepository: SignupRepository) {
    this.signupRepository = signupRepository;
  }

  async testService() {
    return this.signupRepository.testRepository();
  }

  async signup(body: NSignup.Body.IOtpSignupBody) {
    return body;
  }
}
