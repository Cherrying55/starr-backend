import { userrepository } from "../repositories/user.repository";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import { createBillingAddressSchema } from "../schemas/createBillingAddress.schema";

async function createUser(userdata: any){
    const hashedPassword = await bcrypt.hash(userdata.password, 12);
    userdata.password = hashedPassword;
    return await userrepository.createUser(userdata);
}

async function login(email: string, password: string){
    const hasuser = await userrepository.getUserByEmail(email);
    if(!hasuser){
        let err = new Error();
        err.name = "403"
        err.message = "403";
        throw err;
    }
    else{
    if(!bcrypt.compareSync(hasuser.password, password)){
        let err = new Error();
        err.name = "403"
        err.message = "403";
        throw err;
    }
    return createSession(hasuser.id)
   
    }
}

async function createSession(userId: number){
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
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

async function createBillingAddress(data: createBillingAddressSchema, userId: number){
    data.userId = userId;
    const billingaddress = await userrepository.createBillingAddress(data);
    return billingaddress
}

async function updatePassword(userId: number, password: string){
    const updatepassword = await userrepository.updatePassword(userId, password)
    return updatepassword
}

async function updateBillingAddress(userId: number, data: any, id: number){
    //check if it exists
    const hasbillingaddress = await userrepository.getBillingAdressbyId(userId, id);
    if(!hasbillingaddress){
        throw new Error()
    }
    const updatebillingaddress = await userrepository.updateBillingAddress(userId, id, data)
    return updatebillingaddress
}

async function deleteBillingAddress(userId: number, id: number){
    const hasbillingaddress = await userrepository.getBillingAdressbyId(userId, id);
    if(!hasbillingaddress){
        throw new Error()
    }
    const deletebillingaddress = await userrepository.deleteBillingAddress(userId, id)
    return deletebillingaddress
}


export const userservice = {
    createUser,
    createSession,
    createLoginAttempt,
    createRetiredPassword
    ,createBillingAddress,
    updateBillingAddress,
    updatePassword
    ,login,
    deleteBillingAddress
}