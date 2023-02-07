import {useEffect, useState} from 'react';
import {Form, useForm} from "../controls/useForm";
import {Autocomplete, Button, Grid, Switch, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import Input from "../controls/Input";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import {addEvent, getEvents, getEventsOnSpecificDate, getUsers} from "../../services/services";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import {styled} from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FormControlLabel from "@mui/material/FormControlLabel";

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
    deletable:true,
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

    const getEventsOnDate = async (date,capsule) => {
        // console.log('Hello : ' + await getEventsOnSpecificDate(date))
        return (await getEventsOnSpecificDate(date,capsule))
    }

    const getAvailableHours = async () => {
        const date = (new Date(values.start)).toLocaleDateString();
        const capsule = values.title;
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

    function handleSubmit(e){
        console.log(clients.find(client=>client.phoneNumber===values.client));
        e.preventDefault();
        values.otherClients = arr.map(i=>i.value);
        values.freeOfCost = checked?'yes':'no';
        values.start = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime)).setMinutes(0)).setSeconds(0));
        values.end = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime+1)).setMinutes(0)).setSeconds(0));
        const client = clients.find(client => client.phoneNumber === values.client);
        values.clientName = client.firstName+' '+client.lastName ;
        values.color=getColor(values.title);
        console.log('client test : ' + values.client)
        if(selectedTime!==0 && values.title!=="" && values.treatment!==0 && values.client!=="" && values.start!==""){
            console.log('here')
            if(!checked && values.employee==='') {
                alert('Some thing is not selected')
            }else {
                console.log(values);
                if(checked) values.color='#FCA5A5'
                console.log(values)
                props.addItem(values, resetForm);
            }
        }else{
            console.log('not here' + validate())
            alert('Some thing is not selected')
        }
    }


    useEffect(() => {
        if (props.recordForEdit != null)
            setValues({
                ...props.recordForEdit
            })
    }, [props.recordForEdit])


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

                <DesktopDatePicker
                    name="date"
                    label="Date"
                    variant="outlined"
                    inputFormat="DD/MM/YYYY"
                    value={values.start}
                    onChange={(e)=>setValues({...values,'start':e})}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                    error={errors.start}/>

                {/*<div className="m-2">*/}
                {/*    {*/}
                {/*    availableHours.map(ah=>*/}
                {/*        <span className="text-xs m-1 font-semibold inline-block uppercase rounded text-zinc-600 bg-zinc-200 uppercase last:mr-0 mr-1">*/}
                {/*            <Button value={ah} color="primary" onClick={(e)=>setSelectedTime(e.target.value)}>*/}
                {/*            {ah}*/}
                {/*            </Button>*/}
                {/*        </span>*/}
                {/*        )*/}
                {/*    }*/}
                {/*</div>*/}

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

                <div className="flex flex-row">
                    <Autocomplete
                        disablePortal
                        name="client"
                        onInputChange={(e,newVal)=>setValues({...values,client:newVal})}
                        inputValue={values.client}
                        fullWidth={true}
                        options={
                            clients.map(client=>{
                                return {label:client.phoneNumber}
                            })
                        }
                        renderInput={(params) => <Input fullWidth {...params} label="Client" />}
                    />
                    <IconButton onClick={addInput}>
                        <AddIcon/>
                    </IconButton>
                </div>



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
                        onChange={(event,newValue)=>setValues({...values,treatment:newValue})}
                        aria-label="text alignment"
                    >
                        <ToggleButton value={1}>{1}</ToggleButton>
                        <ToggleButton value={5}>{5}</ToggleButton>
                        <ToggleButton value={10}>{10}</ToggleButton>
                        <ToggleButton value={15}>{15}</ToggleButton>
                        <ToggleButton value={20}>{20}</ToggleButton>
                    </StyledToggleButtonGroup>
                </div>

                <Input
                    onChange={handleInputChange}
                    value={values.employee}
                    fullWidth
                    label="Employee"
                    name="employee"
                    variant="outlined"
                />


                <FormControlLabel control={<Switch checked={checked} onChange={(e)=>setChecked(e.target.checked)} />} label="Free Of Cost" />


                <div style={{display:'block'}}>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        styles={{margin:"5px"}}
                    >Submit</Button>
                </div>
            </div>
        </Form>
    );
}

export default EventForm;