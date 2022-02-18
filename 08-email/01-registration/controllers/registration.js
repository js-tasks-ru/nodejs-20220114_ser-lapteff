const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {

  const {email, displayName, password} = ctx.request.body;

  const verificationToken = uuid();
  const newUser = await User.create({
    email,
    displayName,
    verificationToken,
  });
  await newUser.setPassword(password);
  await newUser.save();

  if (newUser) {
    await sendMail({
      template: 'confirmation',
      locals: {token: verificationToken},
      to: email,
      subject: 'Подтвердите почту',
    });

    ctx.status = 200;
    ctx.body = {status: 'ok'};
  }
  return next();
};

module.exports.confirm = async (ctx, next) => {
  const user = await User.findOne({verificationToken: ctx.request.body.verificationToken});
  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return;
  }

  user.verificationToken = undefined;
  await user.save();
  const token = await ctx.login(user);
  ctx.body = {token};
  return next();

};

