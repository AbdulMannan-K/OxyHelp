import { doc,setDoc,getDoc,addDoc,getDocs,collection,deleteDoc } from "firebase/firestore";
import {db} from './firebase';
import {queries} from "@testing-library/react";

export const addUser = async (user) => {
    try {
        const docRef = await setDoc(doc(db, "clients",user.phoneNumber), {
            email:user.email,
            firstName:user.firstName.toUpperCase(),
            lastName:user.lastName.toUpperCase(),
            gender:user.gender.toUpperCase(),
            birthDay:user.birthDay.toUpperCase(),
            city:user.city.toUpperCase(),
            questionnaire:user.questionnaire,
            history:user.history,
        });
        console.log("Document    written with ID: ", docRef);
        // user.id=docRef;
        return await getUsers();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const getTreatment = async (treatment)=>{

    const docc = doc(db, "treatments", treatment);
    const docSnap = await getDoc(docc);
    let findTreatment = await docSnap.data();
    console.log('find treatment : ')
    console.log(findTreatment)
    findTreatment= {...findTreatment,id:docSnap.id};
    return findTreatment
}

export const getEvent = async (event_id)=>{
    const docc = doc(db, "events", event_id);
    const docSnap = await getDoc(docc);
    let findEvent = await docSnap.data();
    console.log('find Event : ')
    console.log(findEvent)
    findEvent= {...findEvent,event_id:docSnap.id};
    return findEvent;
}

export const addTreatment = async (treatment,event,user)=>{
    try {

        const docRef = await addDoc(collection(db, "treatments"), {
            total: treatment,
            completed: 0,
            events:[event],
            currentRegistered: 1,
        });
        console.log("Document written with ID: ", docRef);

        const docc = doc(db, "clients", user);
        const docSnap = await getDoc(docc);
        let findUser = docSnap.data();
        findUser= {...findUser,phoneNumber:docSnap.id};

        console.log('testing testing');
        console.log(findUser);
        // new treatment
        findUser.history.push(docRef.id);
        // prev treatment
        // findUser.history.push({total:aEvent.total,completed:aEvent.})

        // console.log(docSnap);
        await addUser(findUser);
    } catch (e) {
        console.error("Error adding documenst: ", e);
    }
}

export const addEventInTreatment = async (treatment,event) => {
    treatment.events.push(event);
    let newNumber = treatment.currentRegistered+1;
    console.log(treatment);
    try {
        await setDoc(doc(db, "treatments", treatment.id), {
            total: treatment.total,
            completed: treatment.completed,
            events:treatment.events,
            currentRegistered:newNumber,
        });
        console.log('done');
    }catch (e) {
        console.error(e);
    }
}

export const updateTreatment = async (treatment) => {
    try {
        await setDoc(doc(db, "treatments", treatment.id), {
            total: treatment.total,
            completed: treatment.completed,
            events:treatment.events,
            currentRegistered:treatment.currentRegistered,
        });
        console.log('done');
    }catch (e) {
        console.log(e);
    }
}

export const addEvent = async (aEvent,user,newTreatment)=>{
    console.log(aEvent.repTreatment)
    try {
        const docRef = await addDoc(collection(db, "events"), {
            title:aEvent.title,
            color:aEvent.color,
            start:aEvent.start,
            client:aEvent.client,
            employee:aEvent.employee,
            otherClients:aEvent.otherClients,
            status:aEvent.status,
            freeOfCost:aEvent.freeOfCost,
            treatment:aEvent.treatment,
            end:aEvent.end,
            deletable:true,
            clientName: aEvent.clientName,
            comment: aEvent.comment,
            treatmentNumber: newTreatment?1:parseInt(aEvent.repTreatment.currentRegistered)+1,
            payment: null,
        });
        console.log("Document written with ID: ", docRef);

        console.log('i am here')

        const docc = doc(db, "clients", user);
        const docSnap = await getDoc(docc);
        let findUser = docSnap.data();
        findUser= {...findUser,phoneNumber:docSnap.id};

        console.log('i am also here')
        // new treatment
        console.log('new treatment : ' + newTreatment)
        if(newTreatment){
            console.log("here new treatment ")
            await addTreatment(aEvent.treatment,docRef.id,user);
        }else{
            console.log("updating old Treatment ")
            await addEventInTreatment(aEvent.repTreatment,docRef.id)
        }
        // findUser.history.push({total:aEvent.treatment,completed:0,events:[docRef.id]});
        // prev treatment
        // findUser.history.push({total:aEvent.total,completed:aEvent.})

        // console.log(docSnap);
    } catch (e) {
        console.error("Error adding documenst: ", e);
    }
}


export const getEvents = async ()=> {
    const querySnapshot = await getDocs(collection(db, "events"));
    let events = [];
    querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        events.push({
            event_id:doc.id,
            ...(doc.data()),
        });
    });
    console.log('Events start')
    console.log(events);
    console.log('Events end')
    return events;
}

