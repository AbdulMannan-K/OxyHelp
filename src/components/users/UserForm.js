import {useEffect} from 'react';
import {Form, useForm} from "../controls/useForm";
import {Button, Grid, TextField} from "@mui/material";
import Input from "../controls/Input";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

const initialValues = {
    firstName:'',
    lastName:'',
    phoneNumber:'',
    city:'',
    birthDay:'',
    gender:'',
    email:'',
    questionnaire:[],
    history:[],
}

function UserForm(props) {

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('firstName' in fieldValues)
            temp.firstName = fieldValues.firstName ? "" : "This field is required."
        if ('lastName' in fieldValues)
            temp.lastName = fieldValues.lastName ? "" : "This field is required."
        if ('gender' in fieldValues)
            temp.gender = fieldValues.gender ? "" : "This field is required."
        if ('birthDay' in fieldValues)
            temp.birthDay = fieldValues.birthDay ? "" : "This field is required."
        if ('city' in fieldValues)
            temp.city = fieldValues.city ? "" : "This field is required."
        if ('phoneNumber' in fieldValues)
            temp.phoneNumber = fieldValues.phoneNumber ? "" : "This field is required."
        if ('email' in fieldValues)
            temp.email = fieldValues.email ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {values,setValues,errors,setErrors,handleInputChange,resetForm} = useForm(initialValues,true,validate);

    function handleSubmit(e){
        e.preventDefault();
        if(validate()){
            console.log(values);
            props.addItem(values,resetForm);
            // service.addItem(values);
        }
    }


    useEffect(() => {
        if (props.recordForEdit != null)
            setValues({
                ...props.recordForEdit
            })
    }, [props.recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
            <Input
                name="firstName"
                label="First Name"
                variant="outlined"
                value={values.firstName}
                onChange={handleInputChange}
                error={errors.firstName}/>
            <Input
                name="lastName"
                label="Last Name"
                variant="outlined"
                value={values.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
            />
                <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                <Select
                    value={values.gender}
                    label="Gender"
                    name="gender"
                    onChange={handleInputChange}
                >
                    <MenuItem value='Male'>Male</MenuItem>
                    <MenuItem value='Female'>Female</MenuItem>
                </Select>
                </FormControl>
                <DesktopDatePicker
                    name="birthDay"
                    label="Birth Day"
                    inputFormat="DD/MM/YYYY"
                    variant="outlined"
                    value={new Date(values.birthDay)}
                    onChange={(newVal)=>setValues({...values,birthDay:new Date(newVal).toLocaleDateString()})}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                    error={errors.birthDay}
                 />
                <Input
                    name="phoneNumber"
                    label="Phone Number"
                    variant="outlined"
                    value={values.phoneNumber}
                    onChange={handleInputChange}
                    error={errors.phoneNumber}/>
                <Input
                    name="email"
                    label="Email"
                    variant="outlined"
                    value={values.email}
                    onChange={handleInputChange}
                    error={errors.email}/>
                <Input
                    name="city"
                    label="City"
                    variant="outlined"
                    value={values.city}
                    onChange={handleInputChange}
                    error={errors.city}/>
            <div style={{display:'block'}}>
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    styles={{margin:"5px"}}
                >Submit</Button>
                <Button
                    styles={{margin:"5px"}}
                    onClick={resetForm}>Reset</Button>
            </div>
            </div>
        </Form>
    );
}

export default UserForm;