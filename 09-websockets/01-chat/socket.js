const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server, {
    allowEIO3: true,
  });

  io.use(async function(socket, next) {
    const {token} = socket.handshake.query;
    if (!token) return next(new Error('anonymous sessions are not allowed'));

    const sessionUser = await Session.findOne({token: token}).populate('user');
    if (!sessionUser) return next(new Error('wrong or expired session token'));

    socket.user = sessionUser.user;
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      if (!msg) return;
      await Message.create({
        date: new Date(),
        text: msg,
        chat: socket.user.id,
        user: socket.user.displayName,
      });
    });
  });

  return io;
}

module.exports = socket;
