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
    questionnaire:[
        { question:'Infeksione të rrugëve të sipërme të frymëmarrjes (laringjit, sinusit, bronkit)', answer:'yes'},

            { question:'Hipertensioni i pakontrolluar', answer:'yes'},

                { question:'Emfizemë me mbajtje të CO2', answer:'yes'},

                    { question:'Temperaturë e lartë e pakontrolluar e trupit', answer:'yes'},

                    { question:'Cista ose bulla në mushkëri të dukshme në RTG të thjeshtë ose CT', answer:'yes'},

                        { question:'Prania e një pompe epidurale për kontrollin e dhimbjes', answer:'yes'},

                            { question:'Rinit alergjik', answer:'yes'},

                                { question:'Prania e një stimuluesi kardiak', answer:'yes'},

                                    { question:'Sëmundja kronike obstruktive pulmonare (COPD)', answer:'yes'},

                                        { question:'Infarkt', answer:'yes'},

                                            { question:'Operacionet e kaluara në krahëror', answer:'yes'},

                                                { question:'Shtatzënia', answer:'yes'},

                                                    { question:'Operacionet e kaluara ORL (hundë, gojë, fyt)', answer:'yes'},

                                                        { question:'Rritja e tumorit', answer:'yes'},

                                                            { question:'Epilepsi', answer:'yes'},

                                                                { question:'Sferocitoza kongjenitale', answer:'yes'},

                                                                    { question:'Neuriti optik', answer:'yes'},

                                                                        { question:'Çrregullime të ritmit të zemrës', answer:'yes'},

                                                                            { question:'Astma e pakontrolluar dhe/ose e kontrolluar', answer:'yes'},

                                                                                { question:'Angina (dhimbje në zonën e zemrës)', answer:'yes'},

                                                                                    { question:'Klaustrofobia', answer:'yes'},

                                                                                        { question:'Alergji ndaj të ftohtit', answer:'yes'},

                                                                                            { question:'Tromboza venoze ose sëmundjet kardiovaskulare', answer:'yes'},

                                                                                                { question:'Hipotireoidizëm', answer:'yes'},

                                                                                                    { question:'Polineuropatia', answer:'yes'},
                                                                                                        { question:'Dëshironi të trajtoni ndonjë nga indikacionet e listuara?', answer:'yes'},
                                                                                                            { question:'Pasojat e tronditjes ose dëmtimit të lehtë traumatik të trurit', answer:'yes'},

                                                                                                                { question:'Psoriasis dhe dermatiti, dermatiti atopik, artriti dhe gjendje të ngjashme', answer:'yes'},

                                                                                                                    { question:'Iskemia e sklerës', answer:'yes'},

                                                                                                                        { question:'Sindromi i djegies', answer:'yes'},

                                                                                                                            { question:'Pagjumësi', answer:'yes'},

                                                                                                                                { question:'Goditje në tru', answer:'yes'},

                                                                                                                                    { question:'Depresioni', answer:'yes'},

                                                                                                                                        { question:'Mirëqenien e përgjithshme', answer:'yes'},

                                                                                                                                            { question:'Presioni i lartë i gjakut (> 160/100 mm)', answer:'yes'},

                                                                                                                                                { question:'Infarkt miokardi më pak se gjashtë muaj më parë (sulmi në zemër)', answer:'yes'},

                                                                                                                                                    { question:'Sindroma e Raynaud', answer:'yes'},

                                                                                                                                                        { question:'Iskemia e sklerës', answer:'yes'},

                                                                                                                                                            { question:'Infeksion akut respirator', answer:'yes'},

                                                                                                                                                                { question:'Infeksion akut të lëkurës, viral ose bakterial', answer:'yes'},

                                                                                                                                                                    { question:'Shtatzënia', answer:'yes'},

                                                                                                                                                                        { question:'Sëmundjet e traktit urinar', answer:'yes'},

                                                                                                                                                                            { question:'Menstruacionet', answer:'yes'},

                                                                                                                                                                                { question:'Temperatura e ngritur e trupit', answer:'yes'},

                                                                                                                                                                                    { question:'Implantet e trupit', answer:'yes'},

                                                                                                                                                                                        { question:'Tuberkulozi, formacionet malinje ose shërimi akut nga infeksioni', answer:'yes'},

                                                                                                                                                                                            { question:'Anemi e rëndë', answer:'yes'},

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