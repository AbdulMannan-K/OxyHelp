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
    getAllEmployees,
    getEmployees,
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
import {useNavigate} from "react-router-dom";

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
    meter:0,
    deletable:true,
    comment:'',
    clientId:'',
    treatmentId:'',
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
    const [meter,setMeter] = useState(0);
    const [arr, setArr] = useState([]);
    const [checked,setChecked] = useState(false);
    const [employees,setEmployees] = useState([]);
    const navigate = useNavigate();

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

            const index = arr.indexOf(i);
            if (index > -1) {
                arr.splice(index, 1);
            }
            setArr([...arr]);

    }

    const handleChangeArr = (e,i,newVal) => {
        e.preventDefault();
        const index = i;
        setArr(s => {
            const newArr = s.slice();
            newArr[index].value = newVal;
            return newArr;
        });
    };


    useEffect( () => {
        getAllEmployees(setEmployees)
        setValues({...values,employee:localStorage.getItem('employee')})
    },[0])

    const getClients=async () => {
        setClients(await getUsers())
    }

    const getEventsOnDate = async (date,capsule,client) => {
        return (await getEventsOnSpecificDate(date,capsule,client))
    }

    const getAvailableHours = async () => {
        const date = (new Date(values.start)).toLocaleDateString();
        const capsule = values.title;
        const client = values.client.split(" ")[0]
        const appointedSlots = await getEventsOnDate(date,capsule,client);
        console.log(appointedSlots)
        const currentTime = (new Date().toLocaleDateString())===(new Date(values.start)).toLocaleDateString() ? new Date().getHours() <7 ? 7 : new Date().getHours() : 7;
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

    useEffect(()=>{
        getClients();
    },[0])

    const getColor = (capsule)=> {
        if(capsule==='Kapsula 999') return '#FB923C'
        if(capsule==='Kapsula 99') return '#FEF08A'
        if(capsule==='Kapsula 9') return '#4ADE80'
    }

    async function handleSubmit(e) {
        e.preventDefault();

        console.log(meter)

        if(values.client=='') {
            alert('Please select a client')
            return;
        }
        props.triggerLoading(true);

        let c= values.client;
        setValues({...values,client:c.split(' ')})
        const client = clients.find(client => client.phoneNumber === values.client.split(" ")[0]);
        values.clientId = client._id;
        values.otherClients = arr.map(i => i.value);
        values.freeOfCost = checked ? 'yes' : 'no';
        values.clientName = client.firstName + ' ' + client.lastName;
        values.color = getColor(values.title);
        values.meter = meter;

        let newTreatment=false;
        if(values.treatment===1) newTreatment=true;
        values.clientId = client._id;
        values.client = values.client.split(" ")[0]

        if (selectedTime !== 0 && values.title !== "" && values.treatment !== 0 && values.client !== "" && values.start !== "") {
            if (!checked && values.employee === '') {
                alert('Some thing is not selected')
            } else {
                if (checked) values.color = '#FCA5A5'

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
                        values.start = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime)).setMinutes(0)).setSeconds(0));
                        values.end = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime==23?23:selectedTime+1)).setMinutes(selectedTime==23?59:0)).setSeconds(0));
                        const newEvent = structuredClone(values);
                        events.push(newEvent);
                        values.start.setDate(values.start.getDate() + 1)
                    }
                }

                let addedEvents = await addMultipleEvents(events,values.clientId,newTreatment,values.treatment);
                props.openPopup(false);
                props.setEvents([...props.events,...addedEvents]);
                props.triggerLoading(false);

            }
        } else {
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

    const keypress = (e) => {
        if (e.keyCode === 13) {
            getAvailableHours();
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">

                <FormControl fullWidth sx={{ minWidth: 120 }} error={!!errors.capsule}>
                    <InputLabel>Capsule</InputLabel>
                    <Select
                        onKeyDown={keypress}
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
                        onKeyDown={keypress}
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
                    {values.title==='Kapsula 9' && arr.length<3?<IconButton onClick={addInput}>
                        <AddIcon/>
                    </IconButton>:undefined}
                </div>

                {arr.map((item, i) => {
                    return (
                        <div className="flex flex-row">
                            <Autocomplete
                            onKeyDown={keypress}
                            id={i}
                            disablePortal
                            name={item.label}
                            onInputChange={(e,newVal)=>handleChangeArr(e,i,newVal)}
                            inputValue={item.value}
                            fullWidth={true}
                            options={
                            clients.map(client=>{
                                return {label:client.phoneNumber+'  |  '+client.firstName+client.lastName}
                            })
                            }
                            renderInput={(params) => <Input fullWidth {...params} label="Client" />}
                            />
                            <IconButton onClick={()=>delInput(item)}>
                                <CloseIcon/>
                            </IconButton>
                        </div>
                    );
                })}

                <DesktopDatePicker
                    name="date"
                    label="Date"
                    variant="outlined"
                    // minDate={new Date()}
                    inputFormat="DD/MM/YYYY"
                    value={values.start}
                    onChange={(e)=>setValues({...values,'start':e})}
                    renderInput={(params) => <TextField onKeyDown={keypress} fullWidth {...params} />}
                    error={errors.start}/>

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={getAvailableHours}>Get Time</button>

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

                <div className="flex items-center">
                    <p className="pb-1">Meter : </p>
                    <StyledToggleButtonGroup
                        size="small"
                        color="primary"
                        value={meter}
                        exclusive
                        onChange={(event,newValue)=> {
                            setMeter(newValue);
                        }}
                        aria-label="text alignment"
                    >
                        <ToggleButton value={1}>{1}</ToggleButton>
                        <ToggleButton value={2}>{2}</ToggleButton>
                        <ToggleButton value={3}>{3}</ToggleButton>
                        <ToggleButton value={4}>{4}</ToggleButton>
                        <ToggleButton value={5}>{5}</ToggleButton>
                        <ToggleButton value={6}>{6}</ToggleButton>
                        <ToggleButton value={7}>{7}</ToggleButton>
                        <ToggleButton value={8}>{8}</ToggleButton>
                        <ToggleButton value={9}>{9}</ToggleButton>
                        <ToggleButton value={10}>{10}</ToggleButton>
                    </StyledToggleButtonGroup>
                </div>

                {/*{<Button>Repeat</Button>}*/}

                <FormControl fullWidth sx={{ minWidth: 120 }} error={!!errors.employee}>
                    <InputLabel>Employee</InputLabel>
                    <Select
                        value={values.employee}
                        label="Employee"
                        name="employee"
                        disabled
                        onChange={handleInputChange}
                    >
                        {
                            employees.map(employee=>{
                                return <MenuItem value={employee.firstName+' '+employee.secondName}>{employee.firstName+' '+employee.secondName}</MenuItem>
                            })
                        }
                    </Select>
                    <FormHelperText>{errors.capsule}</FormHelperText>
                </FormControl>

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
                        type="button"
                        onClick={()=>navigate('/clients')}
                        className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                    >Add Client</button>
                </div>
            </div>
        </Form>
    );
}

export default EventForm;