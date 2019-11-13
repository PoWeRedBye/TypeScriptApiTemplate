import { timestamp } from '../setupTests';
import { AuthService, AuthServiceClass } from './AuthService';
import bcrypt from 'bcrypt';

/*//README: {mock po hyevomy}
jest.mock('jsonwebtoken', ()=> ({
  decode: jest.fn().mockReturnValue('jwt.decode'),
}));*/

describe('AuthService', () => {
  let jwt: any;
  let UserService: any;
  const mockAuthService = () => new AuthServiceClass(jwt, UserService, bcrypt);

  beforeEach(() => {
    jwt = {
      decode: jest.fn(),
    };
    UserService = {
      getUserByLogin: jest.fn(),
    };
  });

  describe('"getCurrentTimestamp" method', () => {
    test('should return correct current timestamp', () => {
      const AuthService = mockAuthService();

      expect(AuthService.getCurrentTimestamp()).toBe(timestamp);
    });
  });

  describe('"decodeToken" method', () => {
    test('should correctly decode jwt token', () => {
      jwt.decode.mockReturnValueOnce('jwt.decode');
      const AuthService = mockAuthService();

      expect(AuthService.decodeToken('jwt token')).toEqual('jwt.decode');
    });
  });

  describe('checkAuth', () => {
    test('should correct check auth', () => {
      jwt.decode.mockReturnValueOnce({ exp: timestamp + 5, username: 'test User Name' });
      UserService.getUserByLogin.mockResolvedValueOnce('user');
    });

    test('should return false if token is expired', async () => {
      jwt.decode.mockReturnValueOnce({ exp: timestamp - 25 });

      expect(await mockAuthService().checkAuth('token')).toBe(false);
    });

    test('should return false if UserService rejected with any error', async () => {
      jwt.decode.mockReturnValueOnce({ exp: timestamp + 5, username: 'test User Name' });
      UserService.getUserByLogin.mockRejectedValueOnce('user');

      expect(await mockAuthService().checkAuth('token')).toBe(false);
    });

    test('should return false if no user was retrieved from the UserService', async () => {
      jwt.decode.mockReturnValueOnce({ exp: timestamp + 5, username: 'test User Name' });
      UserService.getUserByLogin.mockResolvedValueOnce(null);
      expect(await mockAuthService().checkAuth('token')).toBe(false);
    });

    test('should return true if token is not expired and user was found', async () => {
      jwt.decode.mockReturnValueOnce({ exp: timestamp + 5, username: 'test User Name' });
      UserService.getUserByLogin.mockResolvedValueOnce('test User Name');
      expect(await mockAuthService().checkAuth('token')).toBe(true);
    });
  });
});
