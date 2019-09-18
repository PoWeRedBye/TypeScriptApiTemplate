import Koa from 'koa';
import KoaBody from 'koa-body';
import { ConnectionOptions, createConnection } from 'typeorm';
import { Router } from './router';
import { User } from './db/entities/user';
import { AuthService } from './services/AuthService';

const app = new Koa();

const options: ConnectionOptions = {
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "react_api",
  "entities": ["dist/db/entities/*.js"],
  "logging": true,
  "synchronize": true
};



createConnection(options)
  .then(connection => {
    const userRepository = connection.getRepository(User);
    app.use(KoaBody({ multipart: true }));
    app.use(Router.routes()); // - было
    app.use(Router.allowedMethods()); // - было
    //TODO: {Public URLs} if you need to add more public url please write them below!!!
    const publicURLs = [
      '/user/login',
      '/user/registration',
      '/user/forgot-password',
      '/user/refreshAuthData',
    ];

    app.use(async (ctx, next) => {
      console.log(ctx.request.header.token);
      console.log(publicURLs.includes(ctx.request.url));
      console.log(ctx.request.url.indexOf('/user/reset-password/') === 0);


      // TODO: rewrite using regex to avoid '/user/reset-password/{key}/a/b/c/...' cases
      if (ctx.request.url.indexOf('/user/reset-password/') === 0) {
        return next();
      }

      if (publicURLs.includes(ctx.request.url)) {
        return next();
      }
      // check token
      if (await AuthService.checkAuth(ctx.request.header.token)) {
        return next();
      }
      return ctx.status = 401;
      // return 401
    });
    const server = app.listen(3030, () => {
      console.log('http://localhost:3030');
    });
  })
  .catch(error => {
  console.log("Error: ", error);
});
