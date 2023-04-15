import {Form, useForm} from "../controls/useForm";
import Input from "../controls/Input";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {getEmp} from "../../services/services";


const initialValues = {
    email:'',
    password:'',
}

function Login(props) {

    const auth = getAuth();
    const navigate = useNavigate();

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('email' in fieldValues)
            temp.email = fieldValues.email ? "" : "This field is required."
        if ('password' in fieldValues)
            temp.password = fieldValues.password ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {values,setValues,errors,setErrors,handleInputChange,resetForm} = useForm(initialValues,true,validate);

    async function handleSubmit() {

        await signInWithEmailAndPassword(auth,values.email,values.password).then(async(response)=>{
            const user = await getEmp(values.email)
            localStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
            localStorage.setItem('Role', user.role)
            localStorage.setItem('employee', (user.firstName + ' ' + user.secondName))
            navigate('/capsules');
        }).catch(err=>{
            console.log(err);
            alert('Wrong Login Details, Please Enter again')
        })

    }

    const keypress = (e) => {
        if(e.keyCode === 13){
            handleSubmit();
        }
    }
    // className="flex flex-col gap-4 w-1/3 h-1/1 justify-center align-middle"
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
            />
            <Input
                onChange={handleInputChange}
                value={values.password}
                fullWidth
                label="Password"
                name="password"
                variant="outlined"
                type="password"
                onKeyDown={keypress}
            />
            <p className="cursor-pointer" onClick={()=>navigate('/signup')}>don't have an account? signup</p>
            <button
                type="submit"
                onClick={handleSubmit}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >Submit</button>
        </div>
    );
}

export default Login;