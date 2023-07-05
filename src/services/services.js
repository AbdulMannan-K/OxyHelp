import { doc,setDoc,getDoc,addDoc,getDocs,
    collection,deleteDoc,Timestamp,updateDoc } from "firebase/firestore";
import {db} from './firebase';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

let allEvents = []

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

        await axios.post('https://oxyadmin.gntcgroup.com/users', userData);
        return await getUsers();
    } catch (error) {
        console.error('Error adding document: ', error);
    }
};

export const delUser = async (user)=>{
    await axios.delete(`https://oxyadmin.gntcgroup.com/users/${user._id}`);
    return await getUsers();
}

export const updateUser = async (user)=> {
    console.log(user)
    await axios.put(`https://oxyadmin.gntcgroup.com/users/${user._id}`,user);
    return await getUsers();
}


export const getTreatment = async (treatment) => {
    console.log('hello')
    console.log('treatment : ',treatment)
    try {
        const response = await axios.get(`https://oxyadmin.gntcgroup.com/treatments/${treatment}`);
        const treatmentData = response.data;
        console.log('treatmentData : ',treatmentData)
        return { ...treatmentData, id: treatmentData.treatment_id };
    } catch (error) {
        console.error('Error getting treatment: ', error);
    }
};

export const getEvent = async (event_id) => {
    try {
        const response = await axios.get(`https://oxyadmin.gntcgroup.com/events/${event_id}`);
        const eventData = response.data;
        return { ...eventData, event_id: eventData._id };
    } catch (error) {
        console.error('Error getting event: ', error);
    }
};

export const addTreatment = async (treatment, event, user) => {
    try {
        const treatmentData = {
            treatmentId: uuid(),
            total: treatment,
            completed: 0,
            events: [event.event_id],
            currentRegistered: 1,
        };

        const response = await axios.post('https://oxyadmin.gntcgroup.com/treatments', treatmentData);
        console.log('response : ',response)
        const treatmentId = response.data.treatment_id;
        console.log('user : ',user)
        const userDocRef = await axios.get(`https://oxyadmin.gntcgroup.com/users/${user}`);
        const findUser = userDocRef.data;
        findUser.history.push(treatmentId);
        await axios.put(`https://oxyadmin.gntcgroup.com/users/${user}`, findUser);

        event.treatmentId = treatmentId;
        await updateStatus(event, event.status);
    } catch (error) {
        console.error('Error adding treatment: ', error);
    }
};

export const updateTreatment = async (treatment) => {
    try {
        const { treatment_id , total, completed, events, currentRegistered } = treatment;
        const updatedTreatment = {
            total,
            completed,
            events,
            currentRegistered,
        };

        await axios.put(`https://oxyadmin.gntcgroup.com/treatments/${treatment_id}`, updatedTreatment);
    } catch (error) {
        console.error('Error updating treatment: ', error);
    }
};

export const signUp = async (employee) => {
    try {
        const newEmployee = {
            email: employee.email,
            firstName: employee.firstName,
            secondName: employee.secondName,
            password: employee.password,
            role: employee.role,
        };

        await axios.post('https://oxyadmin.gntcgroup.com/employees', newEmployee);
    } catch (error) {
        console.error('Error adding employee: ', error);
    }
};

export const deleteEmployee = async (employee) => {
    try {
        await axios.delete(`https://oxyadmin.gntcgroup.com/employees/${employee}`);
    } catch (error) {
        console.error('Error deleting employee: ', error);
    }
};


export const getEmp = async (employeeId) => {
    try {
        const response = await axios.get(`https://oxyadmin.gntcgroup.com/employees/${employeeId}`);
        return response;
    } catch (error) {
        console.error('Error retrieving employee: ', error);
        return null;
    }
};

