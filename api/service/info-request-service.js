import { createInfoRequest as _createInfoRequest } from "../model/repository.js"

export async function createInfoRequest(requester, requestee) {
    const newInfoRequest = await _createInfoRequest(requester, requestee)
    newInfoRequest.save()
    return newInfoRequest
}