import { useContext, useEffect, useState } from "react";
import SignUp from "../components/auth/signup";
import { useRouter } from "next/router";

export default function Register() {
    const [isRegistered, setisRegistered] = useState(false);
    const router = useRouter();
    
    useEffect(()=> {
        userAuthorized().then((auth) => {
            if(auth) {
                setisRegistered(true)
                console.log("register succesfull")
                router.push('/home');
            }
        })
    })
    return (
        <>
            <SignUp isRegistered={isRegistered} setisRegistered={setisRegistered}/>
        </>
    );
}
async function userAuthorized() {
    const token = sessionStorage.getItem('token');
    if(token == null) return false;
    const response = await fetch(
        'http://localhost:8080/api/ping',
        {
            method:'get',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }
    );
    if(response.ok) {
        return true;
    }
    return false;
}