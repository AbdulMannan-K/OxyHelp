import { doc,setDoc,getDocs,collection } from "firebase/firestore";
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
            history:[],
        });
        console.log("Document written with ID: ", docRef);
        // user.id=docRef;
        return await getUsers();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const getUsers = async ()=> {
    const querySnapshot = await getDocs(collection(db, "clients"));
    console.log(typeof querySnapshot)
    let users = [];
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        users.push({
            phoneNumber:doc.id,
            ...(doc.data()),
        })
    });
    console.log(users);
    return users;
}