import { UserModel } from '../models/interfaces/user_model';

export class UserValidationsClass {
  UserModel = async (payload: UserModel) => {
    const { login, email, password } = payload;
    return !(!login || !password || !email);
  };
}

export const UserValidations = new UserValidationsClass();
