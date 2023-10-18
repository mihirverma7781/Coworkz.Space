import { Router } from "express";
import { autoInjectable } from "tsyringe";
import UserService from "./UserService";

@autoInjectable()
export default class UserController {
  private userService: UserService;
  private router: Router;

  constructor(userService: UserService) {
    this.userService = userService;
    this.router = Router();
  }

  testRoute() {
    return this.userService.testService();
  }

  routes() {
    this.router.get("/test", (request, response) =>
      response.send(this.testRoute()),
    );
    return this.router;
  }
}
