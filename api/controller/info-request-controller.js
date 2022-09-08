import { createInfoRequest } from "../service/info-request-service.js";

export async function handleCreateInfoRequest(req, res) {
    const body = req.body
    const infoReq = await createInfoRequest(body["requester"])
    if (infoReq.err) {
        return res.status(400).json({message:"Failed to make info request"})
    } else {
        return res.status(200).json({message:"Success"})
    }
}