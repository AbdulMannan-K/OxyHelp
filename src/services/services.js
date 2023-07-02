import { doc,setDoc,getDoc,addDoc,getDocs,
    collection,deleteDoc,Timestamp,updateDoc } from "firebase/firestore";
import {db} from './firebase';
import axios from 'axios';

let allEvents = []

// export const addUser = async (user,serial) => {
//
//     try {
//         const docRef = await setDoc(doc(db, "clients",user.phoneNumber), {
//             serialNumber:serial?serial:user.serialNumber,
//             email:user.email,
//             firstName:user.firstName.toUpperCase(),
//             lastName:user.lastName.toUpperCase(),
//             gender:user.gender.toUpperCase(),
//             birthDay:user.birthDay.toUpperCase(),
//             city:user.city.toUpperCase(),
//             country:user.country.toUpperCase(),
//             questionnaire:user.questionnaire,
//             afterQues:user.afterQues,
//             beforeQues:user.beforeQues,
//             history:user.history,
//         });
//         return await getUsers();
//     } catch (e) {
//         console.error("Error adding document: ", e);
//     }
// }

export const addUser = async (user, serial) => {
    try {
        const userData = {
            serialNumber: serial ? serial : user.serialNumber,
            email: user.email,
            firstName: user.firstName.toUpperCase(),
            lastName: user.lastName.toUpperCase(),
            gender: user.gender.toUpperCase(),
            birthDay: user.birthDay.toUpperCase(),
            phoneNumber: user.phoneNumber,
            city: user.city.toUpperCase(),
            country: user.country.toUpperCase(),
            questionnaire: user.questionnaire,
            afterQues: user.afterQues,
            beforeQues: user.beforeQues,
            history: user.history
        };

        await axios.post('http://localhost:4000/users', userData);
        return await getUsers();
    } catch (error) {
        console.error('Error adding document: ', error);
    }
};

export const delUser = async (user)=>{
    await axios.delete(`http://localhost:4000/users/${user._id}`);
    return await getUsers();
}

export const updateUser = async (user)=> {
    console.log(user)
    await axios.put(`http://localhost:4000/users/${user._id}`,user);
    return await getUsers();
}


// export const getTreatment = async (treatment)=>{
//
//     const docc = doc(db, "treatments", treatment);
//     const docSnap = await getDoc(docc);
//     let findTreatment = await docSnap.data();
//     findTreatment= {...findTreatment,id:docSnap.id};
//     return findTreatment
// }


export const getTreatment = async (treatment) => {
    try {
        const response = await axios.get(`http://localhost:4000/treatments/${treatment}`);
        const treatmentData = response.data;
        return { ...treatmentData, id: treatmentData._id };
    } catch (error) {
        console.error('Error getting treatment: ', error);
    }
};

// export const getEvent = async (event_id)=>{
//     const docc = doc(db, "events", event_id);
//     const docSnap = await getDoc(docc);
//     let findEvent = await docSnap.data();
//     findEvent= {...findEvent,event_id:docSnap.id};
//     return findEvent;
// }

export const getEvent = async (event_id) => {
    try {
        const response = await axios.get(`http://localhost:4000/events/${event_id}`);
        const eventData = response.data;
        return { ...eventData, event_id: eventData._id };
    } catch (error) {
        console.error('Error getting event: ', error);
    }
};

// export const addTreatment = async (treatment,event,user)=>{
//     try {
//
//         const docRef = await addDoc(collection(db, "treatments"), {
//             total: treatment,
//             completed: 0,
//             events:[event.event_id],
//             currentRegistered: 1,
//         });
//         const docc = doc(db, "clients", user);
//         const docSnap = await getDoc(docc);
//         let findUser = docSnap.data();
//         findUser= {...findUser,phoneNumber:docSnap.id};
//         event.treatmentId = docRef.id;
//         // new treatment
//         findUser.history.push(docRef.id);
//         // prev treatment
//         // findUser.history.push({total:aEvent.total,completed:aEvent.})
//
//         await addUser(findUser);
//         await updateStatus(event,event.status)
//     } catch (e) {
//         console.error("Error adding documenst: ", e);
//     }
// }

