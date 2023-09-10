import { ApplicationError } from "./protocol";

export function handleErrors(error: ApplicationError){
    switch(error.name){
        default:
            return 505
        break
        case "ConflictError":
            return 409
            break
        case "NotFoundError":
            return 404
            break
        case "UnauthorizedError":
            return 401
            break
    }
}