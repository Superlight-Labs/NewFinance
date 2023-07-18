import { RouteError, conflict, other } from '@lib/routes/rest/rest-error';
import { Prisma } from '@prisma/client';

export const mapPrismaError = (context: string, error: unknown): RouteError => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      if (error.meta?.target && (error.meta.target as string).toLowerCase().includes('email')) {
        return conflict(error, 'Email is already taken!');
      }

      return conflict(error, 'Request Conflicts with existing data!');
    }
  }

  // Generic errors
  return other(context, error);
};