// export const addTreatment = async (treatment,event,user)=>{
//     try {
//
//         const docRef = await addDoc(collection(db, "treatments"), {
//             total: treatment,
//             completed: 0,
//             events:[event.event_id],
//             currentRegistered: 1,
//         });
//         const docc = doc(db, "clients", user);
//         const docSnap = await getDoc(docc);
//         let findUser = docSnap.data();
//         findUser= {...findUser,phoneNumber:docSnap.id};
//         event.treatmentId = docRef.id;
//         // new treatment
//         findUser.history.push(docRef.id);
//         // prev treatment
//         // findUser.history.push({total:aEvent.total,completed:aEvent.})
//
//         await addUser(findUser);
//         await updateStatus(event,event.status)
//     } catch (e) {
//         console.error("Error adding documenst: ", e);
//     }
// }

export const addTreatment = async (treatment, event, user) => {
    try {
        const treatmentData = {
            total: treatment,
            completed: 0,
            events: [event.event_id],
            currentRegistered: 1,
        };

        const response = await axios.post('http://localhost:4000/treatments', treatmentData);
        const treatmentId = response.data._id;
        console.log('user : ',user)
        const userDocRef = await axios.get(`http://localhost:4000/users/${user}`);
        const findUser = userDocRef.data;
        findUser.history.push(treatmentId);
        await axios.put(`http://localhost:4000/users/${user}`, findUser);

        event.treatmentId = treatmentId;
        await updateStatus(event, event.status);
    } catch (error) {
        console.error('Error adding treatment: ', error);
    }
};


// export const updateTreatment = async (treatment) => {
//     try {
//         await setDoc(doc(db, "treatments", treatment.id), {
//             total: treatment.total,
//             completed: treatment.completed,
//             events:treatment.events,
//             currentRegistered: treatment.currentRegistered,
//         });
//     }catch (e) {
//         console.log(e);
//     }
// }


export const updateTreatment = async (treatment) => {
    try {
        const { id, total, completed, events, currentRegistered } = treatment;
        const updatedTreatment = {
            total,
            completed,
            events,
            currentRegistered,
        };

        await axios.put(`http://localhost:4000/treatments/${id}`, updatedTreatment);
    } catch (error) {
        console.error('Error updating treatment: ', error);
    }
};


// export const signUp = async (user) => {
//     try {
//         const docRef = await setDoc(doc(db, "users",user.email), {
//             email:user.email,
//             firstName:user.firstName,
//             secondName:user.secondName,
//             password:user.password,
//             role:user.role,
//             uid:user.uid
//         });
//     } catch (e) {
//         console.error("Error adding document: ", e);
//     }
// }

export const signUp = async (employee) => {
    try {
        const newEmployee = {
            email: employee.email,
            firstName: employee.firstName,
            secondName: employee.secondName,
            password: employee.password,
            role: employee.role,
        };

        await axios.post('http://localhost:4000/employees', newEmployee);
    } catch (error) {
        console.error('Error adding employee: ', error);
    }
};


// export const deleteEmployee = async (employee) => {
//     try {
//         await deleteDoc(doc(db, "users", employee));
//     } catch (e) {
//         console.error("Error adding document: ", e);
//     }
// }

export const deleteEmployee = async (employee) => {
    try {
        await axios.delete(`http://localhost:4000/employees/${employee}`);
    } catch (error) {
        console.error('Error deleting employee: ', error);
    }
};


// export const getEmp= async (emp) => {
//     const docc = doc(db, "users", emp);
//     const docSnap = await getDoc(docc);
//     let findEmp = docSnap.data();
//     return findEmp;
// }

export const getEmp = async (employeeId) => {
    try {
        const response = await axios.get(`http://localhost:4000/employees/${employeeId}`);
        console.log(response)
        return response.data[0];
    } catch (error) {
        console.error('Error retrieving employee: ', error);
        return null;
    }
};


