import uniqid from 'uniqid'
import { createInfoRequest } from "../service/info-request-service.js";

export async function handleOpenInfoRequest(socket, requester) {
    const infoReq = await createInfoRequest(requester)

    if (infoReq.err) {
        socket.emit("IRFailed")
        return
    }

    const roomCode = uniqid()
    socket.join(roomCode)
    socket.emit("IRCreated", {
        roomCode: roomCode
    })
    return
}