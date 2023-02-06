import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import React, {Fragment, useCallback, useEffect, useState} from "react";
import {AddBusinessTwoTone} from "@mui/icons-material";
import {Button, Tooltip} from "@mui/material";
import Popup from "../controls/Popup";
import EventForm from "./EventForm";
import {addEvent, getEvents, updateStatusToCompleted} from "../../services/services";

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
            <div className={`min-h-full ${disabled?'bg-pink-100':''} flex flex-row gap-2`}>
                <div className=" bg-red-600"></div>
                {/*<div></div>*/}
                {/*<div></div>*/}
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
         await updateStatusToCompleted(event);
         getAllEvents();
     }

     useEffect( () => {
         getAllEvents();
     },[0])

     return <div>
         <Popup
             title="Events Form"
             openPopup={openPopup}
             setOpenPopup={setOpenPopup}
         >
             <EventForm
                 addItem={addEvents}
             />
         </Popup>
         <Button onClick={() => setOpenPopup(true)}>Add</Button>
         <Scheduler
             hourFormat={24}
             week={week}
             day={day}
             month={month}
             viewerExtraComponent={(fields, event) => {
                 return (
                     <div>
                         <p>Client: {event.client}</p>
                         {
                             event.otherClients.map(client=> {
                                 return <p>{client}</p>
                             })
                         }
                         <Button onClick={()=>updateEvent(event)}>Completed</Button>
                     </div>
                 );
             }}
             eventRenderer={(event) => {
                     return (
                         <Tooltip title={
                             <Fragment>
                                 <p>{event.title}</p>
                                 <p>{event.client}</p>
                             </Fragment>
                         }>
                             <div className="flex flex-col text-black">
                                 <div className={`h-6 ${event.status==='Completed'?'bg-green-200':'bg-gray-200'}`}>
                                     {(new Date(event.start)).toLocaleDateString()}
                                 </div>
                                 <div className="text-sm">
                                     {event.title}
                                 </div>
                             </div>
                         </Tooltip>
                     );
             }}
         />
     </div>

 }

export {WeekScheduler}