// export const addMultipleEvents = async (events,user,newTreatment,treatments)=>{
//     let treatmentId = '';
//     try {
//         const docRef = await addDoc(collection(db, "treatments"), {
//             total: treatments,
//             completed: 0,
//             events:[],
//             currentRegistered: treatments,
//         });
//         const docc = doc(db, "clients", user);
//         const docSnap = await getDoc(docc);
//         let findUser = docSnap.data();
//         findUser= {...findUser,phoneNumber:docSnap.id};
//         findUser.history.push(docRef.id);
//         treatmentId=docRef.id;
//         await addUser(findUser);
//     } catch (e) {
//         console.error("Error adding documenst: ", e);
//     }
//
//     const eventsDocRef = [];
//     const eventsRefs = [];
//     for(let i=0 ; i< treatments; i++){
//         try{
//             const docRef = await addDoc(collection(db,"events"),{
//                 title:events[i].title,
//                 color:events[i].color,
//                 start:events[i].start,
//                 date:events[i].start.toLocaleDateString(),
//                 client:events[i].client,
//                 employee:events[i].employee,
//                 otherClients:events[i].otherClients,
//                 status:events[i].status,
//                 freeOfCost:events[i].freeOfCost,
//                 treatment:events[i].treatment,
//                 end:events[i].end,
//                 deletable:true,
//                 clientName: events[i].clientName,
//                 comment: events[i].comment,
//                 treatmentNumber: i+1,
//                 payment: null,
//                 treatmentId: treatmentId,
//             });
//             eventsDocRef.push(docRef.id);
//             let role = localStorage.getItem('Role');
//
//
//             events[i] = {...events[i], event_id:docRef.id, treatmentNumber: i+1,treatmentId:treatmentId, deletable:role==='Admin',completed: 0,total:events[i].treatment};
//             const startTimeStamp = Timestamp.fromDate(events[i].start);
//             const endTimeStamp = Timestamp.fromDate(events[i].end);
//             eventsRefs.push({...events[i],start:startTimeStamp,end:endTimeStamp});
//             events[i] = {...events[i], start:startTimeStamp.toDate(), end:endTimeStamp.toDate()};
//         } catch (e){
//             console.error("Error adding document : "+ e)
//         }
//     }
//     allEvents.push(...eventsRefs)
//     const treatment = getDoc(doc(db,"treatments",treatmentId));
//     let treatmentData = (await treatment).data();
//     treatmentData.events = (eventsDocRef);
//     treatmentData = {...treatmentData, id:treatmentId};
//     await updateTreatment(treatmentData);
//     console.log(events);
//     return events;
//     // await addEventsInTreatment(treatments,eventsRefs,user)
//
// }


export const addMultipleEvents = async (events,user,newTreatment,treatments)=>{
    let treatmentId = '';
    try {
        const treatmentPayLoad = {
            total:treatments,
            completed:0,
            events:[],
            currentRegistered: treatments
        }

        const treatment = await axios.post('http://localhost:4000/treatments',treatmentPayLoad);
        const userData = (await axios.get(`http://localhost:4000/users/${user}`)).data;
        console.log('treatment : ')
        console.log(treatment.data)
        userData.history.push(treatment.data._id);
        treatmentId=treatment.data._id;
        await updateUser(userData);
    } catch (e) {
        console.error("Error adding documenst: ", e);
    }

    const eventsDocRef = [];
    const eventsRefs = [];
    for(let i=0 ; i< treatments; i++){
        try{
            const eventPayLoad = {
                title:events[i].title,
                color:events[i].color,
                start:events[i].start,
                date:events[i].start.toLocaleDateString(),
                client:events[i].client,
                employee:events[i].employee,
                otherClients:events[i].otherClients,
                status:events[i].status,
                freeOfCost:events[i].freeOfCost,
                treatment:events[i].treatment,
                end:events[i].end,
                deletable:true,
                clientName: events[i].clientName,
                comment: events[i].comment,
                treatmentNumber: i+1,
                clientId:events[i].clientId,
                payment: null,
                treatmentId: treatmentId,
            }

            const addedEvent = (await axios.post('http://localhost:4000/capsules',eventPayLoad)).data;

            eventsDocRef.push(addedEvent._id);
            let role = localStorage.getItem('Role');


            events[i] = {...events[i], event_id:addedEvent._id, treatmentNumber: i+1,treatmentId:treatmentId, deletable:role==='Admin',completed: 0,total:events[i].treatment};
            eventsRefs.push({...events[i]});
            events[i] = {...events[i]};
        } catch (e){
            console.error("Error adding document : "+ e)
        }
    }
    allEvents.push(...eventsRefs)

    let treatment = (await axios.get(`http://localhost:4000/treatments/${treatmentId}`)).data;
    // const treatment = getDoc(doc(db,"treatments",treatmentId));
    treatment.events = (eventsDocRef);
    treatment = {...treatment, id:treatmentId};
    await updateTreatment(treatment);
    console.log(events);
    return events;
    // await addEventsInTreatment(treatments,eventsRefs,user)

}

