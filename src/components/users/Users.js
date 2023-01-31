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
import Popup from "./Popup";
import useTable from "./useTable";
import {addUser, getUsers} from "../../services/services";

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

    
    // const getItems=()=>{
    //     itemService.getItems(setRecords)
    // }
    
    // React.useEffect(()=>{
    //     getItems()
    // },[0])

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
                    return users.filter(x => x.firstName.toLowerCase().includes(target.value))
            }
        })
    }
    const addOrEdit = async (user, resetForm) => {
        // setRecords([records, item])
        setRecords((await addUser(user)));
        // console.log((await addUser(user)));
        // if (item.id === 0)
        //     itemService.addItem(item,valid,invalid)
        // else
        //     itemService.updateItem(item,valid,invalid,true, `Item updated successfully` )
        resetForm()
        setRecordForEdit(null);
        setOpenPopup(false)
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
                            >Add Items</Button>
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
                                                onClick={() => {  }}
                                            ><VisibilityIcon fontSize="small"/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <IconButton
                                                color="primary"
                                                onClick={() => {  }}
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
                    title="Users Form"
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                >
                    <UserForm
                        recordForEdit={recordForEdit}
                        addItem={addOrEdit}
                    />
                </Popup>
            </>
        )
}
