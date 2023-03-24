import React from 'react'

const IconHome = () => (
    <div className="flex flex-col w-full h-full items-center justify-center">
      
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-[#e9edef] text-3xl font-extralight">
          Cicada: Experience a new level of encryption
        </h1>
        <div className="flex flex-col mt-4 w-11/12 text-center text-[#8696a0] text-base font-light">
         
          <h2>
          Cicada is an innovative security application that uses image-based encryption to send keys securely over the network, ensuring end-to-end encryption and maximum security for your sensitive data. 
          </h2>
        </div>
        <div className="my-6 border-b-[1px] border-[rgba(134,150,160,0.15)] w-full"></div>

        <div className="flex gap-2 text-[#8696a0]">
          <svg viewBox="0 0 21 18" width="21" height="18">
            <path
              fill="currentColor"
              d="M10.426 14.235a.767.767 0 0 1-.765-.765c0-.421.344-.765.765-.765s.765.344.765.765-.344.765-.765.765zM4.309 3.529h12.235v8.412H4.309V3.529zm12.235 9.942c.841 0 1.522-.688 1.522-1.529l.008-8.412c0-.842-.689-1.53-1.53-1.53H4.309c-.841 0-1.53.688-1.53 1.529v8.412c0 .841.688 1.529 1.529 1.529H1.25c0 .842.688 1.53 1.529 1.53h15.294c.841 0 1.529-.688 1.529-1.529h-3.058z"
            ></path>
          </svg>
          <span className="text-sm font-light">
          With Cicada, you can be sure that your data is protected from prying eyes and cyber attacks.
           
             
           
          </span>
        </div>
      </div>
    </div>
  );

  export default IconHome;