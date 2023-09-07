import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from './authentication.middleware';

const prisma = new PrismaClient();

export type ApplicationError = {
  name: string;
  message: string;
};

function unauthorizedError(): ApplicationError {
  return {
    name: 'UnauthorizedError',
    message: 'You must be signed in to continue',
  };
}

export async function authenticateCreditToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const creditHeader = req.header('CreditAuthorization');
  if (!creditHeader) return generateUnauthorizedResponse(res);

  const token = creditHeader.split(' ')[1];
  if (!token) return generateUnauthorizedResponse(res);

  try {
    const { creditId } = jwt.verify(token, 'key') as JWTPayload;

    const session = await prisma.tokenCredit.findFirst({
      where: {
        token,
      },
    });
    if (!session) return generateUnauthorizedResponse(res);

    req.creditId = creditId;

    return next();
  } catch (err) {
    return generateUnauthorizedResponse(res);
  }
}

function generateUnauthorizedResponse(res: Response) {
  res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
}

type JWTPayload = {
  creditId: number;
};