export const addConsultantEvent = async (aEvent,user)=>{
    try {
        const docRef = await addDoc(collection(db, "consultantEvents"), {
            title:aEvent.title,
            start:aEvent.start,
            date:aEvent.start.toLocaleDateString(),
            client:aEvent.client,
            employee:aEvent.employee,
            status:aEvent.status,
            freeOfCost:aEvent.freeOfCost,
            end:aEvent.end,
            deletable:true,
            clientName: aEvent.clientName,
            comment: aEvent.comment,
        });
        return aEvent;
    } catch (e) {
        console.error("Error adding documenst: ", e);
    }
}

// export const addEvent = async (aEvent,user,newTreatment)=>{
//     try {
//         const docRef = await addDoc(collection(db, "events"), {
//             title:aEvent.title,
//             color:aEvent.color,
//             start:aEvent.start,
//             date:aEvent.start.toLocaleDateString(),
//             client:aEvent.client,
//             employee:aEvent.employee,
//             otherClients:aEvent.otherClients,
//             status:aEvent.status,
//             freeOfCost:aEvent.freeOfCost,
//             treatment:aEvent.treatment,
//             end:aEvent.end,
//             deletable:true,
//             clientName: aEvent.clientName,
//             comment: aEvent.comment,
//             meter:aEvent.meter,
//             treatmentNumber: newTreatment?1:parseInt(aEvent.repTreatment.currentRegistered)+1,
//             payment: null,
//             treatmentId: null,
//         });
//         let role = localStorage.getItem('Role');
//
//         aEvent = {...aEvent,event_id:docRef.id,treatmentNumber: newTreatment?1:parseInt(aEvent.repTreatment.currentRegistered)+1,deletable:role === 'Admin'};
//         // new treatment
//         await addTreatment(aEvent.treatment,aEvent,user);
//
//         let eventToDisplay = JSON.parse(JSON.stringify(aEvent))
//
//         const startTimeStamp = Timestamp.fromDate(aEvent.start);
//         const endTimeStamp = Timestamp.fromDate(aEvent.end);
//         aEvent = {...aEvent,start:startTimeStamp,end:endTimeStamp}
//         allEvents.push(aEvent);
//         console.log('Hello Testing')
//         console.log(allEvents)
//         eventToDisplay = {...eventToDisplay, start:startTimeStamp.toDate(),end:endTimeStamp.toDate(),completed:0,total:aEvent.treatment}
//         console.log(eventToDisplay)
//         return eventToDisplay;
//     } catch (e) {
//         console.error("Error adding documenst: ", e);
//     }
// }

