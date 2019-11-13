import * as jwt from 'jsonwebtoken';
import { UserService } from './UserService';
import AuthCallback from '../models/classes/auth_callback';
import { Auth_model } from '../models/interfaces/auth_model';
import bcrypt from 'bcrypt';
import { Auth_user_callback_model } from '../models/interfaces/auth_user_callback_model';
import { Tokendata } from '../models/interfaces/tokendata';
import { Utils } from './Utils';

export class AuthServiceClass {
  constructor(readonly jwt: any, readonly UserService: any, readonly bcrypt: any) {}
  userAuth = async (payload: Auth_model): Promise<Auth_user_callback_model> => {
    const { login, password } = payload;

    const user = await this.UserService.getUserByLogin(login);
    if (user) {
      const checkPassword = await Utils.compareHash(password, user.passwordHash);
      console.log('checkPassword:');
      console.log(checkPassword);
      //TODO {check this} !== with checkPassword = false, enter in if!!!! and i have TypeError exception in token field!!!
      if (checkPassword != false) {
        const generatedToken = await Utils.createToken(user.id, user.login, user.email);
        const callback = new AuthCallback(user.login, user.email, generatedToken);
        return callback;
      }
    } else {
      return null;
    }
  };

  authorizationMiddleware = async (ctx: any, next: any) => {
    const publicURLs = [
      '/user/login',
      '/user/registration',
      '/user/forgot-password',
      '/user/refreshAuthData',
    ];
    console.clear();
    console.log('--Magic Auth Middleware--'.repeat(2));
    console.log(ctx.request.header.token);
    console.log(publicURLs.includes(ctx.request.url));
    console.log(ctx.request.url.indexOf('/user/reset-password/') === 0);
    console.log('--Magic Auth Middleware--'.repeat(2));
    // TODO: rewrite using regex to avoid '/user/reset-password/{key}/a/b/c/...' cases
    if (
      ctx.request.url.indexOf('/user/reset-password/') === 0
      // || publicURLs.includes(ctx.request.url)
      // || await auth.checkAuth(ctx.request.header.token)
    ) {
      return next();
    }

    if (publicURLs.includes(ctx.request.url)) {
      return next();
    }

    // check token
    if (await this.checkAuth(ctx.request.header.token)) {
      return next();
    }

    return (ctx.status = 401);
    // return 401
  };

  getCurrentTimestamp = () => Math.round(new Date().getTime() / 1000);

  decodeToken = (token: string) => {
    return this.jwt.decode(token) as Tokendata;
  };

  checkAuth = async (token: string): Promise<boolean> => {
    try {
      const decodedToken = this.decodeToken(token);
      //TODO: {move "if" condition into separate function}
      if (decodedToken.exp > this.getCurrentTimestamp()) {
        const currentUser = await this.UserService.getUserByLogin(decodedToken.username);
        return !!currentUser;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
}
export const AuthService = new AuthServiceClass(jwt, UserService, bcrypt);
