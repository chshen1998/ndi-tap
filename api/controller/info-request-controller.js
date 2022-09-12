import uniqid from 'uniqid'
import { randomBytes } from 'crypto';
import delay from 'delay'
import MyInfoConnector from 'myinfo-connector-nodejs';
import {APP_CONFIG, MYINFO_CONNECTOR_CONFIG} from '../config/config.js'
import { addToCache, getFromCache, deleteFromCache } from '../model/redis.js';
import {createInfoRequest} from '../service/info-request-service.js'

export async function handleOpenInfoRequest(socket) {
    const irCode = uniqid()
    socket.join(irCode)

    var requester = await getFromCache(socket.id)
    await addToCache(irCode, requester)

    socket.emit("openedIR", {
        irCode: irCode
    })

    const received = await receivedInfoWithin120s(irCode)
    if (!received) {
        socket.emit("timeoutIR")
    }
    return
}

export async function handleJoinInfoRequest(socket, irCode) {
    const exists = await getFromCache(irCode)
    if (!exists) {
        socket.emit("invalidIR")
        return
    }

    const requestee = await getFromCache(socket.id)

    socket.join(irCode)
    socket.emit("joinedIR", {
        data: requestee
    })
    return
}

export async function handleApproveInfoRequest(io, socket, irCode) {
    const requester = await getFromCache(irCode)
    if (!requester) {
        socket.emit("invalidIR")
        return
    }

    const requestee = await getFromCache(socket.id)
    await createInfoRequest(requester['uinfin'], requestee['uinfin'], APP_CONFIG.DEMO_APP_SCOPES)

    await deleteFromCache(irCode)
    io.to(irCode).emit("approvedIR", {
        data: requestee
    })
    return
}

export async function handleDisconnect(socket) {
    await deleteFromCache(socket.id)
}

export async function handleGetPersonData(socket, authCode, state) {
    try {
        var txnNo = randomBytes(10).toString("hex");
    
        let connector = new MyInfoConnector(MYINFO_CONNECTOR_CONFIG);
        console.log("Calling MyInfo NodeJs Library...".green);
    
        connector.getMyInfoPersonData(authCode, state, txnNo)
          .then(personData => {
            console.log('--- Sending Person Data From Your-Server (Backend) to Your-Client (Frontend)---:'.green);
            var data = parseData(personData)
            addToCache(socket.id, data)
            socket.emit("dataReceived")
          })
          .catch(error => {
            console.log("---MyInfo NodeJs Library Error---".red);
            console.log(error);
            socket.emit("myinfoError")
          });
      } catch (error) {
        console.log("Error".red, error);
        socket.emit("myinfoError")
    }
}

async function receivedInfoWithin120s(irCode) {
    await delay(120000)
    const requester = getFromCache(irCode)
    if (requester) {
        deleteFromCache(irCode)
        return false
    }
    return true
}

function parseData(data) {
    var map = {}
    map['uinfin'] = data.uinfin.value
    map['name'] = data.name.value
    map['sex'] = data.sex.desc
    map['race']  = data.race.desc
    map['nationality'] = data.nationality.desc
    map['dob'] = data.dob.value
    return map
}