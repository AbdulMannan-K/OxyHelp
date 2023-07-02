import {useEffect} from 'react';
import {Form, useForm} from "../controls/useForm";
import {Button, Grid, TextField} from "@mui/material";
import Input from "../controls/Input";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import {deleteEmployee} from "../../services/services";
import axios from "axios";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";

const initialValues = {
    serialNumber:0,
    firstName:'',
    secondName:'',
    email:'',
    password:'',
    role:'',
    uid:''
}

function EmployeeForm(props) {

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('firstName' in fieldValues)
            temp.firstName = fieldValues.firstName ? "" : "This field is required."
        if ('secondName' in fieldValues)
            temp.secondName = fieldValues.secondName ? "" : "This field is required."
        if ('email' in fieldValues) {
            temp.email = fieldValues.email ? "" : "This field is required."
        }
        if ('password' in fieldValues)
            temp.password = fieldValues.password.length>8 ? "" : "should be more than 8 chars."
        if ('role' in fieldValues)
            temp.role = fieldValues.role ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {values,setValues,errors,setErrors,handleInputChange,resetForm} = useForm(initialValues,true,validate);

    function handleSubmit(e){
        e.preventDefault();
        const auth = getAuth();

        if(validate()){
            axios.get(`https://api.hunter.io/v2/email-verifier?email=${values.email}&api_key=2bc3901db054f5453dc64dc58ee629d28ee0093c`).then(async res => {
                let valid = (res.data.data.status)
                if (valid === 'valid') {
                    props.addItem(values, resetForm);
                }else{
                    alert('Not a Valid Email')
                }
            } ).catch(err => {
                alert('Some error occured, please try again')
            });
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
                    name="secondName"
                    label="Second Name"
                    variant="outlined"
                    value={values.secondName}
                    onChange={handleInputChange}
                    error={errors.secondName}
                />
                <Input
                    name="email"
                    label="Email"
                    variant="outlined"
                    value={values.email}
                    onChange={handleInputChange}
                    error={errors.email}/>
                <Input
                    name="password"
                    label="password"
                    variant="outlined"
                    value={values.password}
                    onChange={handleInputChange}
                    error={errors.password}/>
                <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={values.role}
                        label="Role"
                        name="role"
                        onChange={handleInputChange}
                    >
                        <MenuItem value='Employee'>Employee</MenuItem>
                        <MenuItem value='Admin'>Admin</MenuItem>
                    </Select>
                </FormControl>
                <br/>
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

export default EmployeeForm;