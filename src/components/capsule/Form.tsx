import {useEffect, useState} from "react";
import {TextField, Button, DialogActions, ToggleButton, ToggleButtonGroup} from "@mui/material";
import type {
    ProcessedEvent,
    SchedulerHelpers
} from "@aldabil/react-scheduler/types";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {addEvent, getUsers} from "../../services/services";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {styled} from "@mui/material/styles";

import {getEventsOnSpecificDate,updateStatus} from '../../services/services'
interface CustomEditorProps {
    scheduler: SchedulerHelpers;
}

const CustomEditor = ({ scheduler }: CustomEditorProps) => {

    const initialCapsules = [
        {
            id:1,
            name:'Kapsula C3 / Pesona',
            img:'capsule_one.jpg',
            description:'capsule is highly effective for breathing and stuff',
            color:'blue',
            options: [{text:'R-9',color:'bg-green-400'},{text:'G-9',color:'bg-red-300'}]
        },
        {
            id:2,
            name:'Kapsula I-90 / 1 Person',
            img:'capsule_two.jpg',
            color:'red',
            description:'capsule is highly effective for breathing and stuff',
            options: [{text:'R-99',color:'bg-yellow-200'},{text:'G-99',color:'bg-red-300'}]
        },
        {
            id:3,
            name:'Kapsula I-90 / 2 Person',
            img:'capsule_three.jpg',
            color:'green',
            description:'capsule is highly effective for breathing and stuff',
            options: [{text:'R-999',color:'bg-orange-400'},{text:'G-999',color:'bg-red-300'}]
        }
    ];

    const [capsules,setCapsules] = useState(initialCapsules);
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
    const [error, setError] = useState({
        // title:"",
        capsule:"",
        client:"",
    });

    const getClients=async () => {
        setClients(await getUsers())
    }

    useEffect(()=>{
        getClients()
    },[0])

    useEffect(()=>{
        getAvailableHours();
    },[state.capsule,state.day])

    const getAvailableHours = async () => {
        const date = (new Date(state.day)).toLocaleDateString();
        const capsule = state.capsule;
        const client = state.client.split(" ")[0]
        console.log(capsule)
        const appointedSlots = await getEventsOnDate(date,capsule,client);
        const currentTime = (new Date().toLocaleDateString())===(new Date(state.day)).toLocaleDateString() ? new Date().getHours() <7 ? 7 : new Date().getHours() : 7;
        console.log('Current Time : ' + currentTime);
        console.log( (new Date().toLocaleDateString()))
        console.log((new Date(state.day)).toLocaleString())
        console.log('appointed slots')
        console.log(appointedSlots)
        let freeSlots = [];
        for (let i = currentTime; i < 23; i++) {
            let added=false;
            for(let j=0 ; j < appointedSlots.length ;j++){
                // here we have to check pm am also
                let time = (appointedSlots[j].split(':'))[0];
                if(appointedSlots[j].slice(-2)=='PM'){
                    time=parseInt(time)+12;
                    console.log('here here here')
                }
                if(time!=i){
                    added=true;
                }else{
                    console.log('AND Appoineted slot j : '+(appointedSlots[j].split(':'))[0] +"  "+ i)
                    added=false;
                    break;
                }
            }
            if(added)
                freeSlots.push(i);
        }
        console.log('free slots')
        console.log(freeSlots)
        if(appointedSlots.length===0) {
            for (let i = currentTime; i < 24; i++) {
                freeSlots.push(i);
            }
        }
        console.log(freeSlots)
        setAvailableHours(freeSlots);
    }


    const getEventsOnDate = async (date,capsule,client) => {
        // console.log('Hello : ' + await getEventsOnSpecificDate(date))
        return (await getEventsOnSpecificDate(date,capsule,client))
    }


    const handleChange = (value: string, name: string) => {
        console.log(value);
        setError((prev)=>{
            return {
                ...prev,
                [name]: ""
            }
        })
        // if(name==="capsule")
        //     setAvailableHours(getAvailableHours(value,scheduler.state.start.value));
        setState((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    };
    const handleSubmit = async () => {

        console.log(state);

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
                        treatment:event.treatment,
                        end:event.end,
                        deletable:event.deletable,
                        clientName: event.clientName,
                        comment: event.comment,
                        treatmentNumber: event.treatmentNumber,
                        payment: event.payment,
                    });
                }, 3000);
            })) as ProcessedEvent;

            console.log('hello hello hello : ')
            console.log(added_updated_event)
            await updateStatus(added_updated_event,'Reserved');

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

    return (
        <div>
            <div className="m-4">

                <DesktopDatePicker
                    name="date"
                    label="Date"
                    variant="outlined"
                    minDate={new Date()}
                    inputFormat="DD/MM/YYYY"
                    value={state.day}
                    onChange={(e)=>setState({...state,'day':e})}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                    // error={error.day}
                />

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