import { autoInjectable } from "tsyringe";
import SignoutRepository from "./SignoutRepository";

@autoInjectable()
export default class SignoutService {
  private signoutRepository: SignoutRepository;

  constructor(signoutRepository: SignoutRepository) {
    this.signoutRepository = signoutRepository;
  }

  testService() {
    return this.signoutRepository.testRepository();
  }
}
