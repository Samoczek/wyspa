const Chat = ({descendingOrderMessages}) => {
    return (
        <>
            <div className="chat-display">
                {descendingOrderMessages.map((message, _index) => (
                    <div key={_index}>
                            <p>{message.name}</p>

                        <p>{message.message}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Chat