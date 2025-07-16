import "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface UserJwtPayload extends JwtPayload {
    userId: string;
    username: string;
    email: string;
    name: string;
  }
}

declare global {
  namespace Express {
    export interface Request {
      userInfo: UserPayload;
    }
  }
}
