import {useEffect, useState} from "react";
import {TextField, Button, DialogActions, ToggleButton, ToggleButtonGroup} from "@mui/material";
import type {
    ProcessedEvent,
    SchedulerHelpers
} from "@aldabil/react-scheduler/types";
import {getUsers, updateConsultantEvent} from "../../services/services";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {styled} from "@mui/material/styles";

import {getEventsOnSpecificDate,updateStatus} from '../../services/services'
interface CustomEditorProps {
    scheduler: SchedulerHelpers;
}

const CustomEditor = ({ scheduler }: CustomEditorProps) => {

    const [clients,setClients] = useState([]);

    const event = scheduler.edited;

    // Make your own form/state
    const [state, setState] = useState({
        // title: event?.title || "",
        capsule: event?.title || "",
        client: event?.client || "",
        // description: event?.description || "",
        day: new Date(),
        time: 0,
    });

    const getClients=async () => {
        setClients(await getUsers())
    }

    useEffect(()=>{
        getClients()
    },[0])


    const getAvailableHours = async () => {
        console.log('here')
        const date = (new Date(state.day)).toLocaleDateString();
        const capsule = state.capsule;
        const client = state.client.split(" ")[0]
        const appointedSlots = await getEventsOnDate(date,capsule,client);
        console.log(appointedSlots)
        const currentTime = (new Date().toLocaleDateString())===(new Date(state.day)).toLocaleDateString() ? new Date().getHours() <7 ? 7 : new Date().getHours() : 7;
        let freeSlots = [];
        for (let i =7 ; i < 23 ; i++){
            // for (let i = currentTime; i < 23; i++) {
            let added=false;
            for(let j=0 ; j < appointedSlots.length ;j++){
                // here we have to check pm am also
                let time = (appointedSlots[j].split(':'))[0];
                if(appointedSlots[j].slice(-2)=='PM' && time!=12){
                    time=parseInt(time)+12;
                }
                if(time!=i){
                    added=true;
                }else{
                    added=false;
                    break;
                }
            }
            if(added)
                freeSlots.push(i);
        }
        if(appointedSlots.length===0) {
            for (let i = currentTime; i < 24; i++) {
                freeSlots.push(i);
            }
        }
        setAvailableHours(freeSlots);
    }


    const getEventsOnDate = async (date,capsule,client) => {
        return (await getEventsOnSpecificDate(date,capsule,client))
    }


    const handleSubmit = async () => {


        try {
            scheduler.loading(true);

            /**Simulate remote data saving */
            const added_updated_event = (await new Promise((res) => {
                /**
                 * Make sure the event have 4 mandatory fields
                 * event_id: string|number
                 * title: string
                 * start: Date|string
                 * end: Date|string
                 */
                event.start = new Date(new Date(new Date((new Date(state.day)).setHours(selectedTime)).setMinutes(0)).setSeconds(0));
                event.end = new Date(new Date(new Date((new Date(state.day)).setHours(selectedTime+1)).setMinutes(0)).setSeconds(0));

                setTimeout(() => {
                    res({
                        event_id:event.event_id,
                        title:event.title,
                        color:event.color,
                        start:event.start,
                        client:event.client,
                        employee:event.employee,
                        otherClients:event.otherClients,
                        status:'Reserved',
                        freeOfCost:event.freeOfCost,
                        end:event.end,
                        deletable:event.deletable,
                        clientName: event.clientName,
                        comment: event.comment,
                    });
                },10 );
            })) as ProcessedEvent;

            console.log(added_updated_event)
            await updateConsultantEvent(added_updated_event);

            scheduler.onConfirm(added_updated_event, event ? "edit" : "create");
            scheduler.close();
        } finally {
            scheduler.loading(false);
        }
    };
    const [selectedTime,setSelectedTime] = useState(0);
    const [availableHours,setAvailableHours] = useState([]);


    const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
        '& .MuiToggleButtonGroup-grouped': {
            margin: theme.spacing(0.5),
            border: 0,
            '&.Mui-disabled': {
                border: 0,
            },
            '&:not(:first-of-type)': {
                borderRadius: theme.shape.borderRadius,
            },
            '&:first-of-type': {
                borderRadius: theme.shape.borderRadius,
            },
        },
    }));

    const keypress = (e) => {
        if (e.keyCode === 13) {
            getAvailableHours();
        }
    }

    return (
        <div>
            <div className="m-4 flex flex-col">

                <DesktopDatePicker
                    name="date"
                    label="Date"
                    variant="outlined"
                    minDate={new Date()}
                    inputFormat="DD/MM/YYYY"
                    value={state.day}
                    onChange={(e)=>setState({...state,'day':e})}
                    renderInput={(params) => <TextField onKeyDown={keypress} fullWidth {...params} />}
                    // error={error.day}
                />
                <button className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={getAvailableHours}>Get Time</button>

                <p className="p-2">Availaible Slots</p>
                <StyledToggleButtonGroup
                    size="small"
                    color="primary"
                    value={selectedTime}
                    exclusive
                    onChange={(event,newTime)=>setSelectedTime(newTime)}
                    aria-label="text alignment"
                >
                    {
                        availableHours.map(ah=>
                            <ToggleButton value={ah}>{ah}</ToggleButton>
                        )
                    }
                </StyledToggleButtonGroup>

                <DialogActions>
                    <Button onClick={scheduler.close}>Cancel</Button>
                    <Button onClick={handleSubmit}>Confirm</Button>
                </DialogActions>
            </div>
        </div>
    );
};

export default CustomEditor;