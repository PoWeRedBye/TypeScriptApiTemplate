import KoaRouter from 'koa-router';
import { UserApi } from '../api/UserApi';
import { AuthService} from '../services/AuthService';

const router = new KoaRouter();

// TODO: test get method
router.get('/', async ctx => {
  ctx.body = 'its works!';
});

router.post('/user/create', async ctx => {
  try {
    const result = await UserApi.addNewUser({
      login: ctx.request.body.displayName || ctx.request.body.login,
      email: ctx.request.body.email,
      password: ctx.request.body.password,
    });
    ctx.body = result;
  } catch (error) {
    console.error('error', error);
    ctx.status = error.code;
    ctx.body = error;
  }
});

router.post('/user/login', AuthService.authorizationMiddleware, async ctx => {
  try {
    const result = await UserApi.authtenticate({
      login: ctx.request.body.login,
      password: ctx.request.body.password,
    });
    ctx.body = result;
  } catch (error) {
    console.error('error', error);
    ctx.status = error.code;
    ctx.body = error;
  }
});

router.post('/user/change-password', AuthService.authorizationMiddleware, async ctx => {
  try {
    const result = await UserApi.changePassword({
      login: ctx.request.body.login,
      password: ctx.request.body.password,
      newpassword: ctx.request.body.newpassword,
    });
    ctx.body = result;
  } catch (error) {
    console.error('error', error);
    ctx.status = error.code;
    ctx.body = error;
  }
});

export const Router = router;
