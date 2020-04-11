const User = require("../models/User");

const { OAuth2Client } = require("google-auth-library");
console.log(process.env.OAUTH_CLIENT_ID);

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async (token) => {
  // 1) Verify auth token

  const googleUser = await verifyAuthToken(token);

  // 2) Check if the user exists
  const user = await checkIfUserExists(googleUser.email);

  //  3) If user exists return them; otherwise create new user in DB
  return user ? user : createNewUser(googleUser);
};

const verifyAuthToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID,
    });

    return ticket.getPayload();
  } catch (err) {
    console.error(err);
  }
};

const checkIfUserExists = async (email) => await User.findOne({ email }).exec();

const createNewUser = (googleUser) => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };

  return new User(user).save();
};
