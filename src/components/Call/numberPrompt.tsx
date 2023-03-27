import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function NumberPrompt({ setNumberPrompt, setPrivateKey, stompClient }) {

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const sc = data.get('secret') as string;
        sessionStorage.setItem('secret-number', sc);
        console.log('NumberPrompt  :' + sc);


        const kp = await generateKeys();

        const privateKey = await exportPrivateKey(kp.privateKey);
        sessionStorage.setItem('private-key', privateKey);
        console.log(privateKey);

        const key64 = await exportPublicKey(kp.publicKey);
        console.log('NumberPrompt  :' + key64);


        const content = await cipher(key64, parseInt(sc));
        stompClient.send(
            '/ms/secure',
            {},
            content
        );
        setNumberPrompt(false);
    }
    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="secret"
                label="Secret number"
                name="secret"
                autoFocus
            />
            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Start
            </Button>
        </Box>
    )
}
export default NumberPrompt;






async function generateKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
            hash: { name: "SHA-256" },
        },
        true,
        ["encrypt", "decrypt"]
    )
    return keyPair;
}

// export key to base64 to transfer through ws
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}
async function exportPublicKey(key) {
    let pubArrayBuffer = await window.crypto.subtle.exportKey(
        "spki",
        key
    );
    const exportedAsString = ab2str(pubArrayBuffer);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const key64 = exportedAsBase64
    return key64;
}

// cipher into random data

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const HOST_SIZE = 10000;
async function cipher(data64, secret) {
    const lengthString = getLengthString(data64.length);
    let current_number = operation(secret);

    const result = new Array(HOST_SIZE);
    let index = 0;
    data64 = lengthString + data64;

    for (let i = 0; i < HOST_SIZE; i++) {
        result[i] = generateRandomBase64Char();
        if (index < data64.length && i == current_number) {
            result[i] = data64.charAt(index++);
            current_number += operation(current_number);
        }
    }
    return result.join('');
}

function getLengthString(len) {
    let lengthString = len + "";
    while (lengthString.length < 4) {
        lengthString = "0" + lengthString;
    }
    return lengthString;
}
function generateRandomBase64Char() {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
}
function operation(num) {
    num += (num && ((num << 1) || num));
    num %= 17;
    num++;
    return num;
}
async function exportPrivateKey(key) {
    const exported = await window.crypto.subtle.exportKey("pkcs8", key);
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    return exportedAsBase64;
}