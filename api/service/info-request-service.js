import { createInfoRequest as _createInfoRequest } from "../model/repository.js"

export async function createInfoRequest(requester) {
    const newInfoRequest = await _createInfoRequest(requester)
    newInfoRequest.save()
    return newInfoRequest
}