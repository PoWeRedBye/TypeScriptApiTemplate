import Koa from 'koa';
import KoaBody from 'koa-body';
import mount from 'koa-mount';
import serve from 'koa-static';
import dotenv from 'dotenv';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Router } from './router';
import { User } from './db/entities/user';

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

const myConnection = (connection: Connection) => {
  //TODO: {new db entities} add new database repository here!!!
  connection.getRepository(User);
  app.use(KoaBody({ multipart: true }));
  app.use(mount("/file", serve("./file")));
  app.use(Router.routes());
  app.use(Router.allowedMethods());
  dotenv.config();
  const port = process.env.APP_PORT;
  const server = app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
};

createConnection(options)
  .then(myConnection)
  .catch(error => {
  console.log("Error: ", error);
});