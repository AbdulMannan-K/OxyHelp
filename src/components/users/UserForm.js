import {useEffect} from 'react';
import {Form, useForm} from "./useForm";
import {Button, Grid, TextField} from "@mui/material";
import Input from "./controls/Input";

const initialValues = {
    firstName:'',
    lastName:'',
    phoneNumber:'',
    city:'',
    birthDay:'',
    gender:'',
    email:'',
    questionnaire:[
        {question:'Are you alright ?', answer:'yes'},
        {question:'Are you fine ?', answer:'yes'}
    ],
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
                <Input
                    name="gender"
                    label="Gender"
                    variant="outlined"
                    value={values.gender}
                    onChange={handleInputChange}
                    error={errors.gender}
                />
                <Input
                    name="birthDay"
                    label="Birth Day"
                    variant="outlined"
                    value={values.birthDay}
                    onChange={handleInputChange}
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