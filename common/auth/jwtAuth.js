const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  SUCCESS_CODE,
  UNAUTHORIZED,
  FORBIDDEN,
  RESOURCE_NOT_FOUND,
} = require('../constants');
const { createUser, getUser } = require('../db/auth');

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

const verify = token => {
  try {
    const decoded = jwt.verify(token, process.env.jwt_secret);
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

const validateToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(FORBIDDEN).send({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.jwt_secret, (err, decoded) => {
    if (err) {
      return res.status(UNAUTHORIZED).send({ message: 'Unauthorized' });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = {
  login,
  signup,
  verify,
  validateToken,
};
