function OutgoingCall({ setOutgoingCall }) {
    const token = sessionStorage.getItem('token');
    function handleAbort() {
        const abort = async () => {
            await fetch(
                'http://localhost:8080/api/stego/call/end',
                {
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
        }
        abort();
        setOutgoingCall(false);
    }
    return (
        <div className="flex justify-center items-center v-screen ">
            <div className="bg-white p-8 rounded-lg shadow-lg float-right mx-auto">
                <button onClick={handleAbort}>Abort</button>
            </div>
        </div>
    )
}
export default OutgoingCall;