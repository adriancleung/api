import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import { ApiResponse, ApiResponseCode } from '../types/response';
import { encode } from '../utilities/encode';

const generateApiKey = async () => {
  while (true) {
    const apiKey = encode(uuidv4().replace(/-/g, ''));
    const exists = await User.findOne({
      where: { apiKey: apiKey },
      attributes: ['apiKey'],
    });
    if (!exists) {
      return apiKey;
    }
  }
};

const loginUser = async (
  email: string,
  password: string
): Promise<ApiResponse> => {
  const user = await User.findOne({
    where: {
      email: email,
    },
    attributes: ['passwordHash'],
  });

  if (user === null) {
    return {
      statusCode: ApiResponseCode.UNAUTHORIZED,
      body: { message: 'Incorrect email or password' },
    };
  }
  if (bcrypt.compareSync(password, user.passwordHash)) {
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET
    );
    return {
      statusCode: ApiResponseCode.SUCCESS,
      body: {
        userId: user.id,
        email: user.email,
        accessToken: token,
        role: user.role,
        message: 'Authorized',
      },
    };
  } else {
    return {
      statusCode: ApiResponseCode.UNAUTHORIZED,
      body: { message: 'Incorrect email or password' },
    };
  }
};

const registerUser = async (
  email: string,
  password: string
): Promise<ApiResponse> => {
  const passwordHash = bcrypt.hashSync(password, 10);
  try {
    await User.create({
      email: email,
      passwordHash: passwordHash,
      apiKey: await generateApiKey(),
    });
  } catch (err) {
    console.error(err);
    return {
      statusCode: ApiResponseCode.SERVER_ERROR,
      body: {
        message: err,
      },
    };
  }
  return loginUser(email, password);
};

export { generateApiKey, loginUser, registerUser };
