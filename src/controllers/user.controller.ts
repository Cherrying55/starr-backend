import { Request, Response } from "express";
import { creditService } from "../services/creditcard.services";
import { userservice } from "../services/user.services";

export async function signUp(req: Request, res: Response){
    const userdata = req.body;
    const token = "string";
try {
    const newuser = await userservice.createUser(userdata, token)
    return res.send(newuser)
} catch (error) {
    
}
}



export async function signIn(req: Request, res: Response){
    const userId = 1;
    const token = "string";
    const data = {tokenId: 1, executedAt: new Date().getTime(), status: "success"}
try {
    await userservice.createLoginAttempt(data)
    return res.send(token)
} catch (error) {
    
}
}

export async function createBillingAddress(req: Request, res: Response){
    
}

export async function updateCreditCard(req: Request, res: Response){
    const userId = 1;
    const creditId = 1;
    try{
        const updated = await creditService.updateCreditCard(creditId, req.body)
        return res.send(updated)
    }
    catch(e){

    }
}

export async function deleteCreditCard(req: Request, res: Response){
    const userId = 1;
    const creditId = 1;
    try{
        const deleted = await creditService.deleteCreditCard(creditId);
        return res.send(deleted)
    }
    catch(e){

    }
}