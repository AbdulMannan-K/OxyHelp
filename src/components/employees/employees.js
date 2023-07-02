import React, {useCallback, useEffect, useState} from 'react'
import {
    Paper,
    TableBody,
    TableCell,
    InputAdornment,
    Typography, Input, Button, TableRow, Slide, ToggleButton
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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';

import {get} from "axios";

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
    const [dateRangeStart,setDateRangeStart] = useState(null)
    const [dateRangeEnd,setDateRangeEnd] = useState(null)
    const [selected, setSelected] = React.useState(false);
    const [bonus,setBonus]=React.useState(0)
    const navigate = useNavigate();
    const [filterFn, setFilterFn] = useState({
        fn: users => {
            return users;
        }
    })

    let index=1;

    useEffect(()=>{
        if(selected)
            setRecordForEdit(records.filter(record => record.employee === employee &&  new Date(record.start.seconds*1000).getTime()>dateRangeStart && new Date(record.start.seconds*1000).getTime()<dateRangeEnd))
        else
            setRecordForEdit(records.filter(record => record.employee === employee))
        if(employee=="All") setRecordForEdit(records)
    },[employee,dateRangeStart,dateRangeEnd,selected])

    useEffect(() => {
        const user = localStorage.getItem('Auth Token');
        if (!user) navigate("/login");
    }, [0]);

    useEffect(()=>{
        getEmployees(setRecords)
    },[0])

    useEffect(()=>{
        setUniqueEmployees([...new Set(records.map(record=>record.employee))])
    },[records])

    const getColor = (capsule,employee)=> {
        if(employee=="") return 'bg-customPink'
        else {
            if (capsule === 'Kapsula 999') return 'bg-customOrange'
            if (capsule === 'Kapsula 99') return 'bg-customYellow'
            if (capsule === 'Kapsula 9') {
                return 'bg-customGreen'
            }
        }
    }

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
                        Employees
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
                                    if(e.target.value!=='All'){
                                        records.forEach(record => {
                                            if (record.employee === e.target.value) {
                                                t++;
                                                if (record.status === 'Completed') c++;
                                            }
                                        })
                                        setTotal(t);
                                        setCompleted(c)
                                        // setRecordForEdit(recordForEdit.filter(record => record.employee === e.target.value))
                                    }else{
                                        records.forEach(record => {
                                            t++;
                                            if (record.status === 'Completed') c++;
                                        })
                                        setTotal(t);
                                        setCompleted(c)
                                    }
                                }}
                            >
                                <MenuItem value={'All'}>All</MenuItem>
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
                            setDateRangeStart(new Date(start).getTime())
                            setDateRangeEnd(new Date(end).getTime())
                        }
                        }>
                                <input type="text"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        </DateRangePicker>
                        <ToggleButton
                            size="small"
                            value="time"
                            selected={selected}
                            onChange={() => {
                                setSelected(!selected);
                            }}
                        >
                            <AccessTimeIcon />
                        </ToggleButton>
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
                                    <TableCell>
                                        <p className={`rounded-full px-6 py-2 w-2/3 text-black ${getColor(record.title,record.employee)}`}>{record.title}</p>
                                    </TableCell>
                                    <TableCell>{new Date(record.start).toLocaleDateString("en-GB")}</TableCell>
                                    <TableCell>{new Date(record.start).toLocaleTimeString("en-GB")}</TableCell>
                                    <TableCell>{new Date(record.end).toLocaleTimeString("en-GB")}</TableCell>
                                    <TableCell>
                                        <p className={`rounded-full px-6 py-2 w-1/2 text-white ${record.status == 'Reserved' ? 'bg-blue-800' : record.status == 'Completed' ? 'bg-green-700' : 'bg-red-500'}`}>{record.status}</p>
                                    </TableCell>
                                </TableRow>)
                            )
                        }
                    </TableBody>
                </TblContainer>
                <span style={{position:'absolute',marginTop:14, zIndex:100}}>
                    <p style={{display:'inline', marginRight:'5px'}}>Total : {total} | Completed: {completed} x </p>
                    <input value={bonus} onChange={(e)=>setBonus(e.target.value)} style={{display:'inline',width:'100px', marginRight:2,marginLeft:2}} className="p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 "  type="number"/>
                    <p style={{display:'inline'}}> Bonus of {completed*bonus}.00 euros</p>
                </span>
                <TblPagination/>
            </Paper>
        </>
    )
}
