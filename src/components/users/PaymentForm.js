import {useEffect} from 'react';
import {Form, useForm} from "../controls/useForm";
import {Autocomplete, Button, Grid, TextField} from "@mui/material";
import Input from "../controls/Input";

const initialValues = {
    billNumber: '',
    description: '',
    price: '',
}

function PaymentForm(props) {

    const validate = (fieldValues = values) => {
        let temp = {...errors}
        if ('billNumber' in fieldValues)
            temp.firstName = fieldValues.firstName ? "" : "This field is required."
        if ('description' in fieldValues)
            temp.lastName = fieldValues.lastName ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {values, setValues, errors, setErrors, handleInputChange, resetForm} = useForm(initialValues, true, validate);

    function handleSubmit(e) {
        e.preventDefault();
        if (validate()) {
            props.addItem(values);
            // service.addItem(values);
        }
    }

    const descriptionList = [
        {label: 'I - 90 - 1 - SE', price: '60'},
        {label: 'I - 90 - 5 - SE', price: '250'},
        {label: 'I - 90 - 10 - SE', price: '350'},
        {label: 'I - 90 - 15 - SE', price: '500'},
        {label: 'I - 90 - 20 - SE', price: '650'},
        {label: 'C3 - 1 - 1 - SE', price: '100'},
        {label: 'C3 - 1 - 2 - SE', price: '150'},
        {label: 'C3 - 1 - 3 - SE', price: '180'},
        {label: 'C3 - 1 - 4 - SE', price: '200'},
        {label: 'C3 - 5 - 1 - SE', price: '400'},
        {label: 'C3 - 5 - 2 - SE', price: '600'},
        {label: 'C3 - 5 - 3 - SE', price: '700'},
        {label: 'C3 - 5 - 4 - SE', price: '800'},
        {label: 'C3 - 10 - 1 - SE', price: '700'},
        {label: 'C3 - 10 - 2 - SE', price: '900'},
        {label: 'C3 - 10 - 3 - SE', price: '1000'},
        {label: 'C3 - 10 - 4 - SE', price: '1100'},
        {label: 'C3 - 15 - 1 - SE', price: '1000'},
        {label: 'C3 - 15 - 2 - SE', price: '1300'},
        {label: 'C3 - 15 - 3 - SE', price: '1400'},
        {label: 'C3 - 15 - 4 - SE', price: '1500'},
        {label: 'C3 - 20 - 1 - SE', price: '1300'},
        {label: 'C3 - 20 - 2 - SE', price: '1500'},
        {label: 'C3 - 20 - 3 - SE', price: '1700'},
        {label: 'C3 - 20 - 4 - SE', price: '1800'},
        {label: 'oxykriprosmarine', price: '24.90'},
        {label: 'Robot', price: '10'},
        {label: 'roboteye', price: '15'},
        {label: 'eye', price: '5'},

    ]

    const getPrice = (newval)=>{
        const desc = (descriptionList.find(desc=>desc.label===newval));
        if(desc!=undefined) return desc.price;
        else return '0'
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
                    name="billNumber"
                    label="Bill Number"
                    variant="outlined"
                    value={values.billNumber}
                    onChange={handleInputChange}
                    error={errors.billNumber}/>
                <Input
                    name="firstName"
                    label="First Name"
                    variant="outlined"
                    value={props.recordForEdit.firstName}
                    disabled
                />
                <Input
                    name="lastName"
                    label="Last Name"
                    variant="outlined"
                    value={props.recordForEdit.lastName}
                    disabled
                />
                <Input
                    name="phoneNumber"
                    label="Phone Number"
                    variant="outlined"
                    value={props.recordForEdit.phoneNumber}
                    disabled
                />
                <Autocomplete
                    disablePortal
                    name="description"
                    onInputChange={(e,newVal)=>setValues({...values,description:newVal,price:getPrice(newVal)})}
                    inputValue={values.description}
                    fullWidth={true}
                    options={
                        descriptionList.map(desc=>{
                            return {label:desc.label}
                        })
                    }
                    renderInput={(params) => <Input fullWidth {...params} label="Description" />}
                />

                <Input
                    name="value"
                    label="Value"
                    variant="outlined"
                    value={values.price}
                    disabled
                />
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    styles={{margin:"5px"}}
                >Pay</Button>
            </div>
        </Form>
    );
}

export default PaymentForm;