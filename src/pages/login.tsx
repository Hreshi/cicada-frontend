import { useContext, useEffect, useState } from "react";
import LoginScreen from "../components/auth/login";
import { useRouter } from "next/router";
import { trueColor } from "@cloudinary/url-gen/qualifiers/colorSpace";


export default function Login() {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(()=> {
        userAuthorized().then((auth) => {
            if(auth) {
                setIsLoggedIn(true)
                router.push("/home");
            }
        })
    })
    return (
        <>
            <LoginScreen isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </>
    );
}
async function userAuthorized() {
    const token = sessionStorage.getItem('token');
    if (!token) return false;
    const response = await fetch(
        'http://localhost:8080/api/ping',
        {
            method: 'get',
            headers: {
                Authorization: 'Bearer ' + token,
            }
        }
    );
    if (response.ok) {
        return true;
    }
    return false;
}