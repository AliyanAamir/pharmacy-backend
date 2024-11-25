import { Prisma, Role, SocialAccountType, User } from '@prisma/client';

import { GoogleCallbackQuery } from '../../types';
import {
  compareHash,
  fetchGoogleTokens,
  getUserInfo,
  hashPassword,
  JwtPayload,
  signToken,
} from '../../utils/auth.utils';
import { generateRandomNumbers } from '../../utils/common.utils';
import {
  checkIfUserExistByEmail,
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from '../user/user.services';
import {
  ChangePasswordSchemaType,
  ForgetPasswordSchemaType,
  LoginUserByEmailSchemaType,
  RegisterUserByEmailSchemaType,
  ResetPasswordSchemaType,
} from './auth.schema';

export const resetPassword = async (payload: ResetPasswordSchemaType) => {
  const user: User = await getUserById(Number(payload.userId));

  if (!user || user.passwordResetCode !== payload.code) {
    throw new Error('token is not valid or expired, please try again');
  }

  if (payload.confirmPassword !== payload.password) {
    throw new Error('Password and confirm password must be same');
  }

  const hashedPassword = await hashPassword(payload.password);

  await updateUser(Number(payload.userId), {
    password: hashedPassword,
    passwordResetCode: null,
  });
};

export const forgetPassword = async (
  payload: ForgetPasswordSchemaType,
): Promise<User> => {
  const user = await getUserByEmail(payload.email);

  if (!user) {
    throw new Error("user doesn't exists");
  }

  const code = generateRandomNumbers(4);

  await updateUser(user.id, { passwordResetCode: code });

  return user;
};

export const changePassword = async (
  userId: number,
  payload: ChangePasswordSchemaType,
): Promise<void> => {
  const user = await getUserById(userId);

  if (!user || !user.password) {
    throw new Error('User is not found');
  }

  const isCurrentPassowordCorrect = await compareHash(
    user.password,
    payload.currentPassword,
  );

  if (!isCurrentPassowordCorrect) {
    throw new Error('current password is not valid');
  }

  const hashedPassword = await hashPassword(payload.newPassword);

  await updateUser(Number(userId), { password: hashedPassword });
};

export const registerUserByEmail = async (
  payload: RegisterUserByEmailSchemaType,
): Promise<User> => {
  const userExistByEmail = await checkIfUserExistByEmail(payload.email);

  if (userExistByEmail) {
    throw new Error('Account already exist with same email address');
  }

  const { confirmPassword, ...rest } = payload;

  const user = await createUser({ ...rest, role: Role.USER }, false);

  return user;
};

export const loginUserByEmail = async (
  payload: LoginUserByEmailSchemaType,
): Promise<string> => {
  const user = await getUserByEmail(payload.email);

  if (!user || !(await compareHash(String(user.password), payload.password))) {
    throw new Error('Invalid email or password');
  }

  const jwtPayload: JwtPayload = {
    sub: user.id,
    email: user?.email,
    phoneNo: user?.phoneNo,
    role: user.role,
    username: user.username,
  };

  const token = await signToken(jwtPayload);

  return token;
};

export const googleLogin = async (
  payload: GoogleCallbackQuery,
): Promise<Prisma.UserGetPayload<{ include: { socialAccount: true } }>> => {
  const { code, error } = payload;

  if (error) {
    throw new Error(error);
  }

  if (!code) {
    throw new Error('Code Not Provided');
  }
  const tokenResponse = await fetchGoogleTokens({ code });

  const { access_token, refresh_token, expires_in } = tokenResponse;

  const userInfoResponse = await getUserInfo(access_token);

  const { id, email, name, picture } = userInfoResponse;

  const user = await getUserByEmail(email);

  if (!user) {
    const newUser = await createUser({
      email,
      username: name,
      avatar: picture,
      role: Role.USER,
      password: generateRandomNumbers(4),
      socialAccount: {
        create: [
          {
            refreshToken: refresh_token,
            tokenExpiry: new Date(Date.now() + expires_in * 1000),
            accountType: SocialAccountType.GOOGLE,
            accessToken: access_token,
            accountID: id,
          },
        ],
      },
    });

    return newUser;
  }

  const updatedUser = await updateUser(user.id, {
    socialAccount: {
      create: [
        {
          refreshToken: refresh_token,
          tokenExpiry: new Date(Date.now() + expires_in * 1000),
          accountType: SocialAccountType.GOOGLE,
          accessToken: access_token,
          accountID: id,
        },
      ],
    },
  });

  return updatedUser;
};
