import {useEffect, useState} from "react";
import { TextField, Button, DialogActions } from "@mui/material";
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
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {EVENTS} from './Calendar'
interface CustomEditorProps {
    scheduler: SchedulerHelpers;
}

const clients = [
    {
        name:'hello',
        email:'hello@mail.com',
        phone:'1432432423'
    }
]
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
        // if(name==="date")
        //     setAvailableHours(getAvailableHours(getEventsOnDate(value)));
        setState((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    };
    const handleSubmit = async () => {

        if(state.capsule===''){
            return setError({client:"",capsule:"Select a Capsule please"});
        }
        if(state.client===''){
            return setError({client:"Select a client please",capsule:""});
        }
        // console.log(EVENTS[0].start.toLocaleTimeString());
        // Your own validation
        // if (state.title.length < 3) {
        //     return setError({title:"Min 3 letters",capsule:""});
        // }

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
                setTimeout(() => {
                    res({
                        event_id: event?.event_id || Math.random(),
                        title: state.capsule,
                        start: state.time,
                        end: scheduler.state.end.value,
                        color: getColor(state.capsule),
                        client: state.client
                    });
                }, 3000);
            })) as ProcessedEvent;

            scheduler.onConfirm(added_updated_event, event ? "edit" : "create");
            scheduler.close();
        } finally {
            scheduler.loading(false);
        }
    };
    return (
        <div>
            <div style={{ padding: "1rem" }}>
                <p>Load your custom form/fields</p>

                <TimePicker
                    label="Time"
                    value={state.time}
                    ampm={false}
                    onChange={(e) => handleChange(e, "time")}
                    renderInput={(params) => <TextField fullWidth sx={{ m: 1, minWidth: 120 }} {...params} />}
                />

                <FormControl fullWidth sx={{ m: 1, minWidth: 120 }} error={!!error.capsule}>
                    <InputLabel>Capsule</InputLabel>
                    <Select
                        value={state.capsule}
                        label="Capsule"
                        onChange={(e)=>handleChange(e.target.value, "capsule")}
                    >

                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {
                            capsules.map(capsule=>{
                                return <MenuItem value={capsule.name}>{capsule.name}</MenuItem>
                            })
                        }
                    </Select>
                    <FormHelperText>{error.capsule}</FormHelperText>
                </FormControl>

                <FormControl fullWidth sx={{ m: 1, minWidth: 120 }} error={!!error.client}>
                    <InputLabel>Client</InputLabel>
                    <Select
                        value={state.client}
                        label="Client"
                        onChange={(e)=>handleChange(e.target.value, "client")}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {
                            clients.map(client=>{
                                return <MenuItem value={client.phone}>{client.phone}</MenuItem>
                            })
                        }
                    </Select>
                    <FormHelperText>{error.client}</FormHelperText>
                </FormControl>

                {/*<div>*/}
                {/*    {*/}
                {/*    availableHours.map(ah=>*/}
                {/*        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-zinc-600 bg-zinc-200 uppercase last:mr-0 mr-1">*/}
                {/*            {ah}*/}
                {/*        </span>*/}
                {/*        )*/}
                {/*    }*/}
                {/*</div>*/}

                {/*<TextField*/}
                {/*    label="Title"*/}
                {/*    value={state.title}*/}
                {/*    onChange={(e) => handleChange(e.target.value, "title")}*/}
                {/*    error={!!error.title}*/}
                {/*    helperText={error.title}*/}
                {/*    fullWidth*/}
                {/*/>*/}
                {/*<TextField*/}
                {/*    label="Description"*/}
                {/*    value={state.description}*/}
                {/*    onChange={(e) => handleChange(e.target.value, "description")}*/}
                {/*    fullWidth*/}
                {/*/>*/}
            </div>
            <DialogActions>
                <Button onClick={scheduler.close}>Cancel</Button>
                <Button onClick={handleSubmit}>Confirm</Button>
            </DialogActions>
        </div>
    );
};

export default CustomEditor;