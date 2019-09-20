import * as jwt from 'jsonwebtoken';
import { UserModel } from '../models/interfaces/user_model';
import { UserValidations } from '../validations/user_validations';
import { UserService } from '../services/UserService';
import { Auth_model } from '../models/interfaces/auth_model';
import { AuthService } from '../services/AuthService';
import { update_pass_model } from '../models/interfaces/update_pass_model';

// can be used once createConnection is called and is resolved

class UserApiClass {
  addNewUser = (payload: UserModel) =>
    new Promise(async (resolve, reject) => {
      try {
        const valid = await UserValidations.UserModel(payload);
        if (valid == false) {
          reject({
            result: true,
            code: 400, //TODO: {status code review!!!}maybe code is 422!!!
            message: 'wrong request data',
          });
        }
        const result = await UserService.registerNewUser(payload);
        resolve({
          result: true,
          payload: result,
          code: 200,
          message: 'this user have only a watch permissions!!!',
        });
      } catch (error) {
        console.log(error);
      }
    });
  authtenticate = (payload: Auth_model) =>
    new Promise(async (resolve, reject) => {
      try {
        const result = await AuthService.userAuth(payload);
        //TODO {check this} !== with checkPassword = false, enter in if!!!! and i have TypeError exception in token field!!!
        if (result != null) {
          const decoded = jwt.decode(result.token);
          resolve({
            result: true,
            payload: result,
            code: 200,
            tokendata: decoded,
            message: 'successful',
          });
        } else {
          reject({
            result: false,
            code: 401,
            message: 'wrong login or password',
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  changePassword = (payload: update_pass_model) =>
    new Promise(async (resolve, reject) => {
      try {
        const result = await UserService.changePassword(payload);
        if (result != null) {
          resolve({
            result: true,
            code: 200,
            payload: result,
            message: 'you change your password',
          });
        } else {
          reject({
            result: false,
            code: 400, //TODO: {status code review!!!}maybe code is 422!!!
            message: 'something wrong happened =)',
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
}

export const UserApi = new UserApiClass();
