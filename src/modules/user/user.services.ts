import { Prisma, SocialAccount, User } from '@prisma/client';
import { hashPassword } from '../../utils/auth.utils';
import { getPaginator } from '../../utils/getPaginator';

import { GetUsersSchemaType } from './user.schema';
import db from '../../lib/database';

export const updateUser = async (
  userId: number,
  payload: Prisma.UserUpdateInput,
): Promise<Prisma.UserGetPayload<{ include: { socialAccount: true } }>> => {
  const user = await db.user.update({
    where: { id: userId },
    data: payload,
    include: { socialAccount: true },
  });

  if (!user) throw new Error('User not found');

  return user;
};

export const getUserById = async (
  userId: number,
): Promise<Prisma.UserGetPayload<{ include: { socialAccount: true } }>> => {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { socialAccount: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const checkIfUserExistByEmail = async (
  email: string,
): Promise<boolean> => {
  const user = await db.user.findUnique({ where: { email } });

  return !!user;
};

export const getUserByEmail = async (
  email: string,
): Promise<Prisma.UserGetPayload<{ include: { socialAccount: true } }>> => {
  const user = await db.user.findUnique({
    where: { email },
    include: { socialAccount: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const deleteUser = async (userId: number) => {
  const user = await db.user.delete({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }
};

export const getUsers = async (userId: number, payload: GetUsersSchemaType) => {
  const currentUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (!currentUser) {
    throw new Error('User must be logged in');
  }

  const where: Prisma.UserWhereInput = {};

  if (payload.searchString) {
    where.OR = [
      { name: { contains: String(payload.searchString), mode: 'insensitive' } },
      {
        email: { contains: String(payload.searchString), mode: 'insensitive' },
      },
    ];
  }

  const totalRecords = await db.user.count({ where });
  const paginatorInfo = getPaginator(
    Number(payload.limitParam),
    Number(payload.pageParam),
    totalRecords,
  );

  const results = await db.user.findMany({
    where,
    include: { socialAccount: true },
    take: paginatorInfo.limit,
    skip: paginatorInfo.skip,
  });

  return {
    results,
    paginatorInfo,
  };
};

export const createUser = async (
  payload: Prisma.UserCreateInput,
  checkExist: boolean = true,
): Promise<Prisma.UserGetPayload<{ include: { socialAccount: true } }>> => {
  if (checkExist) {
    const isUserExist = await db.user.findUnique({
      where: { email: payload.email },
    });

    if (isUserExist) {
      throw new Error('User already exists');
    }
  }

  if (!payload.password) {
    throw new Error('Password is required');
  }

  const hashedPassword = await hashPassword(payload.password);

  const createdUser = await db.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    include: { socialAccount: true },
  });

  return { ...createdUser, password: '', otp: null };
};
