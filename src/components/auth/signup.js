import {Form, useForm} from "../controls/useForm";
import Input from "../controls/Input";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import {signUp} from "../../services/services";


const initialValues = {
    email:'',
    password:'',
    role:'',
}

function Signup(props) {

    const auth = getAuth();
    const navigate = useNavigate();

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('email' in fieldValues)
            temp.email = fieldValues.email ? "" : "This field is required."
        if ('password' in fieldValues)
            temp.password = fieldValues.password.length>6 ? "" : "Password should be great then 6 digits"
        if ('role' in fieldValues)
            temp.role = fieldValues.role!=="" ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {values,setValues,errors,setErrors,handleInputChange,resetForm} = useForm(initialValues,true,validate);

    async function handleSubmit() {
        if(errors.email || errors.password || errors.role){
            alert('Please fill all the fields correctly')
        }
        else {
            await createUserWithEmailAndPassword(auth, values.email, values.password).then(async (response) => {
                await signUp(values)
                navigate('/login');
            }).catch(err => {
                alert('User already exists')
                console.log(err);
            })
        }
    }
    return (
        <div  style={
            {
                display:'flex',
                flexDirection:'column',
                gap:'20px',
                width:'40%',
                height:'80vh',
                justifyContent:'center',
                alignItems:'center',
            }
        }>
            <Input
                onChange={handleInputChange}
                value={values.email}
                fullWidth
                label="Email"
                name="email"
                variant="outlined"
                error={errors.email}
            />
            <Input
                onChange={handleInputChange}
                value={values.password}
                fullWidth
                label="Password"
                name="password"
                variant="outlined"
                type="password"
                error={errors.password}
            />
            <FormControl fullWidth sx={{ minWidth: 120 }} error={!!errors.role}>
                <InputLabel>Role</InputLabel>
                <Select
                    value={values.role}
                    label="Role"
                    name="role"
                    defaultValue={""}
                    onChange={handleInputChange}
                >
                    <MenuItem value="Employee">Employee</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                </Select>
                <FormHelperText>{errors.capsule}</FormHelperText>
            </FormControl>
            <button
                type="submit"
                onClick={handleSubmit}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >Submit</button>
        </div>
    );
}

export default Signup;