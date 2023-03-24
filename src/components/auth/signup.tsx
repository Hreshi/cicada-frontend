import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const jwt = require("jsonwebtoken");
import AvatarChooser from "./avatarchooser"; // import the AvatarChooser component
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { useRouter } from "next/router";
import { useRouter } from "next/router";
import { json } from "stream/consumers";
import { LocalAtm } from "@material-ui/icons";

const theme = createTheme();

async function sendRegistrationRequest(data: {
  name: string;
  email: string;
  password: string;
  avatar: File;
}) {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("name", data.name);
  formData.append("password", data.password);

  formData.append("avatar", data.avatar);
  console.log()
  try {
    const response = await fetch("http://localhost:8080/api/register", {
      method: "POST",
      body: formData,
    });

    console.log(JSON.stringify(response));

    if (!response.ok) {
      toast.error("Registration failed! may be because email already exists..");
      console.error("Failed to register");
    }

    if (response.ok) {
      toast.success("Registration successful!");
      toast.success("Redirecting to chats..");

      const token = await response.text();

      sessionStorage.setItem("userEmail", formData.get('email') as string);
      sessionStorage.setItem("token", JSON.stringify(token));
      //const router = useRouter();
      //router.push('/home')
      
    }
  } catch (error) {
    console.error(error);
  }
}

export default function SignUp({ isRegistered, setisRegistered }) {
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null); // add state to hold the chosen avatar file

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setAvatarFile(event.target.files[0]);
    }
  }; // add a function to handle changes in the chosen file

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // data.append(
    //   "avatarfile",
    //   "https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg"
    // ); // add the avatar file to the form data

    try {
      const response = await sendRegistrationRequest({
        name: data.get("name") as string,
        email: data.get("email") as string,
        password: data.get("password") as string,
        avatar: avatarFile as File,
      });

      // do something with the token or redirect to another page
      setisRegistered(true);
    } catch (error) {
      console.error(error);
      // handle the error
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="name" // update the ID of the name field to avoid conflict
              label="Name"
              name="name" // update the name of the name field
              autoComplete="name" // update the autocomplete value of the name field
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <AvatarChooser onChange={handleAvatarChange} file={avatarFile} />{" "}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Already registered? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