export const getEventsOnSpecificDate = async (date,capsule,client) => {
    let events = await getEvents();
    const dateString = (new Date(date)).toLocaleDateString();
    console.log('date : '+dateString)
    console.log(events)
    let dateEvents = [];
    for(let i =0 ; i < events.length; i++){
        console.log(events[i].title+'      '+capsule)
        if((new Date(events[i].start.seconds*1000)).toLocaleDateString()===dateString  &&  (events[i].title===capsule || events[i].client===client)){
            dateEvents.push((new Date(events[i].start.seconds*1000)).toLocaleTimeString())
        }
    }
    console.log(dateEvents)
    return dateEvents;
    // return events.filter(event => event.start.toLocaleDateString()===dateString);
}

export const getEventsOfClients = async (docs) => {
    let events=[];
    for(let i=0 ;i < docs.length ; i++){
        const docRef = doc(db, "treatments", docs[i]);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
        for(let j=0 ;j < docSnap.data().events.length ;j++){
            const docRefE = doc(db, "events", docSnap.data().events[j]);
            const docSnapE = await getDoc(docRefE);
            console.log(docSnapE.data());
            let completed = docSnap.data().completed
            let total = docSnap.data().total
            events.push({...docSnapE.data(),event_id:docSnap.data().events[j],completed:completed,total:total,treat_id:docRef.id});
        }
    }
    console.log(events);
    return events;
}

export const updateStatus = async (aEvent,status) => {
    try {
        await setDoc(doc(db, "events", aEvent.event_id), {
            title: aEvent.title,
            color: aEvent.color,
            start: aEvent.start,
            client: aEvent.client,
            employee: aEvent.employee,
            otherClients: aEvent.otherClients,
            status: status,
            freeOfCost: aEvent.freeOfCost,
            treatment: aEvent.treatment,
            end: aEvent.end,
            clientName: aEvent.clientName,
            deletable:(status !== 'Completed'),
            comment: aEvent.comment,
            payment: aEvent.payment,
        });
        console.log('done');
        return getEvents();
    }catch (e) {
        console.log(e);
    }
}

export const deleteEvent = async (event_id) => {
    await deleteDoc(doc(db, "events", event_id));
}

export const getUsers = async ()=> {
    const querySnapshot = await getDocs(collection(db, "clients"));
    // console.log(typeof querySnapshot)
    let users = [];
    querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        users.push({
            phoneNumber:doc.id,
            ...(doc.data()),
        })
    });
    console.log(users);
    return users;
}

export const getEventsFromTreatment = async (treatmentId)=>{

    const docRefT = doc(db,"treatments",treatmentId)
    const docSnapT = await getDoc(docRefT);

    let events=[];
    for(let i=0 ;i < docSnapT.data.events.length ; i++){
        const docRef = doc(db, "events", docSnapT.data.events[i]);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
        events.push(docSnap.data());
    }
    console.log(events);
    return events;

}

export const getEmployees = async (setRecords)=>{

    const querySnapshot = await getDocs(collection(db, "events"));
    // console.log(typeof querySnapshot)
    let employees = [];
    querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        employees.push({
            id:doc.id,
            ...(doc.data()),
        })
    });
    console.log(employees);
    setRecords(employees)

}