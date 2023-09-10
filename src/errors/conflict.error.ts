import { ApplicationError } from "./protocol";

export function conflictError(): ApplicationError {
  return {
    name: 'ConflictError',
    message: `Conflict`,
  };
}