import {Scheduler, useScheduler} from "@aldabil/react-scheduler";
import React, {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {Button, ToggleButtonGroup, Tooltip} from "@mui/material";
import Popup from "../controls/Popup";
import EventForm from "./EventForm";
import {
    addEvent,
    deleteEvent,
    getEvents, getEventsByDateRange,
    getEventsOnDate,
    getTreatment,
    getUsers,
    updateStatus,
    updateTreatment
} from "../../services/services";
import {useNavigate} from "react-router-dom";
import CustomEditor from "./Form.tsx";
import axios from "axios";
import { doc,setDoc,getDoc,addDoc,getDocs,
    collection,deleteDoc,Timestamp,updateDoc } from "firebase/firestore";
import {db} from '../../services/firebase';

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

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
}
function WeekScheduler() {

    const {events, setEvents, triggerLoading,view} = useScheduler();
    const [openPopup, setOpenPopup] = useState(false);
    const update = useForceUpdate();
    const navigate = useNavigate();

    const addEvents = async (event, resetForm, newTreatment) => {
        triggerLoading(true);
        const addedEvent = await addEvent(event, event.clientId, newTreatment);
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

    function getMonthFromString(mon){
        return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
    }
    const getEventsByDate=(viewMode)=>{
        console.log(viewMode)
        if(viewMode=='month'){
            let dateString = (document.querySelectorAll('[data-testid=date-navigator]')[0].children[1].innerHTML)
            let month = getMonthFromString(dateString.split(' ')[0]) - 1
            let year = parseInt(dateString.split(' ')[1].split('<')[0])
            let startDateTime = new Date((year), (month-1), 25)
            let endDateTime = new Date((year), (month) + 1, 5)
            getEventsByDateRange(startDateTime, endDateTime, setEvents)
        }else if(viewMode=='week') {
            let dateString = (document.querySelectorAll('[data-testid=date-navigator]')[0].children[1].innerHTML)
            let day = parseInt(dateString.split(' ')[0])
            let end = parseInt(dateString.split(' ')[2].split('<')[0])
            let month = getMonthFromString(dateString.split(' ')[3]) - 1
            let year = parseInt(dateString.split(' ')[4].split('<')[0])
            if(day>end){
                month=month-1
            }
            let startDateTime = new Date((year), (month), (day))
            let endDateTime = new Date((year), (month), (day) + 7)
            getEventsByDateRange(startDateTime, endDateTime, setEvents)
        }else if(viewMode=='day'){
            let dateString = (document.querySelectorAll('[data-testid=date-navigator]')[0].children[1].innerHTML)
            let day = parseInt(dateString.split(' ')[0])
            let month = getMonthFromString(dateString.split(' ')[1]) - 1
            let year = parseInt(dateString.split(' ')[2].split('<')[0])
            let startDateTime = new Date((year), (month), (day))
            let endDateTime = new Date((year), (month), (day+1))
            getEventsByDateRange(startDateTime, endDateTime, setEvents)
        }
    }

    function useInterval(callback, delay) {
        const savedCallback = useRef();
        // Remember the latest callback.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    const updateEvent = async (event) => {
        const treatment = await getTreatment(event.treatmentId)
        treatment.completed++;
        await updateTreatment(treatment);
        await updateStatus(event, 'Completed');
        await getEventsByDate(view)
    }

    const cancelEvent = async (event) => {
        await updateStatus(event, 'Canceled');
        await getEventsByDate(view)
    }

    const deleteE = async (id) => {
        await deleteEvent(id);
        await getEventsByDate(view)
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
        getEventsByDate(view)
        let button1 = (document.querySelectorAll('[data-testid=date-navigator]')[0].children[0])
        let button2 = (document.querySelectorAll('[data-testid=date-navigator]')[0].children[2])
        button1.addEventListener('click', () => {
            setTimeout(() => {
                console.log('clicked')
                getEventsByDate(view)
            } , 500)
        })
        button2.addEventListener('click', () => {
            setTimeout(() => {
                console.log('clicked')

                getEventsByDate(view)
            } , 500)
        }
        )
    }, [0, view])

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
            <EventForm
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
            {/*<button*/}
            {/*    onClick={async () => {*/}
            {/*        const querySnapshot = await getDocs(collection(db, "clients"));*/}
            {/*        let users = [];*/}
            {/*        querySnapshot.forEach((doc) => {*/}
            {/*            users.push({*/}
            {/*                phoneNumber: doc.id,*/}
            {/*                ...(doc.data()),*/}
            {/*            })*/}
            {/*        });*/}

            {/*        // add all these users into mongodb using axios*/}
            {/*        users.forEach(async (user) => {*/}
            {/*            await axios.post('https://oxyadmin.gntcgroup.com/users', user)*/}
            {/*        })*/}

            {/*    }}*/}
            {/*>Export to mongodb clients</button>*/}
            {/*<button*/}
            {/*    onClick={async () => {*/}
            {/*      const querySnapshot = await getDocs(collection(db, "events"));*/}
            {/*        let events = [];*/}
            {/*        events = querySnapshot.docs.map(doc => {*/}
            {/*            const eventId = doc.id;*/}
            {/*            const eventData = doc.data();*/}
            {/*            return {*/}
            {/*                event_id: eventId,*/}
            {/*                ...eventData,*/}
            {/*                start: (new Date(eventData.start.seconds * 1000)),*/}
            {/*                end: new Date(eventData.end.seconds * 1000),*/}
            {/*                clientId: eventData.client,*/}
            {/*            };*/}
            {/*        });*/}

            {/*        // add all these events into mongodb using axios*/}
            {/*        events.forEach(async (event) => {*/}
            {/*            console.log(event)*/}
            {/*            await axios.post('https://oxyadmin.gntcgroup.com/capsules', event)*/}
            {/*        })*/}

            {/*    }}*/}
            {/*>Export to mongodb events</button>*/}
            {/*<button*/}
            {/*    onClick={async () => {*/}
            {/*        const querySnapshot = await getDocs(collection(db, "treatments"));*/}
            {/*        let treatments = [];*/}
            {/*        querySnapshot.forEach((doc) => {*/}
            {/*            treatments.push({*/}
            {/*                treatmentId: doc.id,*/}
            {/*                ...(doc.data()),*/}
            {/*            })*/}
            {/*        });*/}

            {/*        // add all these treatments into mongodb using axios*/}
            {/*        treatments.forEach(async (treatment) => {*/}
            {/*            await axios.post('https://oxyadmin.gntcgroup.com/treatments', treatment)*/}
            {/*        })*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Export to mongodb treatments*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={async () => {*/}
            {/*        const events = (await axios.get('https://oxyadmin.gntcgroup.com/capsules')).data;*/}
            {/*        const clients = (await axios.get('https://oxyadmin.gntcgroup.com/users')).data;*/}
            {/*        const updatedEvents = events.map((event) => {*/}
            {/*            const client = clients.find(client => client.phoneNumber === event.clientId);*/}
            {/*            return{*/}
            {/*                ...event,*/}
            {/*                clientId: client._id,*/}
            {/*            }*/}
            {/*        }*/}
            {/*        )*/}
            {/*        updatedEvents.forEach(async (event) => {*/}
            {/*            console.log(event)*/}
            {/*            await axios.put(`https://oxyadmin.gntcgroup.com/capsules/${event.event_id}`, event)*/}
            {/*        })*/}
            {/*    }}*/}
            {/*>*/}
            {/*    link client id to events*/}
            {/*</button>*/}
            <div>
                <button type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={() => setOpenPopup(true)}
                >Add Booking
                </button>
                <button type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={() => navigate('/consultations')}
                >Consultation
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
            onDelete={(id) => deleteE(id)}
            onSelectedDateChange={(date) => console.log(date)}
            viewerExtraComponent={(fields, event) => {
                return (<div>
                    <div className="mt-4">
                        <p>Client Name: {event.clientName} </p>
                        <p>Client Phone: {event.client}</p>
                        {event.otherClients.length !== 0 ? <p>Other Clients: </p> : <></>}
                        {event.otherClients.map(client => {
                            return <p>{client}</p>
                        })}
                        <p>Treatment Number: {event.treatmentNumber}/{event.treatment}</p>
                        <p>Completed : {event.completed}/{event.treatment}</p>
                        <p>Employee Name: {event.employee}</p>
                        <p>{event.meter?'Meter : '+event.meter:''}</p>
                        <p>Comment: {event.comment}</p>
                    </div>
                    <div className="mt-4">
                        <button type="button"
                                disabled={event.status === 'Canceled' || event.status === 'Completed'}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-30"
                                onClick={() => updateEvent(event)}
                        >Completed
                        </button>
                        <button type="button"
                                disabled={event.status === 'Completed' || event.status === 'Canceled'}
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
                            <p>{event.client}{event.otherClients.length !== 0 ? ` , ${event.otherClients.length} more` : ''}</p>
                        </Fragment>}>
                            <div className="flex flex-col text-black">
                                <div
                                    className={`h-6 ${event.status === 'Completed' ? 'bg-green-200' : event.status === 'Canceled' ? 'bg-red-400' : 'bg-gray-200'}`}>
                                    {event.title.split(" ")[1]}
                                </div>
                                <div className="text-sm">
                                    {event.clientName}{event.otherClients.length !== 0 ? ` , ${event.otherClients.length} more` : ''}
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