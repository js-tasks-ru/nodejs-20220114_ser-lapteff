const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const {id} = ctx.user;
  const messages = await Message.find({chat: id}).sort({'date': -1}).limit(20);
  ctx.body = {messages: messages.map((msg) => mapMessage(msg))};
  next();
};
