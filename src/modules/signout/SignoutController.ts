import { Router } from "express";
import { autoInjectable } from "tsyringe";
import SignoutService from "./SignoutService";

@autoInjectable()
export default class SignoutController {
  private signoutService: SignoutService;
  private router: Router;

  constructor(signoutService: SignoutService) {
    this.signoutService = signoutService;
    this.router = Router();
  }

  testRoute() {
    return this.signoutService.testService();
  }

  routes() {
    this.router.get("/test", (req, res) => res.send(this.testRoute()));
    return this.router;
  }
}
