import { Application, application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

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

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction){
  const authHeader = req.header('Authorization');
  if (!authHeader) return generateUnauthorizedResponse(res);

  const token = authHeader.split(' ')[1];
  if (!token) return generateUnauthorizedResponse(res);

  try {
    const { userId } = jwt.verify(token, 'key') as unknown as JWTPayload;

    const session = await prisma.userSession.findFirst({
      where: {
        token,
      },
    });
    if (!session) return generateUnauthorizedResponse(res);

    req.userId = userId;

    return next();
  } catch (err) {
    return generateUnauthorizedResponse(res);
  }
}

function generateUnauthorizedResponse(res: Response) {
  res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
}

export type AuthenticatedRequest = Request & JWTPayload

type JWTPayload = {
  userId: number
};
