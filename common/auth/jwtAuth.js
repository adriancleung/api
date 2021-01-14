const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const util = require('util');
const {
  SUCCESS_CODE,
  UNAUTHORIZED,
  RESOURCE_NOT_FOUND,
} = require('@constants');
const { createUser, getUser } = require('@db/auth');

const jwtVerifyPromise = util.promisify(jwt.verify);

const signup = async (username, password) => {
  const hashedPassword = bcrypt.hashSync(password, 8);
  await createUser(username, hashedPassword);
  return;
};

const login = async (username, password) => {
  const user = await getUser(username);
  if (user.statusCode === RESOURCE_NOT_FOUND) {
    return {
      statusCode: UNAUTHORIZED,
      body: { accessToken: null, message: 'Incorrect username or password' },
    };
  } else {
    if (bcrypt.compareSync(password, user.body.password)) {
      const token = jwt.sign({ id: user.id }, process.env.jwt_secret, {
        expiresIn: 86400,
      });
      return {
        statusCode: SUCCESS_CODE,
        body: { id: user.id, username: user.body.username, accessToken: token },
      };
    } else {
      return {
        statusCode: UNAUTHORIZED,
        body: { accessToken: null, message: 'Incorrect username or password' },
      };
    }
  }
};

const verifyJwt = async token => {
  try {
    const decoded = await jwtVerifyPromise(token, process.env.jwt_secret);
    return {
      statusCode: SUCCESS_CODE,
      body: { userId: decoded.id, message: 'Authorized' },
    };
  } catch (err) {
    return {
      statusCode: UNAUTHORIZED,
      body: { userId: null, message: 'Unauthorized' },
    };
  }
};

module.exports = {
  login,
  signup,
  verifyJwt,
};
