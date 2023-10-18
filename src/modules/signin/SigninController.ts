import { Router } from "express";
import { autoInjectable } from "tsyringe";
import SigninService from "./SigninService";

@autoInjectable()
export default class SigninController {
  private signinService: SigninService;
  private router: Router;

  constructor(signinService: SigninService) {
    this.signinService = signinService;
    this.router = Router();
  }

  testRoute() {
    return this.signinService.testService();
  }

  routes() {
    this.router.get("/test", (request, response) =>
      response.send(this.testRoute()),
    );
    return this.router;
  }
}
