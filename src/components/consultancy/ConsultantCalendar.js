import {Scheduler, useScheduler} from "@aldabil/react-scheduler";
import React, {Fragment, useCallback, useEffect, useState} from "react";
import {Button, ToggleButtonGroup, Tooltip} from "@mui/material";
import Popup from "../controls/Popup";
import ConsultantEventForm from "./ConsultantEventForm";
import {
    addConsultantEvent,
    addEvent, deleteConsultantEvent,
    deleteEvent,
    getConsultantEvents,
    getEvents,
    getEventsOnDate,
    getTreatment,
    getUsers, updateConsultantEvent,
    updateStatus,
    updateTreatment
} from "../../services/services";
import {useNavigate} from "react-router-dom";
import CustomEditor from "./ConsultantForm.tsx";

const week = {
    weekDays: [0, 1, 2, 3, 4, 5, 6], weekStartOn: 1, startHour: 7, endHour: 23, step: 60, // navigation: true,
    // disableGoToDay: false,
    cellRenderer: ({height, start, onClick, ...props}) => {
        // Fake some condition up
        const day = start.getDay();
        const disabled = day === 0;
        // const restProps = disabled ? {} : props;
        return (<div id="weekRender" className={`mt-0 p-0  min-h-full ${disabled ? 'bg-pink-100' : ''}`}>
        </div>);
    }
}

const day = {
    startHour: 7, endHour: 23, step: 60, cellRenderer: ({height, start, onClick, ...props}) => {
        // Fake some condition up
        const day = start.getDay();
        const disabled = day === 0;
        // const restProps = disabled ? {} : props;
        return (<div className={`min-h-full ${disabled ? 'bg-pink-100' : ''} flex flex-row gap-2`}>
            <div className=" bg-red-600"></div>
            {/*<div></div>*/}
            {/*<div></div>*/}
        </div>);
    }, navigation: true
}

const month = {
    weekDays: [0, 1, 2, 3, 4, 5, 6],
    weekStartOn: 1,
    startHour: 7,
    endHour: 23,
    cellRenderer: ({height, start, onClick, ...props}) => {
        // Fake some condition up
        const day = start.getDay();
        const disabled = day === 0;
        // const restProps = disabled ? {} : props;
        return (<div className={`min-h-full ${disabled ? 'bg-pink-100' : ''} flex flex-row gap-2`}>
            <div className=" bg-red-600"></div>
            {/*<div></div>*/}
            {/*<div></div>*/}
        </div>);
    },
    navigation: true,
    disableGoToDay: false
}


