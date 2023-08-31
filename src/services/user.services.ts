import { userrepository } from "../repositories/user.repository";

async function createUser(userdata: any, token: string){
    const user = await userrepository.createUser(userdata);
    const session = await createSession(user.id, token)
    return session;
}

async function createSession(userId: number, token: string){
    const session = await userrepository.createSession(userId, token);
    return session
}

async function createLoginAttempt(data: any){
    const loginattempt = await userrepository.createLoginAttempt(data);
    return loginattempt
}

async function createRetiredPassword(data: any){
    const retiredpassword = await userrepository.createRetiredPassword(data);
    return retiredpassword
}

async function createBillingAddress(data: any){
    const billingaddress = await userrepository.createBillingAddress(data);
    return billingaddress
}

async function updatePassword(userId: number, password: string){
    const updatepassword = await userrepository.updatePassword(userId, password)
    return updatepassword
}

async function updateBillingAddress(userId: number, data: any){
    const updatebillingaddress = await userrepository.updateBillingAddress(userId, data)
    return updatebillingaddress
}

export const userservice = {
    createUser,
    createSession,
    createLoginAttempt,
    createRetiredPassword
    ,createBillingAddress,
    updateBillingAddress,
    updatePassword
}