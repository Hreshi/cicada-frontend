import { useEffect, useState } from "react";

interface MessageBalloonProps {
  me: boolean;
  message: string;
  date: Date;
}

export default function MessageBalloon(props: MessageBalloonProps) {
  const [time, setTime] = useState("");
  //const [date,setDate]=useState(new Date());
  const { me, message, date } = props;

  // const date = new Date(datestring);

  const flexAlignItems = me ? "items-end" : "items-start";
  const backgroundColor = me
    ? "bg-purple-600 text-white transition-colors duration-300"
    : "bg-[#202c33] transition-colors duration-300";
  const borderRounded = me ? "rounded-tr-none" : "rounded-tl-none";

  return (
    <div className={`flex flex-col ${flexAlignItems} w-full h-max`}>
      <div
        className={`flex flex-col min-w-[5%] max-w-[65%] h-max ${backgroundColor} p-2 text-white rounded-lg ${borderRounded} mb-1`}
      >
        <div className="flex flex-col w-full break-words">
          <span>{message}</span>
        </div>
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
  );
}
