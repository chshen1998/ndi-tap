import uniqid from 'uniqid'
import { createInfoRequest } from "../service/info-request-service.js";
import { addPendingInfoRequest, getPendingInfoRequest, deletePendingInfoRequest } from '../model/redis.js';

export async function handleOpenInfoRequest(socket, requester) {
    const irCode = uniqid()
    socket.join(irCode)

    await addPendingInfoRequest(requester, irCode)

    socket.emit("openedIR", {
        irCode: irCode
    })
    return
}

export async function handleJoinInfoRequest(socket, requestee, irCode) {
    const requester = await getPendingInfoRequest(irCode)
    if (!requester) {
        socket.emit("invalidIR")
        return
    }

    socket.join(irCode)
    socket.emit("joinedIR", {
        requester: requester
    })
    return
}

export async function handleApproveInfoRequest(io, socket, requestee, irCode) {
    const requester = await getPendingInfoRequest(irCode)
    if (!requester) {
        socket.emit("invalidIR")
        return
    }

    await createInfoRequest(requester, requestee)
    await deletePendingInfoRequest(irCode)
    io.to(irCode).emit("approvedIR", {
        info: "Here is the requestee info"
    })
    return
}