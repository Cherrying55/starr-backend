import { ApplicationError } from "./protocol";

export function notfoundError(entity: string): ApplicationError {
  return {
    name: 'NotFoundError',
    message: `${entity} not found`,
  };
}