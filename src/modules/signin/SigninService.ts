import { autoInjectable } from "tsyringe";
import SigninRepository from "./SigninRepository";

@autoInjectable()
export default class SigninService {
  private signinRepository: SigninRepository;

  constructor(signinRepository: SigninRepository) {
    this.signinRepository = signinRepository;
  }

  testService() {
    return this.signinRepository.testRepository();
  }
}
