import {useEffect, useState} from 'react';
import {Form, useForm} from "../controls/useForm";
import {Button, Grid, Switch, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import Input from "../controls/Input";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import {addEvent, getEventsOnSpecificDate, getUsers} from "../../services/services";
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
    end:'',
    color:'',
    title:'',
    employee:'',
    freeOfCost:'no',
    treatment:1,
}

const capsules = [
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


function EventForm(props) {

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('client' in fieldValues)
            temp.firstName = fieldValues.client ? "" : "This field is required."
        if ('start' in fieldValues)
            temp.lastName = fieldValues.start ? "" : "This field is required."
        if ('treatment' in fieldValues)
            temp.treatment = fieldValues.treatment ? "" : "This field is required."
        if ('employee' in fieldValues)
            temp.employee = fieldValues.employee ? "" : "This field is required."
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
                console.log('here')
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
        console.log('Appointed Slots')
        console.log(appointedSlots)
        let freeSlots = [];
        for (let i = 7; i < 24; i++) {
            for(let j=0 ; j < appointedSlots.length ;j++){
                console.log((appointedSlots[j].split(':'))[0])
                if((appointedSlots[j].split(':'))[0]!=i){
                    freeSlots.push(i);
                }
            }
        }

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
        if(capsule==='Kapsula I-90 / 2 Person') return 'orange'
        if(capsule==='Kapsula I-90 / 1 Person') return 'yellow'
        if(capsule==='Kapsula C3 / Pesona') return 'green'
    }

    function handleSubmit(e){
        e.preventDefault();
        values.otherClients = arr.map(i=>i.value);
        values.freeOfCost = checked?'yes':'no';
        values.start = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime)).setMinutes(0)).setSeconds(0));
        values.end = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime+1)).setMinutes(0)).setSeconds(0));
        values.color=getColor(values.title);
        if(validate()){
            console.log(values);
            props.addItem(values,resetForm);
        }else{
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
                        value={values.capsule}
                        label="Capsule"
                        name="title"
                        onChange={handleInputChange}
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
                    <FormHelperText>{errors.capsule}</FormHelperText>
                </FormControl>

                <DesktopDatePicker
                    name="date"
                    label="Date"
                    variant="outlined"
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

                <div className="">
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
                </div >

                <div className="flex flex-row">
                    <FormControl fullWidth sx={{ minWidth: 120 }} error={!!errors.client}>
                        <InputLabel>Client</InputLabel>
                        <Select
                            value={values.client}
                            label="Client"
                            name="client"
                            onChange={handleInputChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                clients.map(client=>{
                                    return <MenuItem value={client.phoneNumber}>{client.phoneNumber}</MenuItem>
                                })
                            }
                        </Select>
                        <FormHelperText>{errors.client}</FormHelperText>
                    </FormControl>
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

                <Input
                    onChange={handleInputChange}
                    value={values.treatment}
                    fullWidth
                    label="Treatment"
                    type="number"
                    name="treatment"
                    variant="outlined"
                />

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