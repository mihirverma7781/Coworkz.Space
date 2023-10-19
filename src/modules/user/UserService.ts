import { autoInjectable } from "tsyringe";
import UserRepository from "./UserRepository";

@autoInjectable()
export default class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  testService() {
    return this.userRepository.testRepository();
  }
}
