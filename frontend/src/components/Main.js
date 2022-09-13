import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import io from "socket.io-client";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import MyInfoModal from './MyInfoModal'
import MyInfoForm from './MyInfoForm'


const socket = io(process.env.API_URL, {
  withCredentials: true,
  transports: ['websocket'],
})

const Main = () => {
  const params = new URLSearchParams(window.location.search);
  const authCode = params.get("code")
  const state = params.get("state")

  const [irCode, setIrCode] = useState('')
  const [waiting, setWaiting] = useState(false)
  const [message, setMessage] = useState('')
  const [info, setInfo] = useState('')
  const [infoReceived, setInfoReceived] = useState(false)
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [open, setOpen] = useState(true);
  const [openForm, setOpenForm] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  const handleCodeChange = (e) => {
    setIrCode(e.target.value)
  }

  const handleJoinRequest = () => {
    socket.emit('joinIR', irCode)
  }

  useEffect(() => {

    if (socket) {
      socket.on('connect', () => {
        setIsConnected(true)
        console.log("connected")
      })
  
      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log("disconnected")
      });

      socket.on('dataReceived', () => {
        handleClose()
        setMessage("Successful login to Singpass")
      })

      socket.on('myinfoError', () => {
        handleClose()
        setMessage("Failed to authenticate with MyInfo")
      })
  
      socket.on('openedIR', (data) => {
        setMessage("Opened Request Code: " + data.irCode)
        setWaiting(true)
        console.log("room created")
      })
  
      socket.on('joinedIR', (data) => {
        console.log(data)
        setOpenForm(true)
        setInfo(data.data)
      })
      
      socket.on('approvedIR', (data) => {
        setOpenForm(false)
        setWaiting(false)
        setInfoReceived(true)
        setInfo(data.data)
      })
  
      socket.on('invalidIR', () => {
        setMessage("Invalid Info Request Code")
        })

      socket.on('timeoutIR', () => {
        setWaiting(false)
        setMessage("Info request has timedout")
      })
      }
    }, [socket]);

    const openRequest = () => {
      socket.emit("openIR")
    }

  return (
    <div style={{ display: "flex", flexDirection: "column"}} classname='buttonGroup'>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <MyInfoModal socket={socket} authCode={authCode} state={state}/>
      </Modal>

      <Modal open={openForm} onClose={handleCloseForm} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <MyInfoForm socket={socket} irCode={irCode} data={info} isModal={true}/>
      </Modal>

      <TextField label="Info Request code" variant="standard" type="irCode" onChange={handleCodeChange}/>
      <br/>
      <Button variant="contained" onClick={handleJoinRequest}>Send MyInfo</Button>      
      <br/>
        <Button variant="contained" onClick={openRequest}>
          Request For Info
        </Button>
        <br/>
        <h4>
        {message}
        </h4>
        <br/>
        {waiting ? 
          (<CountdownCircleTimer
          isPlaying
          duration={120}
          colors={"#000000"}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>)
      : (<div></div>)}
      <br/>
      {infoReceived?
        <MyInfoForm data={info} isModal={false}/>
        : <div></div>}
    </div>
  );
}

export default Main;