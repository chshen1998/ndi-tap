import { createInfoRequest as _createInfoRequest} from "../model/repository.js"

// Create Information Request transaction log and saves it to database
export async function createInfoRequest(requester, requestee, scopes) {
    const newInfoRequest = await _createInfoRequest(requester, requestee, scopes)
    newInfoRequest.save()
}