export const addMultipleEvents = async (events,user,newTreatment,treatments)=>{
    let treatmentId = '';
    try {
        const treatmentPayLoad = {
            treatmentId: uuid(),
            total:treatments,
            completed:0,
            events:[],
            currentRegistered: treatments
        }

        const treatment = await axios.post('https://oxyadmin.gntcgroup.com/treatments',treatmentPayLoad);
        const userData = (await axios.get(`https://oxyadmin.gntcgroup.com/users/${user}`)).data;
        console.log('treatment : ')
        console.log(treatment.data)
        userData.history.push(treatment.data.treatment_id);
        treatmentId=treatment.data.treatment_id;
        await updateUser(userData);
    } catch (e) {
        console.error("Error adding documenst: ", e);
    }

    const eventsDocRef = [];
    const eventsRefs = [];
    for(let i=0 ; i< treatments; i++){
        try{
            const eventPayLoad = {
                event_id: uuid(),
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

            const addedEvent = (await axios.post('https://oxyadmin.gntcgroup.com/capsules',eventPayLoad)).data;

            eventsDocRef.push(addedEvent.event_id);
            let role = localStorage.getItem('Role');


            events[i] = {...events[i], event_id:addedEvent.event_id, treatmentNumber: i+1,treatmentId:treatmentId, deletable:role==='Admin',completed: 0,total:events[i].treatment};
            eventsRefs.push({...events[i]});
            events[i] = {...events[i]};
        } catch (e){
            console.error("Error adding document : "+ e)
        }
    }
    allEvents.push(...eventsRefs)

    let treatment = (await axios.get(`https://oxyadmin.gntcgroup.com/treatments/${treatmentId}`)).data;
    // const treatment = getDoc(doc(db,"treatments",treatmentId));
    treatment= {...treatment,events:eventsDocRef};
    treatment = {...treatment, id:treatmentId};
    await updateTreatment(treatment);
    console.log(events);
    return events;
    // await addEventsInTreatment(treatments,eventsRefs,user)

}


export const addEvent = async (aEvent, user, newTreatment) => {
    try {
        const eventPayload = {
            event_id: uuid(),
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

        const response = await axios.post('https://oxyadmin.gntcgroup.com/capsules', eventPayload);
        const eventDocRef = response.data.event_id;
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

        console.log(eventToDisplay);
        return eventToDisplay;
    } catch (e) {
        console.error("Error adding document: ", e);
        return null;
    }
};

export const getEventsByDateRange = async (start, end, setEvents) => {
    // let eventsFiltered = allEvents.filter(event => (new Date(event.start)) >= start && (new Date(event.start)) <= end);
    let eventsFiltered = (await axios.post('https://oxyadmin.gntcgroup.com/capsules/dateRange',{start: start, end: end} )).data;

    const treatmentsResponse = await axios.get('https://oxyadmin.gntcgroup.com/treatments');

    const treatments = {};
    treatmentsResponse.data.forEach((treatment) => {
        treatments[treatment.treatment_id] = treatment;
    });


    const events = eventsFiltered.map((event) => {
        const treatmentData = treatments[event.treatmentId];

        if (treatmentData) {
            return {
                completed: treatmentData.completed,
                total: treatmentData.total,
                ...event,
            };
        } else {
            return {
                completed: 0,
                total: 0,
                ...event,
            };
        }
    });


    eventsFiltered = events.map(event => {
            return {
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
                deletable:true,
            }
        }
    );
    allEvents = eventsFiltered;
    setEvents(eventsFiltered);
}


export const getEvents = async () => {
    try {
        const eventsResponse = await axios.get('https://oxyadmin.gntcgroup.com/capsules');
        const treatmentsResponse = await axios.get('https://oxyadmin.gntcgroup.com/treatments');

        const treatments = {};
        treatmentsResponse.data.forEach((treatment) => {
            treatments[treatment.treatment_id] = treatment;
        });


        const events = eventsResponse.data.map((event) => {
            const eventId = event.event_id;
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

const getAll = async (docRefs) => {

    const docs = [];
    for(let i = 0; i < docRefs.length; i++){
        const treatment = await axios.get(`https://oxyadmin.gntcgroup.com/treatments/${docRefs[i]}`);
        if(!treatment.data) continue;
        docs.push(treatment.data);
    }

    return docs;
};

export const getEventsOfClients = async (docs) => {
    try {
        const treatments = await getAll(docs);

        const events = [];

        const eventRefs = treatments.flatMap((snap) => snap.events.map((eventId) => eventId));
        const eventResponses = await Promise.all(
            eventRefs.map((eventId) => axios.get(`https://oxyadmin.gntcgroup.com/capsules/${eventId}`))
        );

        for (let i = 0; i < eventResponses.length; i++) {
            const eventResponse = eventResponses[i];
            const eventSnapshot = eventResponse.data;
            const treatmentSnapshot = treatments.find((snap) => snap.events.includes(eventSnapshot.event_id));

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

export const updateStatus = async (aEvent, status) => {
    console.log('Update Event', aEvent)
    try {
        const eventData = {
            event_id: aEvent.event_id,
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

        let event = await axios.put(`https://oxyadmin.gntcgroup.com/capsules/${aEvent.event_id}`, eventData);
        console.log('Event updated: ', event.data);
    } catch (error) {
        console.error('Error updating event status: ', error);
    }
};

export const deleteEvent = async (event_id) => {
    try {
        const event = await axios.get(`https://oxyadmin.gntcgroup.com/capsules/${event_id}`);
        const eventData = event.data;

            const treatment = await axios.get(`https://oxyadmin.gntcgroup.com/treatments/${eventData.treatmentId}`);
            const treatmentData = treatment.data;
            console.log(treatmentData)
                treatmentData.events = treatmentData.events.filter(id => id !== event_id);
                await axios.put(`https://oxyadmin.gntcgroup.com/treatments/${treatmentData.treatment_id}`, treatmentData);

                if (treatmentData.events.length === 0) {

                    const user = await axios.get(`https://oxyadmin.gntcgroup.com/users/${eventData.clientId}`);
                    const userData = user.data;

                    for(let i = 0; i < userData.history.length; i++){
                        if(userData.history[i] === treatmentData.treatment_id){
                            userData.history.splice(i, 1);
                        }
                    }

                    await axios.put(`https://oxyadmin.gntcgroup.com/users/${userData._id}`, userData);
                    await axios.delete(`https://oxyadmin.gntcgroup.com/treatments/${treatmentData.treatment_id}`);
                }

        await axios.delete(`https://oxyadmin.gntcgroup.com/capsules/${event_id}`);

    } catch (error) {
        console.error('Error deleting event: ', error);
    }
};


export const getUsers = async () => {
    try {
        const response = await axios.get('https://oxyadmin.gntcgroup.com/users');
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

export const getAllEmployees = async (setRecords) => {
    try {
        const response = await axios.get('https://oxyadmin.gntcgroup.com/employees');
        const employees = response.data;
        setRecords(employees);
    } catch (error) {
        console.error('Error retrieving employees: ', error);
    }
};


export const getEmployees = async (setRecords)=>{

    const events = await axios.get('https://oxyadmin.gntcgroup.com/capsules');
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
