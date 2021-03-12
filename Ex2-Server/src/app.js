import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dragonTigerHandler from './dragonTiger/socketHandler/dragon-tiger';
export const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:7456',
    methods: ['GET', 'POST']
  },
  path: '/socketIo/dragon-tiger/'
});

app.use(logger('dev'));
app.use(json());
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

io.on('connection', socket => {
  console.log('a user connected', socket.id);
  socket.on('dragon-tiger', req => dragonTigerHandler(io.to(socket.id), req));
});

export const start = async () => {
  try {
    httpServer.listen(4500, () => {
      console.log(`REST API on http://localhost:${4500}/api`);
    });
  } catch (e) {
    console.error(e);
  }
};
