import { User } from '../db/entities/user';
import { UserModel } from '../models/interfaces/user_model';
import { getConnection } from 'typeorm';
import bcrypt from 'bcrypt';
import auth_callback from '../models/classes/auth_callback';
import AuthCallback from '../models/classes/auth_callback';
import { AuthService } from './AuthService';
import { update_pass_model } from '../models/interfaces/update_pass_model';

//TODO: fix memory spaces in this code=)

export class UserServiceClass {
  getHash = async (password: string | undefined): Promise<string> => {
    return bcrypt.hash(password, 10);
  };

  getUserByLogin = async (login: string): Promise<User> => {
    const connection = getConnection();
    const userRepository = connection.getRepository(User);
    const check = await userRepository.findOne({ login });
    if (check !== null || undefined) {
      return check;
    } else {
      return null;
    }
  };

  checkUser = async (login: string): Promise<boolean> => {
    const connection = getConnection();
    const userRepository = connection.getRepository(User);
    const check = await userRepository.findOne({ login });
    console.log('user check');
    console.log(check);
    if (check == null || undefined) {
      return true;
    } else {
      return false;
    }
  };

  registerNewUser = async (payload: UserModel) => {
    const { login, email, password } = payload;
    const connection = getConnection();
    const userRepository = connection.getRepository(User);
    const userCheck = await this.checkUser(login);
    console.log('userCheck => ' + userCheck);
    if (userCheck) {
      const passwordHash = await this.getHash(password);
      console.log('passwordHash = ' + passwordHash);
      const user = new User();
      user.login = login;
      user.email = email;
      user.passwordHash = passwordHash;
      const newUser = await userRepository.create(user);
      const result = await userRepository.save(newUser);
      return result;
    } else {
      return null;
    }
  };

  updateUser = async (payload: User) => {
    if (payload) {
      const { id, login, email, password } = payload;
      const connection = getConnection();
      const userRepository = connection.getRepository(User);
      const passHash = await this.getHash(password);
      const user = new User();
      user.login = login;
      user.password = '';
      user.passwordHash = passHash;
      user.email = email;
      //TODO: {check what is better}
      //TODO: work =>
      const newUser = await userRepository.update({ id: 4 }, user);
      console.log('newUser:  ->');
      console.log(newUser);
      //TODO: work =>
      /*const newUser = connection
        .createQueryBuilder()
        .update(User)
        .set({
          login: login,
          password: "",
          passwordHash: passHash,
          email: email,
        })
        .where('id = :id', { id: id })
        .execute();*/

      return newUser;
    } else {
      return false;
    }
  };

  changePassword = async (payload: update_pass_model): Promise<auth_callback> => {
    const { login, password, newpassword } = payload;
    const user = await this.getUserByLogin(login);
    console.log();
    const checkPass = AuthService.compareHash(password, user.passwordHash);
    if (checkPass) {
      const newUser = new User();
      newUser.id = user.id;
      newUser.login = user.login;
      newUser.email = user.email;
      newUser.password = newpassword;
      const updated = await this.updateUser(newUser);
      if (updated != null || false) {
        const generatedToken = await AuthService.createToken(
          newUser.id,
          newUser.login,
          newUser.email,
        );
        const callback = new AuthCallback();
        callback.username = user.login;
        callback.email = user.email;
        callback.token = generatedToken;
        return callback;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
}

export const UserService = new UserServiceClass();
