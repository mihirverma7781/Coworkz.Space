import { autoInjectable } from "tsyringe";
import SignupRepository from "./SignupRepository";
import NSignup from "./typings";
import RedisClient from "../../configs/redis.config";

@autoInjectable()
export default class SignupService {
  private signupRepository: SignupRepository;
  private redis: RedisClient;

  constructor(signupRepository: SignupRepository, redis: RedisClient) {
    this.signupRepository = signupRepository;
    this.redis = redis;
  }

  async testService() {
    return this.signupRepository.testRepository();
  }

  async signup(body: NSignup.Body.IOtpSignupBody) {
    await this.redis.set("test", "test");
    return body;
  }
}
