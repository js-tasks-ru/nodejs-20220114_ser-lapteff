const User = require('../../models/User');
module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (!email) return done(null, false, 'Не указан email');

    const user = await User.findOne({email: email});
    if (user) return done(null, user);

    if (!user) {
      const newUser = await User.create({
        email,
        displayName,
      });

      return done(null, newUser);
    }
  } catch (err) {
    // console.log(err);
    done(err);
  }
};
