import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import React, {useCallback, useEffect, useState} from "react";
import CustomEditor from "./Form.tsx";
import {AddBusinessTwoTone} from "@mui/icons-material";
import {Button} from "@mui/material";
import UserForm from "../users/UserForm";
import Popup from "../controls/Popup";
import EventForm from "./EventForm";
import {addEvent, getEvents} from "../../services/services";

const EVENTS = [
    {
        event_id: 1,
        title: "Event 1",
        start: new Date(new Date(new Date().setHours(9)).setMinutes(0)),
        end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
        disabled: true,
        color: "#50b500",
        admin_id: [1, 2, 3, 4]
    },
    {
        title: "Event 2",
        start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
        end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
        admin_id:2 ,
        color: "#50b500"
    },
    {
        title: "Event 3",
        start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
        end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
        admin_id:2 ,
        color: "#50b500"

    },
    {
        title: "Event 4",
        start: new Date(
            new Date(new Date(new Date().setHours(9)).setMinutes(30)).setDate(
                new Date().getDate() - 2
            )
        ),
        end: new Date(
            new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
                new Date().getDate() - 2
            )
        ),
        admin_id: 2,
        color: "#900000"
    },
    {
        event_id: 5,
        title: "Event 5",
        start: new Date(
            new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
                new Date().getDate() - 2
            )
        ),
        end: new Date(
            new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
                new Date().getDate() - 2
            )
        ),
        admin_id: 2,
    },
    {
        event_id: 6,
        title: "Event 6",
        start: new Date(
            new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
                new Date().getDate() - 4
            )
        ),
        end: new Date(new Date(new Date().setHours(14)).setMinutes(0)),
        admin_id: 2
    },
];


const week = {
    weekDays: [0, 1, 2, 3, 4, 5,6],
    weekStartOn: 1,
    startHour: 7,
    endHour: 23,
    step: 60,
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

     const addPrevEvent = async ()=>{
         let gevents = ((await getEvents())).map(event => {
             return {
                 ...event,
                 start: (new Date(event.start.seconds * 1000)),
                 end: new Date(event.end.seconds * 1000),
             }
         })
         setEvents(gevents);
         console.log(gevents)
         console.log(EVENTS)
     }

     const getAllEvents = async () => {
         let gevents = ((await getEvents())).map(event => {
             return {
                 ...event,
                 start: (new Date(event.start.seconds * 1000)),
                 end: new Date(event.end.seconds * 1000),
             }
         })
         setEvents(gevents);
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
             customEditor={(scheduler) => <CustomEditor scheduler={scheduler}/>}
             viewerExtraComponent={(fields, event) => {
                 return (
                     <div>
                         <p>Client: {event.client}</p>
                     </div>
                 );
             }}
         />
     </div>

 }

export {EVENTS,WeekScheduler}