import { useContext, useEffect, useState } from "react";
import SignUp from "../components/auth/signup";
import { useRouter } from "next/router";

export default function Register() {
    const [isRegistered, setIsRegistered] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isRegistered) {
            userAuthorized().then((auth) => {
                if (auth) {
                    setIsRegistered(true)
                }
            })
        } else {
            router.push('/home');
        }
    })
    return (
        <>
            <SignUp isRegistered={isRegistered} setIsRegistered={setIsRegistered} />
        </>
    );
}
async function userAuthorized() {
    console.log("check")
    const token = sessionStorage.getItem('token');
    if (token == null) return false;
    const response = await fetch(
        'http://localhost:8080/api/ping',
        {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }
    );
    if (response.ok) {
        return true;
    }
    return false;
}