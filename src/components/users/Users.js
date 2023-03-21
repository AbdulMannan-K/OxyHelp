import React, {useCallback, useEffect, useState} from 'react'
import UserForm from "./UserForm";
import {
    Paper,
    TableBody,
    TableCell,
    InputAdornment,
    Typography, Input, Button, TableRow, ImageListItem, ImageList, Slide, Toolbar
} from '@mui/material';
import { Search } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History';
import IconButton from "@mui/material/IconButton";
import Popup from "../controls/Popup";
import Money from "@mui/icons-material/Money"
import useTable from "./useTable";
import {addUser, getEventsOfClients, getUsers, updateStatus} from "../../services/services";
import axios from "axios";
import ImageViewer from "react-simple-image-viewer";
import Dialog from '@mui/material/Dialog';
import CloseIcon from "@mui/icons-material/Close";
import AppBar from '@mui/material/AppBar';
import PaymentForm from "./PaymentForm";
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";
import {getAuth} from "firebase/auth";

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
    const [openCPopup, setOpenCPopup] = useState(false)
    const [openQPopup, setOpenQPopup] = useState(false)
    const [openHPopup,setOpenHPopup] = useState(false);
    const [history,setHistory] = useState([]);
    const [currentHistory,setCurrentHistory] = useState(null);
    const [image,setImage]= useState();
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const navigate = useNavigate();

    let index=1;

    useEffect(() => {
        const user = sessionStorage.getItem('Auth Token');
        if(user==null) navigate("/login")
    }, [0]);

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

    const openImageViewer = useCallback((index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };
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

    const addPayment = async (values)=>{
        currentHistory.payment = {price:values.price,description:values.description,billNumber:values.billNumber};
        await updateStatus(currentHistory,currentHistory.status);
        setOpenCPopup(false);
    }

    const openInPopup = async item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    const onFileChange = (e) => {
        setImage(e.target.files[0]);
    }

    const handleImageSubmit = (e,client)=>{
        e.preventDefault()
        const formData = new FormData()
        formData.append('image', image)
        formData.append('client',client.phoneNumber )
        axios.post("http://localhost:4000/", formData, {
        }).then(async res => {
            console.log(res)
            client.questionnaire.push(res.data)
            setRecords(await addUser(client));
        })
    }

    const getTotalCompleted = ()=>{
        let total =0 ;
        history.forEach(h=>total+=h.completed)
        return total;
    }

    const getTotalAll = ()=>{
        let total =0 ;
        history.forEach(h=>total+=h.total)
        return total;
    }

    const getCostTotal = ()=>{
        let total =0 ;
        history.forEach(h=>total+=h.payment?parseInt(h.payment.price):parseInt(0))
        return total;
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
                                        <TableCell>{index++}</TableCell>
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
                                                    // setCurrentUser(user);
                                                    setHistory(await getEventsOfClients(user.history));
                                                    console.log('client history and somethign')
                                                    setRecordForEdit(user)
                                                    // setTreatment(await getEventsOfClients(user.history));
                                                    console.log(await getEventsOfClients(user.history))
                                                    console.log(history)
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
                    title="Payment Form"
                    openPopup={openCPopup}
                    setOpenPopup={setOpenCPopup}
                >
                    <PaymentForm
                        recordForEdit={recordForEdit}
                        event={currentHistory}
                        addItem={addPayment}
                    />
                </Popup>
                <Dialog
                    fullScreen
                    sx={{zIndex:10}}
                    open={openQPopup}
                    onClose={()=>setOpenQPopup(false)}
                >
                    {/*<QuestionForm*/}
                    {/*    questions={recordForEdit}*/}
                    {/*    handleSubmit={addOrEdit}*/}
                    {/*/>*/}
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar sx={{backgroundColor:'#52b387'}}>
                        <IconButton
                            edge="start"
                            color="red"
                            onClick={()=>setOpenQPopup(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Questionnaire
                        </Typography>
                        <div className="mt-2">
                            <input type="file" onChange={onFileChange} />
                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={(e)=>handleImageSubmit(e,recordForEdit)}>Add Image</button>
                        </div>
                    </Toolbar>
                    </AppBar>
                    <div className="min-w-fit">
                        {recordForEdit!==null?<div  className="grid grid-cols-2 justify-evenly gap-10 mt-5 border-2">
                            {recordForEdit.questionnaire.map((question,index)=> <img
                                src={question}
                                alt={question}
                                width='90%'
                                loading="lazy"
                                style={{cursor:'pointer', display:'inline', margin:10}}
                                onClick={()=> {
                                    openImageViewer(index)
                                    setOpenQPopup(false)
                                }}

                            />)}
                        </div>:<></>}
                    </div>
                </Dialog>
                {isViewerOpen && (
                    <ImageViewer
                        src={recordForEdit.questionnaire}
                        currentIndex={currentImage}
                        onClose={closeImageViewer}
                        style={{zIndex:100}}
                        disableScroll={false}
                        backgroundStyle={{
                            backgroundColor: "rgba(0,0,0,0.9)"
                        }}
                        closeOnClickOutside={true}
                    />
                )}
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
                                    Treatment id
                                </th>
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
                                <th scope="col" className="px-6 py-3">
                                    Treatment Completed
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Treatment Total
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Treatment Remaining
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Cost
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Pay
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                history.map(h=>
                                    h!=undefined ? <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {h.treat_id}
                                        </th>
                                        <th scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {h.title}
                                        </th>
                                        <td className="px-6 py-4">
                                            {new Date(h.start.seconds*1000).toLocaleDateString("en-GB")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(h.start.seconds*1000).toLocaleTimeString("en-GB")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {h.status}
                                        </td>
                                        <td>
                                            {h.employee}
                                        </td>
                                        <td className={"text-center"}>
                                            {h.completed}
                                        </td>
                                        <td className={"text-center"}>
                                            {h.total}
                                        </td>
                                        <td className={"text-center"}>
                                            {h.total-h.completed}
                                        </td>
                                        <td className={"text-center"}>
                                            {h.payment?h.payment.price:0}
                                        </td>
                                        <td className={"text-center"}>
                                            <button disabled={h.payment!=null} className={`text-white ${h.payment==null?'bg-blue-700 hover:bg-blue-800':'bg-green-700 disabled'} font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2`}
                                                onClick={()=> {
                                                setCurrentHistory(h);
                                                setOpenCPopup(true)
                                            }}>Pay</button>
                                        </td>
                                    </tr> : <></>
                                )
                            }
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                                </th>
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                                </th>
                                <td className="px-6 py-4">

                                </td>
                                <td className="px-6 py-4">

                                </td>
                                <td className="px-6 py-4">

                                </td>
                                <td>

                                </td>
                                <td className={"text-center"}>
                                    {getTotalCompleted()}
                                </td>
                                <td className={"text-center"}>
                                    {getTotalAll()}
                                </td>
                                <td className={"text-center"}>
                                    {getTotalAll()-getTotalCompleted()}
                                </td>
                                <td className={"text-center"}>
                                    {getCostTotal()}
                                </td>
                                <td className={"text-center"}>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                </Popup>
            </>
        )
}
