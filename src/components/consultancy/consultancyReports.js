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
import {getConsultantEvents, getEmployees} from "../../services/services";
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
        width: '100%'
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
    { id: 'clientName', label: 'Client Name' },
    { id: 'client', label: 'Client Phone' },
    { id: 'date', label: 'Date'},
    { id: 'time', label: 'Time' },
    { id: 'status', label: 'Status' },
    { id: 'employee', label: 'Employee' },
]

export default function ConsultancyReports() {
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
        setRecordForEdit(records.filter(record => new Date(record.start.seconds*1000).getTime()>dateRangeStart && new Date(record.start.seconds*1000).getTime()<dateRangeEnd))
    },[dateRangeStart,dateRangeEnd])

    useEffect(() => {
        const user = localStorage.getItem('Auth Token');
        if (!user) navigate("/login");
    }, [0]);

    useEffect(()=>{
        getConsultantEvents().then((res)=>{
            setRecords(res)
            setRecordForEdit(res)
        })
    },[0])

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: users => {
                if (target.value === "")
                    return users;
                else
                    return users.filter(x => x.client.toLowerCase().includes(target.value) || x.clientName.toLowerCase().includes(target.value) );
            }
        })
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
                        Report
                    </Typography>
                    <div style={classes.searchToggle}>
                        <Input
                            placeholder="Search"
                            size="small"
                            InputProps={{
                                startAdornment: (<InputAdornment position="start">
                                    <Search/>
                                </InputAdornment>)
                            }}
                            sx={classes.searchInput}
                            onChange={handleSearch}
                        />
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
                    </div>
                </div>
                <TblContainer>
                    <TblHead/>
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map((record,i) =>
                                (<TableRow key={i}>
                                    <TableCell>{i+1}</TableCell>
                                    <TableCell>{record.clientName}</TableCell>
                                    <TableCell>{record.client}</TableCell>
                                    <TableCell>{new Date(record.start.seconds*1000).toLocaleDateString("en-GB")}</TableCell>
                                    <TableCell>{new Date(record.start.seconds*1000).toLocaleTimeString("en-GB")}</TableCell>
                                    <TableCell>
                                        <p className={`rounded-full text-center p-2 text-white ${record.status == 'Reserved' ? 'bg-blue-800' : record.status == 'Completed' ? 'bg-green-700' : 'bg-red-500'}`}>{record.status}</p>
                                    </TableCell>
                                    <TableCell>{record.employee}</TableCell>
                                </TableRow>)
                            )
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination/>
            </Paper>
        </>
    )
}
