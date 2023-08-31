import { Request, Response } from "express";
import { creditService } from "../services/creditcard.services";

export async function getCreditCardbyUserId(req: Request, res: Response){
    const userId = 1;
try {
    const creditcard = await creditService.getCreditCardbyUserId(userId);
    return res.send(creditcard)
} catch (error) {
    
}
}



export async function createCreditCard(req: Request, res: Response){
    const userId = 1;
    const token = "string";
    const data = {PAN: req.body.PAN, 
        expirationdate: req.body.expirationdate, 
        cardholdername: req.body.cardholdername,
    brand: req.body.brand,
userId};
try {
    const created = await creditService.createCreditCard(data, token)
    return res.send(created)
} catch (error) {
    
}
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