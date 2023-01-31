import './App.css';
import NavBar from "./components/NavBar";
import {CapsuleInfo} from "./components/capsule/CapsuleInfo";
import {WeekScheduler} from "./components/capsule/Calendar";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
function CapsuleComponent() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div  className=" min-h-screen dark:bg-gray-800">
                <NavBar></NavBar>
                <div className="container flex flex-col gap-4">
                    <CapsuleInfo/>
                    <WeekScheduler/>
                </div>
            </div>
        </LocalizationProvider>
    );
}

export default CapsuleComponent;
