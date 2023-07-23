import React, {useCallback, useEffect, useState} from 'react'
import UserForm from "./UserForm";
import {
    Paper,
    TableBody,
    TableCell,
    InputAdornment,
    Typography, Input, Button, TableRow, ImageListItem, ImageList, Slide, Toolbar
} from '@mui/material';
import {Delete, Search} from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History';
import IconButton from "@mui/material/IconButton";
import Popup from "../controls/Popup";
import Money from "@mui/icons-material/Money"
import useTable from "./useTable";
import {addUser, delUser, getEventsOfClients, getUsers, updateStatus, updateUser} from "../../services/services";
import axios from "axios";
import ImageViewer from "react-simple-image-viewer";
import Dialog from '@mui/material/Dialog';
import CloseIcon from "@mui/icons-material/Close";
import AppBar from '@mui/material/AppBar';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import HelpIcon from '@mui/icons-material/Help';
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
    { id: 'nr', label:'Sr.'},
    { id: 'firstName', label: 'First Name' },
    { id: 'lastName', label: 'Last Name' },
    { id: 'gender', label: 'Gender' },
    { id: 'phoneNumber', label: 'Phone Number' },
    { id: 'email', label: 'Email' },
    { id: 'country', label: 'Country' },
    { id: 'edit', label: 'Edit',disableSorting: true },
    { id: 'questionnaire', label: 'Questionnaire', disableSorting: true },
    { id: 'beforeQues', label: 'Before', disableSorting: true },
    { id: 'afterQues', label: 'After', disableSorting: true },
    { id: 'history', label: 'History', disableSorting: true }
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
    const [openBQPopup, setOpenBQPopup] = useState(false)
    const [openAQPopup, setOpenAQPopup] = useState(false)
    const [openHPopup,setOpenHPopup] = useState(false);
    const [history,setHistory] = useState([]);
    const [currentHistory,setCurrentHistory] = useState(null);
    const [image,setImage]= useState();
    const [currentImageQ, setCurrentImageQ] = useState(0);
    const [currentImage, setCurrentImage] = useState(0);
    const [currentImageA, setCurrentImageA] = useState(0);
    const [isViewerOpenQ, setIsViewerOpenQ] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isViewerOpenA, setIsViewerOpenA] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const user = localStorage.getItem('employee');
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

    const openImageViewerA = useCallback((index) => {
        setCurrentImageA(index);
        setIsViewerOpenA(true);
    }, []);

    const openImageViewerQ = useCallback((index) => {
        setCurrentImageA(index);
        setIsViewerOpenQ(true);
    },[]);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    const closeImageViewerQ = () => {
        setCurrentImageQ(0);
        setIsViewerOpenQ(false);
    };

    const closeImageViewerA = () => {
        setCurrentImageA(0);
        setIsViewerOpenA(false);
    }
    const addOrEdit = async (user, resetForm) => {
        if(recordForEdit){
            setRecords(await updateUser(user))
        }else{
            setRecords((await addUser(user,records.length==0?1:records.length+1)));
        }
        setRecordForEdit(null);
        setOpenPopup(false)
        setOpenBQPopup(false);
        setOpenAQPopup(false);
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

    const deleteUser = async (user) => {
        setRecords(await delUser(user));
    }

    const handleImageSubmit = (e,client)=>{
        e.preventDefault()
        if(client.questionnaire.length==5) {
            alert('You cant enter more then 5 images')
            return
        }
        if(image==undefined) {
            alert('Please select an image')
            return
        }
        const formData = new FormData()
        formData.append('image', image)
        formData.append('client',client.phoneNumber )
        axios.post("http://localhost:4000/", formData, {
        }).then(async res => {
            client.questionnaire.push(res.data)
            setRecords(await updateUser(client));
        })
    }

    const handleImageSubmitAfter = (e,client)=>{
        e.preventDefault()
        if(client.afterQues.length==5) {
            alert('You cant enter more then 5 images')
            return
        }
        if(image==undefined) {
            alert('Please select an image')
            return
        }
        const formData = new FormData()
        formData.append('image', image)
        formData.append('client',client.phoneNumber )
        axios.post("http://localhost:4000/", formData, {
        }).then(async res => {
            client.afterQues.push(res.data)
            setRecords(await updateUser(client));
        })
    }

    const handleImageSubmitBefore = (e,client)=>{
        e.preventDefault()
        if(client.beforeQues.length==5){
            alert('You cant enter more then 5 images')
            return
        }
        if(image==undefined) {
            alert('Please select an image')
            return
        }
        const formData = new FormData()
        formData.append('image', image)
        formData.append('client',client.phoneNumber )
        axios.post("http://localhost:4000/", formData, {
        }).then(async res => {
            client.beforeQues.push(res.data)
            setRecords(await updateUser(client));
        })
    }

    const getTotalCompleted = ()=>{
        let total =0 ;
        let treatments= [];
        for(let i =0 ;i < history.length ; i++){
            if(!treatments.includes(history[i].treat_id)){
                treatments.push(history[i].treat_id)
                total+=history[i].completed
            }
        }
        return total;
    }

    const getTotalAll = ()=>{
        let total =0 ;
        let treatments= [];
        for(let i =0 ;i < history.length ; i++){
            if(!treatments.includes(history[i].treat_id)){
                treatments.push(history[i].treat_id)
                total+=history[i].total
            }
        }
        return total;
    }

    const getCostTotal = ()=>{
        let total =0 ;
        history.forEach(h=>total+=h.payment?parseInt(h.payment.price):parseInt(0))
        return total;
    }

    async function handleImageDelete(e, recordForEdit, question, index, type) {
        if (type == 'After') {
            recordForEdit.afterQues=recordForEdit.afterQues.filter((item) => item != question)
        } else if (type == 'Before') {
            recordForEdit.beforeQues=recordForEdit.beforeQues.filter((item) => item != question)
        } else if (type == 'Question') {
            recordForEdit.questionnaire=recordForEdit.questionnaire.filter((item) => item != question)
        }
        setRecords(await updateUser(recordForEdit));
        let imageName = question.split('/');
        axios.delete(`http://localhost:4000/${imageName[imageName.length - 1]}`, {}).then(async res => {
            console.log(res)
        })
    }

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
                                        <TableCell>{("0000" + user.nr).slice(-5)}</TableCell>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.lastName}</TableCell>
                                        <TableCell>{user.gender}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.country}</TableCell>
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
                                        <TableCell >
                                            <IconButton
                                                color="primary"
                                                onClick={() => {
                                                    setRecordForEdit(user);
                                                    setOpenQPopup(true);
                                                }}
                                            ><VisibilityIcon fontSize="small"/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell >
                                            <IconButton
                                                color="primary"
                                                onClick={() => {
                                                    setRecordForEdit(user);
                                                    setOpenBQPopup(true);
                                                }}
                                            ><QuestionMarkIcon fontSize="small"/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell >
                                            <IconButton
                                                color="primary"
                                                onClick={() => {
                                                    setRecordForEdit(user);
                                                    setOpenAQPopup(true);
                                                }}
                                            ><HelpIcon fontSize="medium"/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell >
                                            <IconButton
                                                color="primary"
                                                onClick={async () => {
                                                    // setCurrentUser(user);
                                                    setHistory(await getEventsOfClients(user.history));
                                                    setRecordForEdit(user)
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
                            {recordForEdit.questionnaire.map((question,index)=> <div>
                                <img
                                src={question}
                                alt={question}
                                width='90%'
                                style={{cursor:'pointer', display:'inline', margin:10}}
                                onClick={()=> {
                                    openImageViewerQ(index)
                                    setOpenQPopup(false)
                                }}
                            />
                                {localStorage.getItem('Role')=='Admin'?<button className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800" onClick={(e)=>handleImageDelete(e,recordForEdit,question,index,'Question')}>Delete</button>:<></>}
                            </div>)}
                        </div>:<></>}
                    </div>
                </Dialog>
                <Dialog
                    fullScreen
                    sx={{zIndex:10}}
                    open={openBQPopup}
                    onClose={()=>setOpenBQPopup(false)}
                >
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar sx={{backgroundColor:'#52b387'}}>
                        <IconButton
                            edge="start"
                            color="red"
                            onClick={()=>setOpenBQPopup(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Before Questionnaire
                        </Typography>
                        <div className="mt-2">
                            <input type="file" onChange={onFileChange} />
                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={(e)=>handleImageSubmitBefore(e,recordForEdit)}>Add Image</button>
                        </div>
                    </Toolbar>
                    </AppBar>
                    <div className="min-w-fit">
                        {recordForEdit!==null?<div  className="grid grid-cols-2 justify-evenly gap-10 mt-5 border-2">
                            {recordForEdit.beforeQues.map((question,index)=> <div><img
                                src={question}
                                alt={question}
                                width='90%'
                                loading="lazy"
                                style={{cursor:'pointer', display:'inline', margin:10}}
                                onClick={()=> {
                                    openImageViewer(index)
                                    setOpenBQPopup(false)
                                }}

                            />
                                {localStorage.getItem('Role')=='Admin'?<button className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800" onClick={(e)=>handleImageDelete(e,recordForEdit,question,index,'Before')}>Delete</button>:<></>}
                            </div>)}
                        </div>:<></>}
                    </div>
                </Dialog>
                <Dialog
                    fullScreen
                    sx={{zIndex:10}}
                    open={openAQPopup}
                    onClose={()=>setOpenAQPopup(false)}
                >
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar sx={{backgroundColor:'#52b387'}}>
                            <IconButton
                                edge="start"
                                color="red"
                                onClick={()=>setOpenAQPopup(false)}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                After Questionnaire
                            </Typography>
                            <div className="mt-2">
                                <input type="file" onChange={onFileChange} />
                                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={(e)=>handleImageSubmitAfter(e,recordForEdit)}>Add Image</button>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className="min-w-fit">
                        {recordForEdit!==null?<div  className="grid grid-cols-2 justify-evenly gap-10 mt-5 border-2">
                            {recordForEdit.afterQues.map((question,index)=> <div><img
                                src={question}
                                alt={question}
                                width='90%'
                                loading="lazy"
                                style={{cursor:'pointer', display:'inline', margin:10}}
                                onClick={()=> {
                                    openImageViewerA(index)
                                    setOpenAQPopup(false)
                                }}

                            />
                                {localStorage.getItem('Role')=='Admin'?<button className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800" onClick={(e)=>handleImageDelete(e,recordForEdit,question,index,'After')}>Delete</button>:<></>}
                            </div>)}
                        </div>:<></>}
                    </div>
                </Dialog>
                {isViewerOpenQ && (
                    <ImageViewer
                        src={recordForEdit.questionnaire}
                        currentIndex={currentImageQ}
                        onClose={closeImageViewerQ}
                        style={{zIndex:100}}
                        disableScroll={false}
                        backgroundStyle={{
                            backgroundColor: "rgba(0,0,0,0.9)"
                        }}
                        closeOnClickOutside={true}
                    />
                )}
                {isViewerOpen && (
                    <ImageViewer
                        src={recordForEdit.beforeQues}
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
                {isViewerOpenA && (
                    <ImageViewer
                        src={recordForEdit.afterQues}
                        currentIndex={currentImageA}
                        onClose={closeImageViewerA}
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
                                    Bill No
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
                                            {h.title}
                                        </th>
                                        <td className="px-6 py-4">
                                            {new Date(h.start).toLocaleDateString("en-GB")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(h.start).toLocaleTimeString("en-GB")}
                                        </td>
                                        <td className={`  `}>
                                            <p className={`rounded-full text-white px-6 py-2  ${h.status == 'Reserved' ? 'bg-blue-800' : h.status == 'Completed' ? 'bg-green-700' : 'bg-red-500'}`}>{h.status}</p>
                                        </td>
                                        <td className={"text-center"}>
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
                                            {h.payment?h.payment.price+'.00':0}
                                        </td>
                                        <td className={"text-center"}>
                                            {h.payment?h.payment.billNumber:0}
                                        </td>
                                        <td className={"text-center"}>
                                            <button disabled={h.status==='Canceled'} className={`text-white ${h.payment==null?'bg-blue-700 hover:bg-blue-800':h.status==='Canceled'?'bg-blue-700 hover:bg-blue-800':'bg-green-700'} font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2`}
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
                                <td className="px-6 py-4">

                                </td>
                                <td className="px-6 py-4">
                                </td>
                                <td className="px-6 py-4">
                                </td>
                                <th className={"text-center"}>
                                    Total :
                                </th>
                                <th className={"text-center"}>
                                    {getTotalCompleted()}
                                </th>
                                <th className={"text-center"}>
                                    {getTotalAll()}
                                </th>
                                <th className={"text-center"}>
                                    {getTotalAll()-getTotalCompleted()}
                                </th>
                                <th className={"text-center"}>
                                    {getCostTotal()+'.00'}
                                </th>
                                <td className="px-6 py-4">
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
