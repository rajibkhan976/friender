import { Outlet } from "react-router-dom";

import "./scss/_messages.scss"

const Messages = () => {
    return (        
        <div
            className="d-flex justifyContent-start fr-messages w-100"
        >
            <Outlet />
        </div>
    )
}

export default Messages