import { useContext, useEffect, useState } from "react";
import LoginScreen from "../components/auth/login";
import { useRouter } from "next/router";
import { trueColor } from "@cloudinary/url-gen/qualifiers/colorSpace";


export default function Login() {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(()=> {
        if(isLoggedIn) {
            router.push('/home');
        } else {
            userAuthorized().then((auth) => {
                if(auth) {
                    setIsLoggedIn(true)
                }
            });
        }
    })
    return (
        <>
            <LoginScreen isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </>
    );
}
async function userAuthorized() {
    console.log("check")
    const token = sessionStorage.getItem('token');
    if (!token) return false;
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/ping`,
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
