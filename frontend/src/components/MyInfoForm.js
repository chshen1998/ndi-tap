import {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    height: '40%',
  };

const MyInfoForm = ({socket, irCode, data, isModal}) => {
    useState(() => {
        console.log("in modal")
        console.log(data)
    })
    const sendInfo = () => {
        socket.emit("approveIR", irCode)
    }

    return (
        <Box sx={style}> 
            <p>Uinfin: {data['uinfin']}</p>
            <p>Name: {data['name']}</p>
            <p>Sex: {data['sex']}</p>
            <p>Race: {data['race']}</p>
            <p>Nationality: {data['nationality']} </p>
            <p>Date of Birth: {data['dob']}</p>
            {isModal ?
                <Button variant="contained" onClick={sendInfo}>
                    Send Info
                </Button>
            : <div></div>}  
        </Box>
    )
}

export default MyInfoForm
