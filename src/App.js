import './App.css';
import NavBar from "./components/NavBar";
import {CapsuleInfo} from "./components/capsule/CapsuleInfo";
import {WeekScheduler} from "./components/capsule/Calendar";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Users from "./components/users/Users";
import React from "react";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div  className=" min-h-screen dark:bg-gray-800">
                <NavBar></NavBar>
                <Outlet/>
            </div>
        </LocalizationProvider>,
        children:[
            {
                path:"/capsules",
                element: <div className="container flex flex-col gap-4">
                    <CapsuleInfo/>
                    <WeekScheduler/>
                </div>
            },
            {
                path:"/clients",
                element: <div className="container">
                    <Users/>
                </div>
            }
        ]
    },
]);

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
