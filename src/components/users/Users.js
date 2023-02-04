import React, { useState } from 'react'
import UserForm from "./UserForm";
import {
    Paper,
    TableBody,
    TableCell,
    InputAdornment,
    Typography, Input, Button, TableRow
} from '@mui/material';
import { Search } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History';
import IconButton from "@mui/material/IconButton";
import Popup from "../controls/Popup";
import useTable from "./useTable";
import {addUser, getEventsOfClients, getUsers} from "../../services/services";
import QuestionForm from "./QuestionForm";

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
    { id: 'firstName', label: 'First Name' },
    { id: 'lastName', label: 'Last Name' },
    { id: 'phoneNumber', label: 'Phone Number' },
    { id: 'email', label: 'Email' },
    { id: 'edit', label: 'Edit' },
    { id: 'questionnaire', label: 'Questionnaire', disableSorting: true },
    { id: 'history', label: 'History', disableSorting: true, align: 'right' }
]

export default function Users() {

    const classes = styles;
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [records, setRecords] = useState([])
    const [filterFn, setFilterFn] = useState({
        fn: users => {
            return users;
        }
    })
    const [openPopup, setOpenPopup] = useState(false)
    const [openQPopup, setOpenQPopup] = useState(false)
    const [openHPopup,setOpenHPopup] = useState(false);
    const [history,setHistory] = useState([]);

    const getClients=async () => {
        setRecords(await getUsers())
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
                    return users.filter(x => x.phoneNumber.toLowerCase().includes(target.value) || x.firstName.toLowerCase().includes(target.value) || x.lastName.toLowerCase().includes(target.value) || x.email.toLowerCase().includes(target.value))
            }
        })
    }
    const addOrEdit = async (user, resetForm) => {
        // setRecords([records, item])
        // console.log((await addUser(user)));
        setRecords((await addUser(user)));
        resetForm()
        setRecordForEdit(null);
        setOpenPopup(false)
        setOpenQPopup(false);
//        setRecords([...itemService.getItems()]);
//         getItems()
    }

    const openInPopup = async item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

        // const onDelete = (quantity) => {
        //     let difference = recordForEdit.quantity-quantity.quantity
        //     if(difference>=0) {
        //         let QTA =recordForEdit.quantity- quantity.quantity;
        //         let record={
        //             ...recordForEdit,
        //             quantity:QTA
        //         }
        //         const msg=`Stock of ${quantity.quantity} ${record.name} Removed Successfully`
        //         itemService.updateItem(record,valid,invalid,true,msg,getItems);
        //
        //     }else {
        //         setNotify({
        //         isOpen: true,
        //         message: 'Insufficient stock of items',
        //         type: 'error'
        //     })
        //     }
        //     setOpenDeletePopup(false);
        //     setRecordForEdit(null);
        // }


        return (
            <>
                <Paper sx={classes.pageContent}>
                    <div style={classes.toolBar}>
                        <Typography variant="h4" noWrap  component="div">
                            Users
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
                            >Add Client</Button>
                        </div>
                    </div>
                    <TblContainer>
                        <TblHead/>
                        <TableBody>
                            {
                                recordsAfterPagingAndSorting().map(user =>
                                    (<TableRow key={user.phoneNumber}>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.lastName}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell align='right'>
                                            <IconButton
                                                color="primary"
                                                onClick={() => { openInPopup(user) }}
                                            ><EditOutlinedIcon fontSize="small"/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <IconButton
                                                color="primary"
                                                onClick={() => {
                                                    setRecordForEdit(user);
                                                    console.log('hello')
                                                    console.log(user.questionnaire)
                                                    setOpenQPopup(true);
                                                }}
                                            ><VisibilityIcon fontSize="small"/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <IconButton
                                                color="primary"
                                                onClick={async () => {
                                                    setHistory(await getEventsOfClients(user.history));
                                                    setOpenHPopup(true);
                                                }}
                                            ><HistoryIcon fontSize="small"/>
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
                    title="Clients Form"
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                >
                    <UserForm
                        recordForEdit={recordForEdit}
                        addItem={addOrEdit}
                    />
                </Popup>
                <Popup
                    title="Questionnaire"
                    openPopup={openQPopup}
                    setOpenPopup={setOpenQPopup}
                >
                    <QuestionForm
                        questions={recordForEdit}
                        handleSubmit={addOrEdit}
                    />
                </Popup>
                <Popup
                    title="History"
                    openPopup={openHPopup}
                    setOpenPopup={setOpenHPopup}
                >

                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead
                                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Capsule
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Time
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Employee
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                history.map(h=>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {h.title}
                                        </th>
                                        <td className="px-6 py-4">
                                            {new Date(h.start.seconds*1000).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(h.start.seconds*1000).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {h.status}
                                        </td>
                                        <td>
                                            {h.employee}
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>

                </Popup>
            </>
        )
}
