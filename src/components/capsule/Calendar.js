import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import React, {Fragment, useCallback, useEffect, useState} from "react";
import {AddBusinessTwoTone} from "@mui/icons-material";
import {Button, Tooltip} from "@mui/material";
import Popup from "../controls/Popup";
import EventForm from "./EventForm";
import {addEvent, deleteEvent, getEvents, updateStatus} from "../../services/services";
import CustomEditor from "./Form.tsx";

const week = {
    weekDays: [0, 1, 2, 3, 4, 5,6],
    weekStartOn: 1,
    startHour: 7,
    endHour: 23,
    step: 60,
    // navigation: true,
    // disableGoToDay: false,
    cellRenderer: ({ height, start, onClick, ...props }) => {
        // Fake some condition up
        const day = start.getDay();
        const disabled = day === 0;
        // const restProps = disabled ? {} : props;
        return (
            <div id="weekRender" className={`mt-0 p-0  min-h-full ${disabled?'bg-pink-100':''}`}>
            </div>
        );
    }
}

const day = {
    startHour: 7,
    endHour: 23,
    step: 60,
    cellRenderer: ({ height, start, onClick, ...props }) => {
        // Fake some condition up
        const day = start.getDay();
        const disabled = day === 0;
        // const restProps = disabled ? {} : props;
        return (
            <div className={`min-h-full ${disabled?'bg-pink-100':''} flex flex-row gap-2`}>
                <div className=" bg-red-600"></div>
                {/*<div></div>*/}
                {/*<div></div>*/}
            </div>
        );
    },
    navigation: true
}

const month = {
    weekDays: [0, 1, 2, 3, 4, 5,6],
    weekStartOn: 1,
    startHour: 7,
    endHour: 23,
    cellRenderer: ({ height, start, onClick, ...props }) => {
        // Fake some condition up
        const day = start.getDay();
        const disabled = day === 0;
        // const restProps = disabled ? {} : props;
        return (
            <div className={`min-h-full ${disabled?'bg-pink-100':''} flex flex-row gap-2`}>
                <div className=" bg-red-600"></div>
                {/*<div></div>*/}
                {/*<div></div>*/}
            </div>
        );
    },
    navigation: true,
    disableGoToDay: false
}

function WeekScheduler() {

     const {events, setEvents} = useScheduler();
     const [openPopup, setOpenPopup] = useState(false);

     const addEvents = async (event, resetForm) => {
         await addEvent(event, event.client);
         setEvents([...events, event]);
         resetForm();
         setOpenPopup(false);
     }

     const getAllEvents = async () => {
         let gevents = ((await getEvents())).map(event => {
             return {
                 ...event,
                 start: (new Date(event.start.seconds * 1000)),
                 end: new Date(event.end.seconds * 1000),
             }
         })
         console.log(gevents);
         setEvents(gevents);
     }

     const updateEvent = async (event)=>{
         await updateStatus(event,'Completed');
         getAllEvents();
     }

     const cancelEvent = async (event)=>{
         await updateStatus(event,'Canceled');
         getAllEvents();
     }

     const deleteE = async (id)=>{
         await deleteEvent(id);
         getAllEvents();
     }

     useEffect( () => {
         getAllEvents();
     },[0])

     return (
    <div>
         <Popup
             title="Events Form"
             openPopup={openPopup}
             setOpenPopup={setOpenPopup}
         >
             <EventForm
                 addItem={addEvents}
             />
         </Popup>
        <button type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={()=> setOpenPopup(true)}
        >Add Booking
        </button>
         <Scheduler
             hourFormat={24}
             week={week}
             day={day}
             month={month}
             // editable={false}
             customEditor={(scheduler) => <CustomEditor scheduler={scheduler}/>}
             onDelete={(id)=>deleteE(id)}
             viewerExtraComponent={(fields, event) => {
                 return (
                     <div>
                         <div className="mt-4">
                             <p>Client Name: {event.clientName} </p>
                             <p>Client Phone: {event.client}</p>
                             {event.otherClients.length!==0?<p>Other Clients: </p>:<></>}
                             {
                                 event.otherClients.map(client=> {
                                     return <p>{client}</p>
                                 })
                             }
                         </div>
                         <div className="mt-4">
                             <button type="button"
                                     disabled={event.status==='Canceled'}
                                     className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-30"
                                     onClick={()=> updateEvent(event)}
                             >Completed
                             </button>
                             <button type="button"
                                     disabled={event.status==='Completed'}
                                     className=":outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 disabled:opacity-30"
                                    onClick={()=> cancelEvent(event)}
                             >Cancel
                             </button>
                         </div>
                     </div>
                 );
             }}
             eventRenderer={(event) => {
                     return (
                         <div id="eventRender">
                         <Tooltip title={
                             <Fragment>
                                 <p>{event.title}</p>
                                 <p>{event.client}{event.otherClients.length!==0?` , ${event.otherClients.length} more`:''}</p>
                             </Fragment>
                         }>
                             <div className="flex flex-col text-black">
                                 <div className={`h-6 ${event.status==='Completed'?'bg-green-200': event.status === 'Canceled' ? 'bg-red-400' : 'bg-gray-200'}`}>
                                     {event.title.split(" ")[1]}
                                 </div>
                                 <div className="text-sm">
                                     {event.clientName}{event.otherClients.length!==0?` , ${event.otherClients.length} more`:''}
                                 </div>
                             </div>
                         </Tooltip>
                         </div>

                     );
             }}
         />
     </div>)

 }

export {WeekScheduler}