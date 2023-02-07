import { doc,setDoc,getDoc,addDoc,getDocs,collection,deleteDoc } from "firebase/firestore";
import {db} from './firebase';

export const addUser = async (user) => {
    try {
        const docRef = await setDoc(doc(db, "clients",user.phoneNumber), {
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName,
            gender:user.gender,
            birthDay:user.birthDay,
            city:user.city,
            questionnaire:user.questionnaire,
            history:user.history,
        });
        // console.log("Document written with ID: ", docRef);
        // user.id=docRef;
        return await getUsers();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const addEvent = async (aEvent,user)=>{
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
        });
        console.log("Document written with ID: ", docRef);

        const docc = doc(db, "clients", user);
        const docSnap = await getDoc(docc);
        let findUser = docSnap.data();
        findUser= {...findUser,phoneNumber:docSnap.id};
        findUser.history.push(docRef.id);
        // console.log(docSnap);
        await addUser(findUser);
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
            // deletable:(doc.data().deletable !== 'false'),
        });
    });
    console.log('Events start')
    console.log(events);
    console.log('Events end')
    return events;
}

export const getEventsOnSpecificDate = async (date,capsule) => {
    let events = await getEvents();
    const dateString = (new Date(date)).toLocaleDateString();
    console.log('date : '+dateString)
    console.log(events)
    let dateEvents = [];
    for(let i =0 ; i < events.length; i++){
        console.log(events[i].title+'      '+capsule)
        if((new Date(events[i].start.seconds*1000)).toLocaleDateString()===dateString  &&  events[i].title===capsule){
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
        const docRef = doc(db, "events", docs[i]);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
        events.push(docSnap.data());
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
    // console.log(users);
    return users;
}