function ConsultantCalendar() {

    const {events, setEvents, triggerLoading} = useScheduler();
    const [openPopup, setOpenPopup] = useState(false);
    const navigate = useNavigate();

    const addEvents = async (event, resetForm, newTreatment) => {
        triggerLoading(true);
        const addedEvent = await addConsultantEvent(event);
        setEvents([...events, addedEvent]);
        resetForm();
        setOpenPopup(false);
        fixStyle();
        triggerLoading(false);
    }

    const fixStyle = () => {
        const allEvents = document.querySelectorAll('.rs__event__item');
        for (let i = 0; i < allEvents.length - 1; i++) {
            if (allEvents[i].offsetLeft > 0) {
                if (allEvents[i + 1].offsetLeft !== 0) {
                    allEvents[i].style.left = '33%';
                    allEvents[i++].style.left = '66%';
                    i++;
                } else {
                    allEvents[i].style.left = '50%';
                }
            }
        }
    }


    const getAllConsultantEvents = async () => {
        let role = localStorage.getItem('Role');
        let gevents = ((await getConsultantEvents())).map(event => {
            return {
                ...event,
                start: (new Date(event.start.seconds * 1000)),
                end: new Date(event.end.seconds * 1000),
                deletable: role === 'Admin',
            }
        })
        setEvents(gevents);
    }

    const updateEvent = async (event) => {
        // await updateConsultantStatus(event, 'Completed');
        event.color='green'
        event.status='Completed'
        await updateConsultantEvent(event);
        await getAllConsultantEvents();
    }

    const cancelEvent = async (event) => {
        // await updateConsultantStatus(event, 'Canceled');
        event.color='red'
        event.status='Canceled'
        await updateConsultantEvent(event);
        await getAllConsultantEvents();
    }


    function applyCssBasedOnPosition() {
            var elements = document.querySelectorAll(".css-z3jy29 .rs__cell .rs__event__item");
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                var rect = element.getBoundingClientRect();
                let windowHeight = document.querySelectorAll('.css-z3jy29')[0];
                // var windowHeight = window.innerHeight || document.documentElement.clientHeight;
                // element.height='10px'
                if (element.offsetTop < (1200) /3) {
                    element.style.marginTop = "0px";
                } else if(element.offsetTop < (1200+(1200/3))/2) {
                    element.style.marginTop = "-10px";
                }else{
                    element.style.marginTop = "-17px";
                }
            }
    }

    useEffect(() => {
        getAllConsultantEvents();
    }, [0])

    useEffect(() => {
        if (events.length > 0) {
            fixStyle()
        }
    }, [events])
    useEffect(() => {
        const interval = setInterval(() => {
            fixStyle()
            applyCssBasedOnPosition();
        }, 500);
        return () => {
            clearInterval(interval);
        };
    }, [0])

    useEffect(() => {
        const user = localStorage.getItem('employee');
        if (!user) navigate("/login")
    }, [0]);

    return (<div>
        <Popup
            title="Events Form"
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
        >
            <ConsultantEventForm
                addItem={addEvents}
                openPopup={setOpenPopup}
                setEvents={setEvents}
                events={events}
                triggerLoading={triggerLoading}
            />
        </Popup>
        <div className="flex justify-between ">
            <div
                className="flex gap-4 justify-center bg-yellow-300 hover:bg-yellow-400 w-96 rounded-lg px-5 py-2.5 mb-2">
                <li className="text-green-400 font-bold">
                    Completed
                </li>
                <li className="text-gray-500 font-bold">
                    Reserved
                </li>
                <li className="text-red-600 font-bold">
                    Canceled
                </li>
            </div>
            <div>
                <button type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={() => navigate('/consultations/reports')}
                >Reports
                </button>
                <button type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={() => setOpenPopup(true)}
                >Add Booking
                </button>
            </div>

        </div>
        <Scheduler
            hourFormat={24}
            week={week}
            day={day}
            month={month}
            width={200}
            customEditor={(scheduler) => <CustomEditor scheduler={scheduler}/>}
            onDelete={(id) => deleteConsultantEvent(id)}
            viewerExtraComponent={(fields, event) => {
                return (<div>
                    <div className="mt-4">
                        <p>Client Name: {event.clientName} </p>
                        <p>Client Phone: {event.client}</p>
                        <p>Employee Name: {event.employee}</p>
                        <p>Comment: {event.comment}</p>
                    </div>
                    <div className="mt-4">
                        <button type="button"
                                disabled={event.status === 'Canceled'}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-30"
                                onClick={() => updateEvent(event)}
                        >Completed
                        </button>
                        <button type="button"
                                disabled={event.status === 'Completed'}
                                className=":outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 disabled:opacity-30"
                                onClick={() => cancelEvent(event)}
                        >Cancel
                        </button>
                    </div>
                </div>);
            }}
            eventRenderer={(event) => {
                return (<div id="eventRender" className="render-event-on-calender">
                        <Tooltip title={<Fragment>
                            <p>{event.title}</p>
                            <p>{event.clientName}</p>
                        </Fragment>}>
                            <div className="flex flex-col text-black">
                                <div
                                    className={`h-6 ${event.status === 'Completed' ? 'bg-green-200' : event.status === 'Canceled' ? 'bg-red-400' : 'bg-gray-200'}`}>
                                    {event.title}
                                </div>
                                <div className="text-sm">
                                    {event.clientName}
                                </div>
                            </div>
                        </Tooltip>
                    </div>

                );
            }}
        />
    </div>)

}


export default ConsultantCalendar