export const addEvent = async (aEvent, user, newTreatment) => {
    console.log('A Event')
    console.log(aEvent)
    try {
        const eventPayload = {
            title: aEvent.title,
            color: aEvent.color,
            start: aEvent.start,
            date: aEvent.start.toLocaleDateString(),
            client: aEvent.client,
            employee: aEvent.employee,
            otherClients: aEvent.otherClients,
            status: aEvent.status,
            freeOfCost: aEvent.freeOfCost,
            treatment: aEvent.treatment,
            end: aEvent.end,
            deletable: true,
            clientName: aEvent.clientName,
            comment: aEvent.comment? aEvent.comment : ' ',
            clientId: aEvent.clientId,
            meter: aEvent.meter,
            treatmentNumber: newTreatment ? 1 : parseInt(aEvent.repTreatment.currentRegistered) + 1,
            payment: null,
            treatmentId: null,
        };

        console.log('eventPayLoad',eventPayload)

        const response = await axios.post('http://localhost:4000/capsules', eventPayload);
        const eventDocRef = response.data._id;
        let role = localStorage.getItem('Role');

        aEvent = {
            ...aEvent,
            event_id: eventDocRef,
            treatmentNumber: newTreatment ? 1 : parseInt(aEvent.repTreatment.currentRegistered) + 1,
            deletable: role === 'Admin',
        };

        if (newTreatment) {
            await addTreatment(aEvent.treatment, aEvent, user);
        }

        allEvents.push(aEvent);

        const eventToDisplay = {
            ...aEvent,
            completed: 0,
            total: aEvent.treatment,
        };

        console.log(allEvents);
        console.log(eventToDisplay);
        return eventToDisplay;
    } catch (e) {
        console.error("Error adding document: ", e);
        return null;
    }
};

export const getEventsByDateRange = (start,end,setEvents) => {
    let eventsFiltered = allEvents.filter(event => (new Date(event.start)) >= start && (new Date(event.start)) <= end);
    eventsFiltered = eventsFiltered.map(event => {
        return {
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
        }
    }
    );
    setEvents(eventsFiltered);
}

export const getConsultantEvents = async (setRecords)=> {
    const eventsSnapshot = await getDocs(collection(db, "consultantEvents"));
    const events = eventsSnapshot.docs.map(doc => {
        const eventId = doc.id;
        const eventData = doc.data();
        return {
            event_id: eventId,
            ...eventData
        };
    });
    return events;
}

// export const getEvents = async ()=> {
//     const eventsSnapshot = await getDocs(collection(db, "events"));
//     const treatmentsSnapshot = await getDocs((collection(db, "treatments")));
//
//     const treatments = {};
//     treatmentsSnapshot.docs.forEach(doc => {
//         treatments[doc.id] = doc.data();
//     });
//
//     const events = eventsSnapshot.docs.map(doc => {
//         const eventId = doc.id;
//         const eventData = doc.data();
//         const treatmentData = treatments[eventData.treatmentId];
//         if(treatmentData) {
//             return {
//                 event_id: eventId,
//                 completed: treatmentData.completed,
//                 total: treatmentData.total,
//                 ...eventData
//             };
//         }else{
//             return {
//                 event_id: eventId,
//                 completed: 0,
//                 total: 0,
//                 ...eventData
//             };
//         }
//     });
//
//     allEvents=events;
//     return events;
// }

export const getEvents = async () => {
    try {
        const eventsResponse = await axios.get('http://localhost:4000/capsules');
        const treatmentsResponse = await axios.get('http://localhost:4000/treatments');

        const treatments = {};
        treatmentsResponse.data.forEach((treatment) => {
            treatments[treatment._id] = treatment;
        });

        const events = eventsResponse.data.map((event) => {
            const eventId = event._id;
            const treatmentData = treatments[event.treatmentId];

            if (treatmentData) {
                return {
                    event_id: eventId,
                    completed: treatmentData.completed,
                    total: treatmentData.total,
                    ...event,
                };
            } else {
                return {
                    event_id: eventId,
                    completed: 0,
                    total: 0,
                    ...event,
                };
            }
        });

        allEvents = events;
        console.log(events)
        return events;
    } catch (error) {
        console.error('Error fetching events: ', error);
        return [];
    }
};


export const getConsultantEventsOnSpecificDate = async (date) => {
    const eventsSnapshot = await getDocs(collection(db, "consultantEvents"));
    const cEvents = eventsSnapshot.docs.map(doc => {
        const eventId = doc.id;
        const eventData = doc.data();
        return {
            event_id: eventId,
            ...eventData
        };
    });
    const dateString = (new Date(date)).toLocaleDateString();
    let dateEvents = [];
    for(let i =0 ; i < cEvents.length; i++){
        if((new Date(cEvents[i].start.seconds*1000)).toLocaleDateString()===dateString ){
            dateEvents.push((new Date(cEvents[i].start.seconds*1000)).toLocaleTimeString())
        }
    }
    return dateEvents;
}

