import { autoInjectable } from "tsyringe";
import SignupRepository from "./SignupRepository";

@autoInjectable()
export default class SignupService {
  private signupRepository: SignupRepository;

  constructor(signupRepository: SignupRepository) {
    this.signupRepository = signupRepository;
  }

  async testService() {
    return this.signupRepository.testRepository();
  }

  async signup() {
    return "Hello";
  }
}
