import { creditRepository } from "../repositories/creditcard.repository";

async function getCreditCardbyUserId(id: number){
    return await creditRepository.getCreditCardbyUserId(id)
}

async function createCreditCard(data: any){
    return await creditRepository.createCreditCard(data)
}

async function createCreditToken(id: number, token: string){
    return await creditRepository.createCreditToken(id, token)
}

async function createTokenCreditUse(tokenId: number, operationtype: string, executedAt: string, status: string){
    return await creditRepository.createTokenCreditUse(tokenId, operationtype, executedAt, status)
}

async function updateCreditCard(creditId: number, data: any){
    return await creditRepository.updateCreditCard(creditId, data)
}

async function deleteCreditCard(id: number){
    return await creditRepository.deleteCreditCard(id)
}

async function deleteTokenCredit(creditId: number){
    return await creditRepository.deleteTokenCredit(creditId)
}

export const creditService = {
    getCreditCardbyUserId,
    createCreditCard,
    createCreditToken,
    createTokenCreditUse,
    updateCreditCard,
    deleteCreditCard,
    deleteTokenCredit
}