// export const getEventsOnSpecificDate = async (date,capsule,client) => {
//     let events = allEvents
//     const dateString = (new Date(date)).toLocaleDateString();
//     let dateEvents = [];
//     for(let i =0 ; i < events.length; i++){
//         if((new Date(events[i].start.seconds*1000)).toLocaleDateString()===dateString  &&  (events[i].title===capsule || events[i].client===client)){
//             dateEvents.push((new Date(events[i].start.seconds*1000)).toLocaleTimeString())
//         }
//     }
//     return dateEvents;
//     // return events.filter(event => event.start.toLocaleDateString()===dateString);
// }

export const getEventsOnSpecificDate = async (date,capsule,client) => {
    let events = allEvents
    const dateString = (new Date(date)).toLocaleDateString();
    let dateEvents = [];
    for(let i =0 ; i < events.length; i++){
        if((new Date(events[i].start)).toLocaleDateString()===dateString  &&  (events[i].title===capsule || events[i].client===client)){
            dateEvents.push((new Date(events[i].start)).toLocaleTimeString())
        }
    }
    return dateEvents;
    // return events.filter(event => event.start.toLocaleDateString()===dateString);
}

// const getAll = async (docRefs) => {
//     console.log('here here')
//     const promises = docRefs.map((ref) => getDoc(ref));
//     const snapshots = await Promise.all(promises);
//     const docs = snapshots.map  ((snapshot) => {
//         return {
//             id: snapshot.id,
//             ...snapshot.data(),
//         };
//     });
//     return docs;
// };
//
// export const getEventsOfClients = async (docs) => {
//     const docRefs = docs.map((docId) => doc(db, "treatments", docId));
//     const snapshots = await getAll(docRefs);
//
//     const events = [];
//
//     const eventRefs = snapshots.flatMap((snap) => snap.events.map((eventId) => doc(db, "events", eventId)));
//     const eventSnapshots = await Promise.all(eventRefs.map((ref) => getDoc(ref)));
//
//     for (let i = 0; i < eventSnapshots.length; i++) {
//         const eventSnapshot = eventSnapshots[i];
//         const treatmentSnapshot = snapshots.find((snap) => snap.events.includes(eventSnapshot.id));
//         if (!treatmentSnapshot) {
//             continue;
//         }
//         const treatmentData = treatmentSnapshot;
//         const eventCompleted = treatmentData.completed;
//         const eventTotal = treatmentData.total;
//
//         events.push({
//             ...eventSnapshot.data(),
//             event_id: eventSnapshot.id,
//             completed: eventCompleted,
//             total: eventTotal,
//             treat_id: treatmentSnapshot.id,
//         });
//     }
//
//     console.log(events)
//     return events;
// };

const getAll = async (docRefs) => {
    const promises = docRefs.map((ref) => axios.get(`http://localhost:4000/treatments/${ref}`));
    const responses = await Promise.all(promises);
    const docs = responses.map((response) => {
        return {
            id: response.data.id,
            ...response.data.data,
        };
    });
    return docs;
};

export const getEventsOfClients = async (docs) => {
    try {
        const docRefs = docs.map((docId) => docId);
        const snapshots = await getAll(docRefs);

        const events = [];

        const eventRefs = snapshots.flatMap((snap) => snap.events.map((eventId) => eventId));
        const eventResponses = await Promise.all(
            eventRefs.map((eventId) => axios.get(`http://localhost:4000/events/${eventId}`))
        );

        for (let i = 0; i < eventResponses.length; i++) {
            const eventResponse = eventResponses[i];
            const eventSnapshot = eventResponse.data;
            const treatmentSnapshot = snapshots.find((snap) => snap.events.includes(eventSnapshot.event_id));

            if (!treatmentSnapshot) {
                continue;
            }

            const eventCompleted = treatmentSnapshot.completed;
            const eventTotal = treatmentSnapshot.total;

            events.push({
                ...eventSnapshot,
                completed: eventCompleted,
                total: eventTotal,
                treat_id: treatmentSnapshot.id,
            });
        }

        console.log(events);
        return events;
    } catch (error) {
        console.error('Error fetching events of clients: ', error);
        return [];
    }
};


