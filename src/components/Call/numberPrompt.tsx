import * as React from "react";
import { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { useTheme } from "@mui/material/styles";


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
  );
  return keyPair;
}

// export key to base64 to transfer through ws
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
async function exportPublicKey(key) {
  let pubArrayBuffer = await window.crypto.subtle.exportKey("spki", key);
  const exportedAsString = ab2str(pubArrayBuffer);
  const exportedAsBase64 = window.btoa(exportedAsString);
  const key64 = exportedAsBase64;
  return key64;
}

async function exportPrivateKey(key) {
  const exported = await window.crypto.subtle.exportKey("pkcs8", key);
  const exportedAsString = ab2str(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);
  return exportedAsBase64;
}

async function generateImage(width, height) {
  const imageData = generateImageData(width, height);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);

  const blob = await toBlob(canvas);
  addImage(blob);
}

async function toBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(resolve, 'image/png', 1.0);
  });
}

function addImage(blob) {
  const imageLink = URL.createObjectURL(blob);
  sessionStorage.setItem('bloblink', imageLink);
  const image = document.createElement('img');
  image.src = imageLink;
  // document.body.appendChild(image);
  console.log('Image added');
}

function generateImageData(width, height) {
  const data = generatePixelArray(width * height);
  const imageData = new ImageData(data, width, height);
  return imageData;
}

function generatePixelArray(pixels) {
  const data = new Uint8ClampedArray(pixels * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = randomInt();
    data[i + 1] = randomInt();
    data[i + 2] = randomInt();
    data[i + 3] = 255;
  }
  return data;
}

function randomInt() {
  return Math.floor(Math.random() * 256);
}


function NumberPrompt({ setNumberPrompt, setPrivateKey, stompClient }) {
  const [open1, setOpen1] = React.useState(true);
  const [blobImage, setBlobImage] = React.useState("");
  const [generated, setGenerated] = React.useState(false)
  const [secret, setSecret] = React.useState("");
  const theme = useTheme();

  const handleInputChange = (event) => {
    setSecret(event.target.value);
  };
  const handleOnclickofStart = () => {
    setOpen1(false);
  };
  useEffect(() => {
    const generate = async () => {
      await generateImage(500, 500);

      var image = sessionStorage.getItem('bloblink');
      setBlobImage(image);
      setGenerated(true);
    }
    if(!generated) generate();

  }, [blobImage]);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
// event: React.FormEvent<HTMLFormElement>
  const handleSubmit = async () => {
    setOpen1(false);
    // event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // const sc = data.get("secret") as string;
    const sc = secret
    sessionStorage.setItem("secret-number", sc);
    console.log("NumberPrompt  :" + sc);

    const kp = await generateKeys();

    const privateKey = await exportPrivateKey(kp.privateKey);
    sessionStorage.setItem("private-key", privateKey);
    console.log(privateKey);

    const key64 = await exportPublicKey(kp.publicKey);
    console.log("NumberPrompt  :" + key64);

    // const content = await cipher(key64, parseInt(sc));
    // stompClient.send("/ms/secure", {}, content);
    const imageLink = sessionStorage.getItem('bloblink');
    const link = await cipher_data(imageLink, sc, key64);
    await uploadFile(link)
    
    setNumberPrompt(false);
  };
  async function uploadFile(blobLink) {
    try {
      const response = await fetch(blobLink);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('image', blob);
  
      const uploadResponse = await fetch('http://localhost:8080/api/stego/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token') as string
        },
        body: formData
      });
  
      if (uploadResponse.ok) {
        console.log('File uploaded successfully');
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        mt: 1,
        backgroundColor: "black",
        color: "white",
      }}
    >
      <Dialog
        fullScreen={fullScreen}
        open={open1}
        aria-labelledby="responsive-dialog-title"
        PaperProps={{
          style: {
            backgroundColor: "white",
            color: "black",
          },
        }}
      >

        <DialogContent>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid black" }}>
            <div style={{ width: "70%", borderRight: "1px solid black", padding: "20px" }}>
              <h1>Enter your secret code</h1>
              <TextField
                margin="normal"
                required
                fullWidth
                id="secret"
                label="Secret"
                name="secret"
                value = {secret}
                onChange={handleInputChange}
                InputProps={{
                  style: {
                    borderColor: "black",
                  },
                }}
                autoFocus
              />
            </div>
            {blobImage && <div style={{ width: "30%", padding: "15px" }}>
              <h4 style={{ fontSize: "10px" }}>Generated image</h4>
              <img
                src={blobImage}
                alt="placeholder"
                style={{ width: "100%" }}
              />
            </div>
            }
          </div>

        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f0f0f5' }}>
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "green",
              color: "black",
              borderColor: "green",
              "&:hover": {
                backgroundColor: "darkgreen",
                borderColor: "darkgreen",
              },
            }}
            fullWidth
          >
            Start
          </Button>
        </DialogActions>

      </Dialog>

    </Box>
  );
}
export default NumberPrompt;



// cipher data into image
// Given the url of image, secret and message cipher the message into image.

// 1) Get clamped array of bytes
// 2) Cipher data into array
// 3) Create an image with the updated array and return url


async function cipher_data(imageUrl, secret, message) {
  const img = await loadImageFromUrl(imageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixelBytes = imageData.data;
  const messageBytes = get_message_bytes(message);
  cipher(pixelBytes, messageBytes, secret);

  const imageLink = await createImage(pixelBytes, canvas.width, canvas.height);
  sessionStorage.setItem('link', imageLink);
  return imageLink;
}
async function createImage(pixelBytes, width, height) {
  const imageData = new ImageData(pixelBytes, width, height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
  const image = await blob(canvas);
  return URL.createObjectURL(image);
}
async function blob(canvas) {
  return new Promise((resolve, reject) => {
      canvas.toBlob(resolve, 'image/png', 1.0)
  });
}
function cipher(pixelBytes, messageBytes, secret) {
  const mod = Math.floor((pixelBytes.length - pixelBytes.length / 4) % 53);
  if (mod <= 0) console.log("Data larger than host data");

  let nextPosition = (value(secret) % mod) + 1;
  let realIndex = 0;

  for (let i = 0, j = 0; i < pixelBytes.length && j < messageBytes.length; i++) {
      if ((i + 1) % 4 == 0) continue;
      if (realIndex == nextPosition) {
          pixelBytes[i] = messageBytes[j++];
          nextPosition += (nextPosition && ((nextPosition << 1) || nextPosition)) % mod;
          nextPosition++;
      }
      realIndex++;
  }
}
function value(secret) {
  let ans = 1;
  for (let i = 0; i < secret.length; i++) {
      ans *= (secret.charCodeAt(i)) & (0b1111_1111);
      ans %= 1000000007;
  }
  return ans;
}
async function get_pixel_bytes(imageUrl) {
  const img = await loadImageFromUrl(imageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return imageData;
}

function loadImageFromUrl(imageUrl) {
  return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = imageUrl;
  });
}

function get_message_bytes(message) {
  let length = message.length;
  const bytes = new Uint8Array(length + 2);
  bytes[1] = (length & (0b1111_1111));
  length = length >> 8;
  bytes[0] = (length&(0b1111_1111));
  console.log(bytes[0]+" : " + bytes[1]);

  for (let i = 0; i < message.length; i++) {
      bytes[i + 2] = message.charCodeAt(i) & (0b1111_1111);
  }
  return bytes;
}