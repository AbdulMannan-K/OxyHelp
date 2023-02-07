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
//
// const clients = [
//     {
//         name:'hello',
//         email:'hello@mail.com',
//         phone:'1432432423'
//     }
// ]
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

    const getClients=async () => {
        setClients(await getUsers())
    }

    useEffect(()=>{
        getClients()
    },[0])

    const event = scheduler.edited;

    // Make your own form/state
    const [state, setState] = useState({
        // title: event?.title || "",
        capsule: event?.title || "",
        client: event?.cleint || "",
        // description: event?.description || "",
        time: event?.time || scheduler.state.start.value,
    });
    const [error, setError] = useState({
        // title:"",
        capsule:"",
        client:"",
    });

    const getColor = (capsule)=> {
        if(capsule==='Kapsula I-90 / 2 Person') return 'orange'
        if(capsule==='Kapsula I-90 / 1 Person') return 'yellow'
        if(capsule==='Kapsula C3 / Pesona') return 'green'
    }
    // const [availableHours,setAvailableHours] = useState([]);

    // const getEventsOnDate = (date)=>{
    //     let events= [];
    //     for(let j=0 ; j < EVENTS.length ; j++){
    //         console.log((new Date(state.date).toLocaleDateString())+'  '+EVENTS[j].start.toLocaleDateString())
    //         if(((new Date(date).toLocaleDateString())===EVENTS[j].start.toLocaleDateString())){
    //             events.push(EVENTS[j]);
    //         }
    //     }
    //     return events;
    // }
    //
    // const getAvailableHours = (events)=>{
    //     let hours=[];
    //     for(let j=0 ; j < 24 ; j++){
    //         let exist = false;
    //         for(let i=0 ; i < events.length ; i++){
    //             if(j===events[i].start.getHours()) {
    //                 exist = true;
    //                 break;
    //             }
    //         }
    //         if(!exist) hours.push(j);
    //     }
    //     return hours;
    // }
    //
    // const handleTimeChange = (value: string, name: string) => {
    //     setError((prev)=>{
    //         return {
    //             ...prev,
    //             [name]: ""
    //         }
    //     })
    //     // if(name==="date")
    //     //     setAvailableHours(getAvailableHours(getEventsOnDate(value)));
    //     setState((prev) => {
    //         return {
    //             ...prev,
    //             [name]: value
    //         };
    //     });
    //     let caps = [];
    //     let events = getEventsOnDate(value);
    //     for(let i=0 ;i < events.length ; i++){
    //         if(events.capsule!==)
    //     }
    // };

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
                event.start = new Date(new Date(new Date((new Date(event.start)).setHours(selectedTime)).setMinutes(0)).setSeconds(0));
                event.end = new Date(new Date(new Date((new Date(event.start)).setHours(selectedTime+1)).setMinutes(0)).setSeconds(0));

                setTimeout(() => {
                    res({
                        event_id:event.event_id,
                        client:event.client,
                        otherClients:event.otherClients,
                        start:event.start,
                        end:event.end,
                        color:event.color,
                        title:event.title,
                        status:event.status,
                        clientName:event.clientName,
                        employee:event.employee,
                        freeOfCost:event.freeOfCost,
                        treatment:event.treatment,
                        deletable:event.deletable,
                    });
                }, 3000);
            })) as ProcessedEvent;

            console.log('hello hello hello : ')
            console.log(added_updated_event)
            await updateStatus(added_updated_event,event.status);

            scheduler.onConfirm(added_updated_event, event ? "edit" : "create");
            scheduler.close();
        } finally {
            scheduler.loading(false);
        }
    };
    const [selectedTime,setSelectedTime] = useState(0);
    const [availableHours,setAvailableHours] = useState([]);


    const getEventsOnDate = async (date,capsule) => {
        // console.log('Hello : ' + await getEventsOnSpecificDate(date))
        return (await getEventsOnSpecificDate(date,capsule))
    }

    useEffect(()=>{
        getAvailableHours();
    },[event.title,event.start])
    const getAvailableHours = async () => {
        const date = (new Date(event.start)).toLocaleDateString();
        const capsule = event.title;
        console.log(capsule)
        const appointedSlots = await getEventsOnDate(date,capsule);
        console.log('appointed slots')
        console.log(appointedSlots)
        let freeSlots = [];
        for (let i = 7; i < 24; i++) {
            let added=false;
            for(let j=0 ; j < appointedSlots.length ;j++){
                if((appointedSlots[j].split(':'))[0]!=i){
                    added=true;
                }else{
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
            for (let i = 7; i < 24; i++) {
                freeSlots.push(i);
            }
        }
        console.log(freeSlots)
        setAvailableHours(freeSlots);
    }
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
                <p className="ml-2.5 mb-2.5">Available Slots : </p>
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
                    {/*<ToggleButton value="left" aria-label="left aligned">*/}
                    {/*</ToggleButton>*/}
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