const getColor = (capsule,employee)=> {
    if(employee=='yes') return '#FCA5A5'
    else {
        if (capsule === 'Kapsula 999') return '#FB923C'
        if (capsule === 'Kapsula 99') return '#FEF08A'
        if (capsule === 'Kapsula 9') return '#4ADE80'
    }
}


// export const updateStatus = async (aEvent,status) => {
//     try {
//         await setDoc(doc(db, "events", aEvent.event_id), {
//             title: aEvent.title,
//             color: getColor(aEvent.title,aEvent.freeOfCost),
//             start: aEvent.start,
//             client: aEvent.client,
//             date:aEvent.start.toLocaleDateString(),
//             employee: aEvent.employee,
//             otherClients: aEvent.otherClients,
//             status: status,
//             freeOfCost: aEvent.freeOfCost,
//             treatment: aEvent.treatment,
//             end: aEvent.end,
//             clientName: aEvent.clientName,
//             deletable:(status !== 'Completed'),
//             comment: aEvent.comment,
//             meter: aEvent.meter? aEvent.meter : 0,
//             payment: aEvent.payment? aEvent.payment : null,
//             treatmentNumber: aEvent.treatmentNumber,
//             treatmentId: aEvent.treatmentId
//         });
//     }catch (e) {
//         console.error(e);
//     }
//     let event = allEvents.find(e => e.event_id === aEvent.event_id);
//     event.start=aEvent.start;
//     event.end=aEvent.end;
//     event.status=status;
//
// }

export const updateStatus = async (aEvent, status) => {
    try {
        const eventData = {
            title: aEvent.title,
            color: getColor(aEvent.title, aEvent.freeOfCost),
            start: aEvent.start,
            client: aEvent.client,
            date: aEvent.start.toLocaleDateString(),
            employee: aEvent.employee,
            otherClients: aEvent.otherClients,
            status: status,
            freeOfCost: aEvent.freeOfCost,
            treatment: aEvent.treatment,
            end: aEvent.end,
            clientName: aEvent.clientName,
            deletable: (status !== 'Completed'),
            comment: aEvent.comment,
            meter: aEvent.meter ? aEvent.meter : 0,
            payment: aEvent.payment ? aEvent.payment : null,
            clientId: aEvent.clientId,
            treatmentNumber: aEvent.treatmentNumber,
            treatmentId: aEvent.treatmentId
        };

        await axios.put(`http://localhost:4000/capsules/${aEvent.event_id}`, eventData);

        let event = allEvents.find(e => e.event_id === aEvent.event_id);
        event.start = aEvent.start;
        event.end = aEvent.end;
        event.status = status;
    } catch (error) {
        console.error('Error updating event status: ', error);
    }
};


// export const deleteEvent = async (event_id) => {
//
//     const docRef = doc(db, "events", event_id);
//     const docSnap = await getDoc(docRef);
//
//     const userRef = doc(db,"clients",docSnap.data().client)
//     const userSnap = await getDoc(userRef);
//
//     for(let i=0 ; i< userSnap.data().history.length ; i++){
//         const treatRef = doc(db,"treatments",userSnap.data().history[i])
//         const treatDoc = await getDoc(treatRef);
//         console.log(treatDoc.data())
//         for(let j=0 ;j < treatDoc.data().events.length ; j++){
//             if(treatDoc.data().events[j]===event_id){
//                 let treatment = treatDoc.data();
//                 // treatment.events.remove(event_id)
//                 treatment.events.splice(j, 1);
//                 treatment= {...treatment,id:treatDoc.id};
//                 await updateTreatment(treatment);
//                 if(treatDoc.data().events.length===1) {
//                     let user = userSnap.data();
//                     user.history.splice(i,1)
//                     user = {...user,phoneNumber:userSnap.id};
//                     console.log(user)
//                     await addUser(user);
//                     await deleteDoc(doc(db, "treatments", treatDoc.id))
//                 }
//                 break;
//             }
//         }
//     }
//     await deleteDoc(doc(db, "events", event_id));
//     allEvents = allEvents.filter(element => element !== docSnap.data());
// }

