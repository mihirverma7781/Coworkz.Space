import { Router, Request, Response, NextFunction } from "express";
import { autoInjectable } from "tsyringe";
import { validationResult } from "express-validator";
import UserService from "./UserService";
import AuthMiddleware from "../../middlewares/authMiddleware";
import UserValidator from "./validations/UserValidator";
import { APIError, BadRequestError } from "../../utils/error/ErrorHandler";

@autoInjectable()
export default class UserController {
  private authMiddleware: AuthMiddleware;
  private userService: UserService;
  private userValidator: UserValidator;
  private router: Router;

  constructor(
    userService: UserService,
    authMiddleware: AuthMiddleware,
    userValidator: UserValidator,
  ) {
    this.userService = userService;
    this.userValidator = userValidator;
    this.authMiddleware = authMiddleware;
    this.router = Router();
  }

  public testRoute() {
    return this.userService.testService();
  }

  public updateBasicDetails = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        const errorMessages = errors
          .array()
          .map((error) => error.msg)
          .join(", ");
        throw new BadRequestError(errorMessages);
      }
      const input = request.body;
      const user = request.user;
      const result: any = await this.userService.updateBasic(input, user);
      if (Object.keys(result) && result.status === 200) {
        const cookieOptions = {
          httpOnly: true,
          signed: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        };
        response.cookie("user_details", result.data, cookieOptions);
        return response.status(result.status).json(result);
      } else {
        throw new APIError();
      }
    } catch (error: any) {
      console.error("Error in update basic details:", error.message);
      next(error);
    }
  };

  public async onboardUser(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const input = request.user;
      const result: any = await this.userService.userOnboarded(input);
      if (Object.keys(result) && result.status === 200) {
        const cookieOptions = {
          httpOnly: true,
          signed: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        };
        response.cookie("user_details", result.data, cookieOptions);
        return response.status(result.status).json(result);
      } else {
        throw new APIError();
      }
    } catch (error: any) {
      console.error("Error in user onboarding:", error.message);
      next(error);
    }
  }

  routes() {
    this.router.get("/test", (request, response) =>
      response.send(this.testRoute()),
    );
    this.router.patch(
      "/update-basic-details",
      this.authMiddleware.authenticate,
      this.userValidator.basicDetailsValidator(),
      this.updateBasicDetails,
    );
    this.router.patch(
      "/onboardUser",
      this.authMiddleware.authenticate,
      this.onboardUser,
    );
    return this.router;
  }
}
