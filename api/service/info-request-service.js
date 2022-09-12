import { createInfoRequest as _createInfoRequest} from "../model/repository.js"

export async function createInfoRequest(requester, requestee, scopes) {
    const newInfoRequest = await _createInfoRequest(requester, requestee, scopes)
    newInfoRequest.save()
}