import jwt from "jsonwebtoken";

export default class TokenUtils {
  generateAuthToken(number: string, tenetID: string) {
    const authToken = jwt.sign(
      {
        userId: tenetID,
        number: number,
      },
      process.env.APP_AUTH_SECRET_KEY || "",
      {
        expiresIn: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      },
    );
    return authToken;
  }

  verifyAuthToken(token: any) {
    try {
      const decodedPayload = jwt.verify(
        token,
        process.env.APP_AUTH_SECRET_KEY || "",
      );
      return decodedPayload;
    } catch (error: any) {
      return error;
    }
  }
}
