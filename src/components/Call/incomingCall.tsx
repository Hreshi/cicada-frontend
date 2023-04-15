import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";

function IncomingCall({
  setIncomingCall,
  setOngoingCall,
  setShowChat,
  setNumberPrompt,
}) {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();

  const handleOnclickofStart = () => {
    setOpen(false);
  };
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const token = sessionStorage.getItem("token");
  function handleAcceptCall() {
    const accept = async () => {
      const friend = await fetch(
        `http://localhost:8080/api/stego/request/accept`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (friend.ok) {
        const user = JSON.parse(JSON.stringify(await friend.json()));
        setOngoingCall(true);
        setShowChat(user.email as string);
        setNumberPrompt(true);
        sessionStorage.setItem("currentChat", user.email);
      }
      setIncomingCall(false);
    };
    accept();
  }
  function handleRejectCall() {
    const reject = async () => {
      await fetch(`http://localhost:8080/api/stego/request/reject`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };
    reject();
    setIncomingCall(false);
  }
  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
        PaperProps={{
          style: {
            backgroundColor: "white",
            color: "black",
          },
        }}
      >
        <DialogTitle id="responsive-dialog-title">
          {"Incoming Secret Chat Request from this user"}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={handleAcceptCall}
            sx={{ backgroundColor: "green", color: "green" }}
          >
            Accept
          </Button>
          <Button
            onClick={handleRejectCall}
            sx={{ backgroundColor: "red", color: "red" }}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default IncomingCall;