export const deleteEvent = async (event_id) => {
    try {
        const event = await axios.get(`http://localhost:4000/capsules/${event_id}`);
        const eventData = event.data;

        const user = await axios.get(`http://localhost:4000/users/${eventData.clientId}`);
        const userData = user.data;

        for (let i = 0; i < userData.history.length; i++) {
            const treatment = await axios.get(`http://localhost:4000/treatments/${userData.history[i]}`);
            const treatmentData = treatment.data;

            if (treatmentData.events.includes(event_id)) {
                treatmentData.events = treatmentData.events.filter(id => id !== event_id);
                await axios.put(`http://localhost:4000/treatments/${treatmentData._id}`, treatmentData);

                console.log('Length : ',treatmentData.events.length);

                if (treatmentData.events.length === 0) {
                    console.log('History : ',userData.history);

                    userData.history.splice(i, 1);

                    console.log('History1 : ',userData.history);

                    await axios.put(`http://localhost:4000/users/${userData._id}`, userData);
                    await axios.delete(`http://localhost:4000/treatments/${treatmentData._id}`);
                }
                break;
            }
        }

        await axios.delete(`http://localhost:4000/capsules/${event_id}`);

        allEvents = allEvents.filter(element => element !== eventData);
    } catch (error) {
        console.error('Error deleting event: ', error);
    }
};


// export const getUsers = async ()=> {
//     const querySnapshot = await getDocs(collection(db, "clients"));
//     let users = [];
//     querySnapshot.forEach((doc) => {
//         users.push({
//             phoneNumber:doc.id,
//             ...(doc.data()),
//         })
//     });
//     return users;
// }

export const getUsers = async () => {
    try {
        const response = await axios.get('http://localhost:4000/users');
        let users = response.data;
        users = users.map((user,index) => {
            return {
                nr:index + 1,
                ...user,
            }
        })
        return users;
    } catch (error) {
        console.error('Error getting users: ', error);
        return [];
    }
};

// export const getAllEmployees = async (setRecords)=>{
//     const querySnapshot = await getDocs(collection(db, "users"));
//     let employees = [];
//     querySnapshot.forEach((doc) => {
//         employees.push({
//             id:doc.id,
//             ...(doc.data()),
//         })
//     });
//     setRecords(employees)
//
// }


export const getAllEmployees = async (setRecords) => {
    try {
        const response = await axios.get('http://localhost:4000/employees');
        const employees = response.data;
        setRecords(employees);
    } catch (error) {
        console.error('Error retrieving employees: ', error);
    }
};


export const getEmployees = async (setRecords)=>{

    const events = await axios.get('http://localhost:4000/capsules');
    console.log(events.data)
    let employees = [];
    events.data.forEach((doc) => {
        employees.push({
            id:doc.event_id,
            ...(doc),
        })
    });

    console.log(employees)
    setRecords(employees)

}

export const deleteConsultantEvent = async (event_id) => {
    try {
        const consultantEvent = doc(db, "consultantEvents", event_id);
        const consultantEventSnap = await getDoc(consultantEvent);
        const consultantEventDoc = consultantEventSnap.data();
        await deleteDoc(doc(db, "consultantEvents", event_id));
        const docc = doc(db, "clients", consultantEventDoc.client );
        const docSnap = await getDoc(docc);
        let findUser = docSnap.data();
        findUser= {...findUser,phoneNumber:docSnap.id};
        findUser.consultantHistory = findUser.consultantHistory.filter((event)=>event!==event_id);
        await addUser(findUser);
        return event_id;
    } catch (e) {
        console.error("Error removing document: ", e);
    }
}

export const updateConsultantEvent = async (event) => {
    try {
        const docRef = doc(db, "consultantEvents", event.event_id);
        await updateDoc(docRef, {
            title:event.title,
            start:event.start,
            date:event.start.toLocaleDateString(),
            client:event.client,
            employee:event.employee,
            status:event.status,
            freeOfCost:event.freeOfCost,
            end:event.end,
            deletable:true,
            clientName: event.clientName,
            comment: event.comment,
        });
        return event;
    } catch (e) {
        console.error("Error updating document: ", e);
    }
}
