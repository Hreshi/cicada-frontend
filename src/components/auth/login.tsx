import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
const jwt = require("jsonwebtoken");
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const theme = createTheme();

export default function LoginScreen({isLoggedIn,setIsLoggedIn}) {




  
  
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

 
  
  event.preventDefault();

  
  const data = new FormData(event.currentTarget);
  console.log({
    email: data.get('email'),
    password: data.get('password'),
  });

  const formData = new FormData();

  formData.append("email", data.get('email') as string);
  formData.append("password", data.get('password') as string);


  try {
    const response = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      toast.error("Failed to login");
      console.error('Failed to login');
      return;
    }

    console.log('Logged in successfully');
    toast.success("Logged in successfully");
    // const { token } = await response.json();
    // const decodedToken = jwt.decode(token);
    // console.log(decodedToken.sub);
    
    const token = await response.text();

    sessionStorage.setItem("userEmail", data.get('email') as string);
    sessionStorage.setItem("token", token);

  setIsLoggedIn(true);
   
    //redirect to /home
  } catch (error) {
    console.error(error);
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
       
      </Container>
    </ThemeProvider>
  );
}