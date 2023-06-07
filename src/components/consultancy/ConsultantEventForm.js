import {useEffect, useState} from 'react';
import {Form, useForm} from "../controls/useForm";
import {Autocomplete, Switch, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import Input from "../controls/Input";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import {
    addConsultantEvent,
    getAllEmployees, getConsultantEventsOnSpecificDate,
    getUsers
} from "../../services/services";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import {styled} from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useNavigate} from "react-router-dom";

const initialValues = {
    client:'',
    otherClients:[],
    start:new Date(),
    clientInfo:{},
    end:'',
    // color:'',
    title:'',
    status:'Reserved',
    clientName:'',
    employee:'',
    freeOfCost:'no',
    deletable:true,
    comment:'',
}

function ConsultantEventForm(props) {

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
    const [availableHours,setAvailableHours] = useState([]);
    const [selectedTime,setSelectedTime] = useState(0);
    const [employees,setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect( () => {
        getAllEmployees(setEmployees)
        setValues({...values,employee:localStorage.getItem('employee')})
    },[0])

    const getEventsOnDate = async (date) => {
        return (await getConsultantEventsOnSpecificDate(date))
    }

    const getAvailableHours = async () => {
        const date = (new Date(values.start)).toLocaleDateString();
        const appointedSlots = await getEventsOnDate(date);
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

    async function handleSubmit(e) {
        e.preventDefault();

        if(values.client=='' ) {
            alert('Please select a client')
            return;
        }
        props.triggerLoading(true);

        let c= values.client;
        setValues({...values,client:c.split(' ')})

        values.client = values.client.split(" ")[0]

        values.title = values.client
        if (selectedTime !== 0 && values.title !== "" && values.client !== "" && values.start !== "") {

                values.start = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime)).setMinutes(0)).setSeconds(0));
                values.end = new Date(new Date(new Date((new Date(values.start)).setHours(selectedTime==23?23:selectedTime+1)).setMinutes(selectedTime==23?59:0)).setSeconds(0));
                addEvent(values);
                props.openPopup(false);
                props.triggerLoading(false);
        } else {
            alert('Some thing is not selected')
        }
    }

    const addEvent=(values)=>{
        props.addItem(values,resetForm)
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
                <Input
                    onChange={handleInputChange}
                    value={values.clientName}
                    fullWidth
                    label="Client Name"
                    name="clientName"
                    variant="outlined"
                    error={errors.clientName}
                />
                <Input
                    onChange={handleInputChange}
                    value={values.client}
                    fullWidth
                    label="Client Phone"
                    name="client"
                    variant="outlined"
                    error={errors.client}
                />

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

                <Input
                    onChange={handleInputChange}
                    value={values.comment}
                    fullWidth
                    label="Comment"
                    name="comment"
                    variant="outlined"
                />

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

export default ConsultantEventForm;