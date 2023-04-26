import { forwardRef, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { TextField } from "@mui/material";

interface MessageBalloonProps {
  me: boolean;
  message: string;
  date: Date;
  messageType: string;
  imageLink:string;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function MessageBalloon(props: MessageBalloonProps) {
  const [time, setTime] = useState("");
  // const messageType = "image";
  //  const messageType = Math.random() < 0.5 ? "text" : "image";

  const [open,setOpen]=useState(false);

  //const [date,setDate]=useState(new Date());

  //  const { me, message, date, messageType } = props;

  const { me, message, date, messageType, imageLink } = props;

  // const date = new Date(datestring);

 const flexAlignItems = me ? "items-end" : "items-start";
  const backgroundColor = me
    ? "bg-purple-600 text-white transition-colors duration-300"
    : "bg-[#202c33] transition-colors duration-300";
  const borderRounded = me ? "rounded-tr-none" : "rounded-tl-none";

//you can add your decryption code here for specific image url, and then set the decrypted message to the message variable
//also if you want to show image without encryption , you have to make a different messageType which will not invoke dialogbox 
  return (
    <>
      { messageType === "image" &&    <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Encrypted Message "}{message}</DialogTitle>
      

        <div style={{ padding: "16px" }}>
         <h6>this is encrypted message lorem ipsum dolor amar set amet</h6>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "16px",
          }}
        >
          <Button onClick={()=>setOpen(false)} color="error">Close</Button>

        </div>
      </Dialog>}
    <div className={`flex flex-col ${flexAlignItems} w-full h-max`}>
      <div
        className={`flex flex-col min-w-[5%] max-w-[65%] h-max ${backgroundColor} p-2 text-white rounded-lg ${borderRounded} mb-1`}
      >
        {messageType === "image" ? (
          <img
            src={imageLink}
            alt="attachment preview"
            className="max-w-full max-h-60 object-contain rounded-lg"
            onClick={()=>setOpen(true)}
          />
        ) : (
          <div className="flex flex-col w-full break-words">
            <span>{message}</span>
          </div>
        )}
        <div className="flex justify-end text-[hsla(0,0%,100%,0.6)] text-xs ">
          <span>
            {new Date(date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
        </div>
      </div>
    </div>
    </>
  );
}
