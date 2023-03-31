import './App.css';
import NavBar from "./components/NavBar";
import {CapsuleInfo} from "./components/capsule/CapsuleInfo";
import {WeekScheduler} from "./components/capsule/Calendar";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Users from "./components/users/Users";
import React from "react";
import {createTheme, ThemeProvider} from "@mui/material";
import Employees from "./components/employees/employees";
import Login from "./components/auth/login"
import Signup from "./components/auth/signup";

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
            },
            {
                path:"/employees",
                element: <div className="container">
                    <Employees/>
                </div>
            },
            {
                path:"/login",
                element: <div className="container flex justify-center align-middle ">
                    <Login/>
                </div>
            },
            {
                path:"/signup",
                element: <div className="container flex justify-center align-middle ">
                    <Signup/>
                </div>
            }
        ]
    },
]);

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const theme = createTheme({
    palette: {
        anger: createColor('#F40B27'),
        apple: createColor('#5DBA40'),
        steelBlue: createColor('#5C76B7'),
        violet: createColor('#BC00A3'),
    },
});

function App() {
  return (
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
  );
}

export default App;
