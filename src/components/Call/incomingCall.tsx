function IncomingCall({setIncomingCall, setOngoingCall}) {
    const token = sessionStorage.getItem('token');
    function handleAcceptCall() {
        const accept = async () => {
            const friend = await fetch(
                `http://localhost:8080/api/stego/request/accept`,
                {
                    method:'post',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            if(friend.ok) {
                setOngoingCall(true);
            }
            setIncomingCall(false);
        }
        accept();
    }
    function handleRejectCall() {
        const reject = async () => {
            await fetch(
                `http://localhost:8080/api/stego/request/reject`,
                {
                    method:'post',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
        }
        reject();
        setIncomingCall(false);
    }
    return (
        <div className="flex justify-center items-center v-screen ">
            <div className="bg-white p-8 rounded-lg shadow-lg float-right mx-auto">
                <button onClick={handleAcceptCall}>Accept</button>
                <button onClick={handleRejectCall}>Reject</button>
            </div>
        </div>
    )
}
export default IncomingCall;