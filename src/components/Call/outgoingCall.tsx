import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

function OutgoingCall({ setOutgoingCall }) {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const token = sessionStorage.getItem("token");
  function handleAbort() {
    const abort = async () => {
      await fetch("http://localhost:8080/api/stego/call/end", {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };
    abort();
    setOutgoingCall(false);
  }
  return (
    <>
      <div className="flex justify-center items-center v-screen ">
        {/* <div className="bg-white p-8 rounded-lg shadow-lg float-right mx-auto">
          <button onClick={handleAbort}>Abort</button>
        </div> */}

        <Dialog
          fullScreen={fullScreen}
          open={open}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Ongoing Secret Chat Request"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
             We are trying to connect you to the other user. Please wait....
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAbort} autoFocus >
              Abort
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
export default OutgoingCall;
