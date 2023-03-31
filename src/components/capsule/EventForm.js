import {useEffect, useState} from 'react';
import {Form, useForm} from "../controls/useForm";
import {Autocomplete, Button, Grid, Switch, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import Input from "../controls/Input";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import {
    getEvent,
    getEventsOnSpecificDate,
    getTreatment,
    getUsers
} from "../../services/services";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import {styled} from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FormControlLabel from "@mui/material/FormControlLabel";
import {addMultipleEvents} from "../../services/services"

const initialValues = {
    client:'',
    otherClients:[],
    start:new Date(),
    clientInfo:{},
    end:'',
    color:'',
    title:'',
    status:'Reserved',
    clientName:'',
    employee:'',
    freeOfCost:'no',
    treatment:1,
    repTreatment:'',
    deletable:true,
    comment:'',
}

const capsules = [
    {
        id:1,
        name:'Kapsula C3 / Pesona',
        img:'capsule_one.jpg',
        description:'capsule is highly effective for breathing and stuff',
        color:'blue',
        capsuleName:'Kapsula 9',
        options: [{text:'R-9',color:'bg-green-400'},{text:'G-9',color:'bg-red-300'}]
    },
    {
        id:2,
        name:'Kapsula I-90 / 1 Person',
        img:'capsule_two.jpg',
        color:'red',
        description:'capsule is highly effective for breathing and stuff',
        capsuleName:'Kapsula 99',
        options: [{text:'R-99',color:'bg-yellow-200'},{text:'G-99',color:'bg-red-300'}]
    },
    {
        id:3,
        name:'Kapsula I-90 / 2 Person',
        img:'capsule_three.jpg',
        color:'green',
        capsuleName:'Kapsula 999',
        description:'capsule is highly effective for breathing and stuff',
        options: [{text:'R-999',color:'bg-orange-400'},{text:'G-999',color:'bg-red-300'}]
    }
];


function EventForm(props) {

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('client' in fieldValues)
            temp.firstName = fieldValues.client ? "" : "This field is required."
        if ('start' in fieldValues)
            temp.lastName = fieldValues.start ? "" : "This field is required."
        if ('treatment' in fieldValues)
            temp.treatment = fieldValues.treatment ? "" : "This field is required."
        if ('title' in fieldValues)
            temp.city = fieldValues.title ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {values,setValues,errors,setErrors,handleInputChange,resetForm} = useForm(initialValues,true,validate);
    const [clients,setClients] = useState([]);
    const [availableHours,setAvailableHours] = useState([]);
    const [selectedTime,setSelectedTime] = useState(0);
    const [repTreatment,setRepTreatment] = useState(null);
    const [arr, setArr] = useState([]);
    const [checked,setChecked] = useState(false);

    const addInput = () => {
        setArr(s => {
            return [
                ...s,
                {
                    type: "text",
                    label: "Name",
                    value: ""
                }
            ];
        });
    };

    const delInput = (i) => {
        console.log(arr.length)

            const index = arr.indexOf(i);
            if (index > -1) {
                arr.splice(index, 1);
            }
            setArr([...arr]);

    }

    const handleChangeArr = e => {
        e.preventDefault();

        const index = e.target.id;
        setArr(s => {
            const newArr = s.slice();
            newArr[index].value = e.target.value;
            return newArr;
        });
    };


    const getClients=async () => {
        setClients(await getUsers())
    }

    const getEventsOnDate = async (date,capsule,client) => {
        // console.log('Hello : ' + await getEventsOnSpecificDate(date))
        return (await getEventsOnSpecificDate(date,capsule,client))
    }

    const getAvailableHours = async () => {
        const date = (new Date(values.start)).toLocaleDateString();
        const capsule = values.title;
        const client = values.client.split(" ")[0]
        console.log(capsule)
        const appointedSlots = await getEventsOnDate(date,capsule,client);
        const currentTime = (new Date().toLocaleDateString())===(new Date(values.start)).toLocaleDateString() ? new Date().getHours() <7 ? 7 : new Date().getHours() : 7;
        console.log('Current Time : ' + currentTime);
        console.log( (new Date().toLocaleDateString()))
        console.log((new Date(values.start)).toLocaleString())
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

    useEffect(()=>{
        getClients();
    },[0])

    useEffect(()=>{
        getAvailableHours();
    },[values.title,values.start])

    const getColor = (capsule)=> {
        if(capsule==='Kapsula 999') return '#FB923C'
        if(capsule==='Kapsula 99') return '#FEF08A'
        if(capsule==='Kapsula 9') return '#4ADE80'
    }

    async function handleTreatment(e) {

        // const client = clients.find(client => client.phoneNumber === values.client.split(" ")[0]);
        // console.log(client);
        // for (let i = 0; i < client.history.length; i++) {
        //     console.log('hello')
        //     const treatment = await getTreatment(client.history[i])
        //     if (treatment.total!==1 && treatment.total !== treatment.completed) {
        //         setRepTreatment(treatment);
        //         const event = await getEvent(treatment.events[0]);
        //         let time = (new Date(event.start.seconds*1000)).toLocaleTimeString();
        //         time=time.slice(-2)=='PM'?parseInt(time)+12:time;
        //         setSelectedTime(parseInt(time))
        //         console.log('rep event ' + time);
        //         console.log('rep treatment : ' + client.history[i]);
        //         break;
        //     } else {
        //         setRepTreatment(null);
        //     }
        // }

        console.log(clients.find(client => client.phoneNumber === values.client));
        e.preventDefault();
        let c= values.client;
        setValues({...values,client:c.split(' ')})
        const client = clients.find(client => client.phoneNumber === values.client.split(" ")[0]);

        values.otherClients = arr.map(i => i.value);
        values.freeOfCost = checked ? 'yes' : 'no';
        values.clientName = client.firstName + ' ' + client.lastName;
        values.color = getColor(values.title);

        let newTreatment=false;
        if(values.treatment===1) newTreatment=true;

        console.log('client test : ' + values.client)
        values.client = values.client.split(" ")[0]
        if (selectedTime !== 0 && values.title !== "" && values.treatment !== 0 && values.client !== "" && values.start !== "") {
            console.log('here')
            if (!checked && values.employee === '') {
                alert('Some thing is not selected')
            } else {
                console.log(values);
                if (checked) values.color = '#FCA5A5'
                console.log(values)

                values.start = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime)).setMinutes(0)).setSeconds(0));
                values.end = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime==23?23:selectedTime+1)).setMinutes(selectedTime==23?59:0)).setSeconds(0));
                if(newTreatment) {
                    addEvent(values, newTreatment);
                    return
                }
                const events = [];
                for(let i=0 ; i< values.treatment ; i++){
                    if(values.start.getDay()==0) {
                        i--;
                        values.start.setDate(values.start.getDate() + 1)
                    }else {
                        console.log('checking : ' + i)
                        values.start = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime)).setMinutes(0)).setSeconds(0));
                        values.end = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime + 1)).setMinutes(0)).setSeconds(0));
                        const newEvent = structuredClone(values);
                        events.push(newEvent);
                        values.start.setDate(values.start.getDate() + 1)
                    }
                }

                await addMultipleEvents(events,values.client,newTreatment,values.treatment);
                props.openPopup(false);
                window.location.reload()
                // props.addItem(values, resetForm,newTreatment);
            }
        } else {
            console.log('not here' + validate())
            alert('Some thing is not selected')
        }

    }

    const checkNewTreatment = async()=>{
        const client = clients.find(client => client.phoneNumber === values.client.split(" ")[0]);
        console.log(client);
        for (let i = 0; i < client.history.length; i++) {
            console.log('hello')
            const treatment = await getTreatment(client.history[i])
            if (treatment.total!==1 && values.treatment===treatment.total && treatment.total !== treatment.currentRegistered) {
                setRepTreatment(treatment);
                const event = await getEvent(treatment.events[0]);
                let time = (new Date(event.start.seconds*1000)).toLocaleTimeString();
                time=time.slice(-2)=='PM'?parseInt(time)+12:time;
                setSelectedTime(parseInt(time))
                console.log('rep event ' + time);
                console.log('rep treatment : ' + treatment);
                console.log(treatment);
                return treatment;
            } else {
                setRepTreatment(null);
            }
        }
        console.log('rep treatment : ' + repTreatment)
        return null;
    }

    // if treatment selected means new treatment
    // if repeat button pressed means old treatment that is not yet completed

    async function handleSubmit(e) {
        e.preventDefault();
        let c= values.client;
        setValues({...values,client:c.split(' ')})
        const client = clients.find(client => client.phoneNumber === values.client.split(" ")[0]);

        values.otherClients = arr.map(i => i.value);
        values.freeOfCost = checked ? 'yes' : 'no';
        values.clientName = client.firstName + ' ' + client.lastName;
        values.color = getColor(values.title);

        console.log('Testing very much :  '+await checkNewTreatment())
        console.log('Testing not very much : '+repTreatment)
        let newTreatment=false;
        let treatmentCheck = await checkNewTreatment();
        if(values.treatment===1 ) newTreatment=true;
        if(treatmentCheck===null) newTreatment=true;
        console.log('client test : ' + values.client)
        values.repTreatment=treatmentCheck;
        values.client = values.client.split(" ")[0]
        if (selectedTime !== 0 && values.title !== "" && values.treatment !== 0 && values.client !== "" && values.start !== "") {
            console.log('here')
            if (!checked && values.employee === '') {
                alert('Some thing is not selected')
            } else {
                console.log(values);
                if (checked) values.color = '#FCA5A5'
                console.log(values)

                values.start = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime)).setMinutes(0)).setSeconds(0));
                values.end = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime==23?23:selectedTime+1)).setMinutes(selectedTime==23?59:0)).setSeconds(0));
                addEvent(values, newTreatment);
                props.openPopup(false);
                // props.addItem(values, resetForm,newTreatment);
            }
        } else {
            console.log('not here' + validate())
            alert('Some thing is not selected')
        }
    }

    const addEvent=(values,newTreatment)=>{
        props.addItem(values,resetForm,newTreatment)
    }


    useEffect(() => {
        if (props.recordForEdit != null)
            setValues({
                ...props.recordForEdit
            })
    }, [props.recordForEdit])


    const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
        alignItems: 'center',
        justifyContent: 'center',
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
        <Form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">

                <FormControl fullWidth sx={{ minWidth: 120 }} error={!!errors.capsule}>
                    <InputLabel>Capsule</InputLabel>
                    <Select
                        value={values.title}
                        label="Capsule"
                        name="title"
                        onChange={handleInputChange}
                    >

                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {
                            capsules.map(capsule=>{
                                return <MenuItem value={capsule.capsuleName}>{capsule.capsuleName}</MenuItem>
                            })
                        }
                    </Select>
                    <FormHelperText>{errors.capsule}</FormHelperText>
                </FormControl>

                <div className="flex flex-row">
                    <Autocomplete
                        disablePortal
                        name="client"
                        onInputChange={(e,newVal)=>setValues({...values,client:newVal})}
                        inputValue={values.client}
                        fullWidth={true}
                        options={
                            clients.map(client=>{
                                return {label:client.phoneNumber+'  |  '+client.firstName+client.lastName}
                            })
                        }
                        renderInput={(params) => <Input fullWidth {...params} label="Client" />}
                    />
                    {values.title==='Kapsula 9'?<IconButton onClick={addInput}>
                        <AddIcon/>
                    </IconButton>:undefined}
                </div>

                <DesktopDatePicker
                    name="date"
                    label="Date"
                    variant="outlined"
                    minDate={new Date()}
                    inputFormat="DD/MM/YYYY"
                    value={values.start}
                    onChange={(e)=>setValues({...values,'start':e})}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                    error={errors.start}/>

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



                {arr.map((item, i) => {
                    return (
                        <div className="flex flex-row">
                        <Input
                            onChange={handleChangeArr}
                            value={item.value}
                            id={i}
                            fullWidth
                            label={item.label}
                            type={item.type}
                        />
                            <IconButton onClick={()=>delInput(item)}>
                                <CloseIcon/>
                            </IconButton>
                        </div>
                    );
                })}

                <div className="flex items-center">
                    <p className="pb-1">Treatment : </p>
                    <StyledToggleButtonGroup
                        size="small"
                        color="primary"
                        value={values.treatment}
                        exclusive
                        onChange={(event,newValue)=> {
                            setValues({...values, treatment: newValue});
                            setRepTreatment(null);
                        }}
                        aria-label="text alignment"
                    >
                        <ToggleButton value={1}>{1}</ToggleButton>
                        <ToggleButton value={5}>{5}</ToggleButton>
                        <ToggleButton value={10}>{10}</ToggleButton>
                        <ToggleButton value={15}>{15}</ToggleButton>
                        <ToggleButton value={20}>{20}</ToggleButton>
                    </StyledToggleButtonGroup>
                </div>

                {/*{<Button>Repeat</Button>}*/}

                <Input
                    onChange={handleInputChange}
                    value={values.employee}
                    fullWidth
                    label="Employee"
                    name="employee"
                    variant="outlined"
                />


                <FormControlLabel control={<Switch checked={checked} onChange={(e)=>setChecked(e.target.checked)} />} label="Free Of Cost" />

                <Input
                    onChange={handleInputChange}
                    value={values.comment}
                    fullWidth
                    label="Comment"
                    name="comment"
                    variant="outlined"
                />

                {repTreatment?<p>You have done {repTreatment.completed} treatments out of {repTreatment.total}</p>:<></>}

                <div style={{display:'block'}}>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >Submit</button>
                    <button
                        onClick={handleTreatment}
                        className="text-white bg-emerald-600 hover:bg-emerald-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >Repeat</button>
                </div>
            </div>
        </Form>
    );
}

export default EventForm;