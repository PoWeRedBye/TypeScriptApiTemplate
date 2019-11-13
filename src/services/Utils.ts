import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class UtilsClass {
  compareHash = async (
    password: string | undefined,
    hash: string | undefined,
  ): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  };
  createToken = (id: number, username: string, email: string) => {
    const expiresIn = 868686;
    const secretOrKey = 'my_auth_react-api-jwt-secret';
    const user = { id, username, email };
    const token = jwt.sign(user, secretOrKey, { expiresIn });

    return token;
  };
}

export const Utils = new UtilsClass();