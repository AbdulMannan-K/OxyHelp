import {Form, useForm} from "./useForm";
import {Button, FormLabel, Grid, RadioGroup, TextField} from "@mui/material";
import Input from "./controls/Input";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import {useEffect, useState} from "react";

function QuestionForm(props){
    const questions=props.questions.questionnaire;
    const [values, setValues] = useState({});

    useEffect(()=>{
        console.log('hello')
        console.log(questions)
    },[0])

    const handleChange = (event,question) => {
        console.log(values)
        setValues({
            ...values,
            [question.question]: event.target.value
        })
        question.answer = (event.target.value);
    };

    return (
        <div>
            <div className="grid grid-cols-2 m-3">
                <p>First Name: {props.questions.firstName}</p>
                <p>Last Name: {props.questions.lastName}</p>
                <p>Gender : {props.questions.gender}</p>
                <p>Date Of Birth: {props.questions.birthDay}</p>
                <p>Email: {props.questions.email}</p>
                <p>Phone Number: {props.questions.phoneNumber}</p>
            </div>
            <hr/>
        {
            questions.map(question=>{
                return <div>
                    <p>{question.question}</p>
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            row
                            // value={values.}
                            onChange={e=>handleChange(e,question)}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </div>
            })
        }
            <Button
                type="submit"
                onClick={()=> {
                    props.handleSubmit(props.questions)
                }}
                styles={{margin:"5px"}}
            >Submit</Button>
        </div>
    )

}

export default QuestionForm;