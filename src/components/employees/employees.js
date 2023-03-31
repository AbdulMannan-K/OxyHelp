import React, {useCallback, useEffect, useState} from 'react'
import {
    Paper,
    TableBody,
    TableCell,
    InputAdornment,
    Typography, Input, Button, TableRow, Slide
} from '@mui/material';
import { Search } from "@mui/icons-material";
import useTable from "../users/useTable";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {getEmployees} from "../../services/services";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import DateRangePicker from "react-bootstrap-daterangepicker";
import 'bootstrap-daterangepicker/daterangepicker.css';
import {getAuth} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";

const styles = {
    pageContent: {
        margin: (theme)=> theme.spacing(5),
        padding: (theme)=> theme.spacing(3)
    },
    searchInput: {
    },
    toolBar: {
        display: "flex",
        alignItems: "center",
        justifyContent:"space-between",
    },
    searchToggle: {
        display: 'flex' ,
        gap: 10,
        alignItems: "center",
    }
}

const headCells = [
    { id: 'sr', label:'Sr.'},
    { id: 'name', label: 'Name' },
    { id: 'title', label: 'Title' },
    { id: 'date', label: 'Date'},
    { id: 'startTime', label: 'Start Time' },
    { id: 'endTime', label: 'End Time' },
    { id: 'status', label: 'Status' },
]

export default function Employees() {
    const classes = styles;
    const [employee,setEmployee] = useState(null);
    const [recordForEdit, setRecordForEdit] = useState([])
    const [total,setTotal] = useState(0);
    const [completed,setCompleted] = useState(0)
    const [records, setRecords] = useState([])
    const [uniqueEmployees, setUniqueEmployees] = useState([]);
    const auth = getAuth();
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const [filterFn, setFilterFn] = useState({
        fn: users => {
            return users;
        }
    })

    let index=1;


    useEffect(() => {
        console.log('here')
        const user = localStorage.getItem('Auth Token');
        if (!user) navigate("/login");
    }, [0]);

    useEffect(()=>{
        getEmployees(setRecords)
    },[0])

    useEffect(()=>{
        setUniqueEmployees([...new Set(records.map(record=>record.employee))])
    },[records])

    // useEffect(()=>{
    //     setRecordForEdit(records.filter(record=>record.employee===employee))
    // },employee)
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(recordForEdit, headCells, filterFn);

    return (
        <>
            <Paper sx={classes.pageContent}>
                <div style={classes.toolBar}>
                    <Typography variant="h4" noWrap  component="div">
                        Users
                    </Typography>
                    <div style={classes.searchToggle}>
                        <FormControl variant="outlined" size="small" sx={{minWidth:200}}>
                            <InputLabel id="employee">Employee</InputLabel>
                            <Select
                                id="employee"
                                value={employee}
                                label="Employee"
                                onChange={e=> {
                                    setEmployee(e.target.value);
                                    let t=0;
                                    let c=0;
                                    if(e.target.value!=='None') {
                                        records.forEach(record => {
                                            if (record.employee === e.target.value) {
                                                t++;
                                                if (record.status === 'Completed') c++;
                                            }
                                        })
                                        setTotal(t);
                                        setCompleted(c)
                                        setRecordForEdit(records.filter(record => record.employee === e.target.value))
                                    }else{
                                        records.forEach(record => {
                                            t++;
                                            if (record.status === 'Completed') c++;
                                        })
                                        setTotal(t);
                                        setCompleted(c)
                                        setRecordForEdit(records)
                                    }
                                }}
                            >
                                <MenuItem value={'None'}>None</MenuItem>
                                {
                                    uniqueEmployees.map(record=>{
                                        return <MenuItem value={record}>{record}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <DateRangePicker initialSettings={{
                            locale: {
                                format: 'DD/MM/YYYY'
                            }
                        }} onCallback={(start,end,label)=>{
                            console.log(new Date(start).toLocaleDateString());
                            console.log(end);
                            records.forEach(record=>console.log(record.start));
                            setRecordForEdit(records.filter(record => new Date(record.start.seconds*1000).getTime()>new Date(start).getTime() && new Date(record.start.seconds*1000).getTime()<new Date(end).getTime()))
                        }
                        }>
                                <input type="text"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        </DateRangePicker>
                    </div>
                </div>
                <TblContainer>
                    <TblHead/>
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(record =>
                                (<TableRow key={record.employee}>
                                    <TableCell>{index++}</TableCell>
                                    <TableCell>{record.employee}</TableCell>
                                    <TableCell>{record.title}</TableCell>
                                    <TableCell>{new Date(record.start.seconds*1000).toLocaleDateString("en-GB")}</TableCell>
                                    <TableCell>{new Date(record.start.seconds*1000).toLocaleTimeString("en-GB")}</TableCell>
                                    <TableCell>{new Date(record.end.seconds*1000).toLocaleTimeString("en-GB")}</TableCell>
                                    <TableCell>{record.status}</TableCell>
                                </TableRow>)
                            )
                        }
                    </TableBody>
                </TblContainer>
                <p style={{position:'absolute', marginTop:14}}>Total : {total} | Completed: {completed}</p>
                <TblPagination/>
            </Paper>
        </>
    )
}
