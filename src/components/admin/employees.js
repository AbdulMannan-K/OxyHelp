import React, {useEffect, useState} from 'react'
import {
    Paper,
    TableBody,
    TableCell,
    InputAdornment,
    Typography, Input, Button, TableRow,
} from '@mui/material';
import {Delete, Remove, Search} from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IconButton from "@mui/material/IconButton";
import Popup from "../controls/Popup";
import useTable from "../users/useTable";
import {
    deleteEmployee,
    getAllEmployees,
    signUp,
} from "../../services/services";
import {useNavigate} from "react-router-dom";
import EmployeeForm from "./EmployeeForm";
import axios from "axios";


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
    { id: 'serialNumber', label:'Nr.'},
    { id: 'firstName', label: 'First Name' },
    { id: 'secondName', label: 'Last Name' },
    { id: 'email', label: 'Email' },
    { id: 'password', label: 'Password' },
    { id: 'role', label: 'Role' },
    { id: 'edit', label: 'Edit',disableSorting: true },
]

export function Employees() {
    const classes = styles;
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [records, setRecords] = useState([])
    const [filterFn, setFilterFn] = useState({
        fn: users => {
            return users;
        }
    })
    const [openPopup, setOpenPopup] = useState(false)
    const navigate = useNavigate();


    useEffect(() => {
        const user = localStorage.getItem('employee');
        if(user==null) navigate("/login")
        const role = localStorage.getItem('Role');
        if(role!=="Admin") navigate("/capsules")
    }, [0]);

    const getClients=async () => {
        await getAllEmployees(setRecords)
    }

    React.useEffect(()=>{
        getClients()
    },[0])

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: users => {
                if (target.value === "")
                    return users;
                else
                    return users.filter(x => x.firstName.toLowerCase().includes(target.value) || x.secondName.toLowerCase().includes(target.value) || x.email.toLowerCase().includes(target.value))
            }
        })
    }

    const addOrEdit = async (user, resetForm) => {
        await signUp(user);
        setRecordForEdit(null);
        setOpenPopup(false)
       (getAllEmployees(setRecords))
    }

    async function deleteUser(user) {
        await deleteEmployee(user.email);
        setRecords(records.filter((item) => item.email !== user.email));
    }

    const openInPopup = async item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    return (
        <>
            <Paper sx={classes.pageContent}>
                <div style={classes.toolBar}>
                    <Typography variant="h4" noWrap  component="div">
                        Employees
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
                        <Button
                            variant="outlined"
                            size="medium"
                            startIcon={<AddIcon/>}
                            onClick={async () => {
                                setOpenPopup(true);
                                setRecordForEdit(null);
                            }}
                        >Add Employee</Button>
                    </div>
                </div>
                <TblContainer>
                    <TblHead/>
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map((user,index) =>
                                (<TableRow key={user.email}>
                                    <TableCell>{("0000" + (index+1)).slice(-5)}</TableCell>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.secondName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.password}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => { openInPopup(user) }}
                                        ><EditOutlinedIcon fontSize="small"/>
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => { deleteUser(user) }}
                                        ><Delete fontSize="small"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>)
                            )
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination/>
            </Paper>
            <Popup
                title="Employee Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <EmployeeForm
                    recordForEdit={recordForEdit}
                    addItem={addOrEdit}
                />
            </Popup>
        </>
    )
}
