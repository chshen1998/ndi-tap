import {useState, useEffect} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {withRouter} from 'react-router-dom';
import myinfo from './myinfo.png'

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
    height: '20%',
  };

const MyInfoModal = ({socket, authCode, state}) => {

		// ---START---PREFILL FORM (with MyInfo data)
		const prefillForm = (data) => {
			// prefill form data
			var address = "";
			if (data.regadd.type == "SG") {
				address = data.regadd.country == "" ? "" :
					data.regadd.block + " " +
					data.regadd.building + " \n" +
					"#" + data.regadd.floor + "-" + data.regadd.unit + " " +
					data.regadd.street + " \n" +
					"Singapore " + data.regadd.postal
			} else if (data.regadd.type == "Unformatted") {
				address = data.regadd.line1 + "\n" +
					data.regadd.line2
			}
			var formValues = {
				"uinfin": data.uinfin,
				"name": data.name,
				"sex": data.sex,
				"race": data.race,
				"nationality": data.nationality,
				"dob": data.dob,
				"email": data.email,
				"mobileno": data.mobileno.prefix + data.mobileno.areacode + " " + data.mobileno.nbr,
				"regadd": address,
				"housingtype": data.housingtype == "" ? data.hdbtype : data.housingtype,
				"marital": data.marital,
				"edulevel": data.edulevel
			};
            console.log(formValues)
			// Populate values
			//populate('#formApplication', formValues);
		}


    useEffect(() => {
        socket.emit("getPersonData", authCode, state)
      }, [])

    return (
        <Box sx={style}> 
            <Typography id="modal-modal-title" variant="h6" component="h2">
                <h3>Authenticating with Singpass...</h3>
            </Typography>
        </Box>
    )
}

export default MyInfoModal
