import { EmptyMessageSvg } from "../../assets/icons/Icons";

import "./style/_empty-message.scss";

const EmptyMessage = ({customText="Message box is empty! Get your typing fingers ready!"}) => {
    return (
        <div className="no-message-outer d-flex f-align-center f-justify-center">
            <div className="no-messages-found d-flex d-flex-column f-align-center f-justify-center">
                <figure >
                    <EmptyMessageSvg />
                </figure>
                <p>{customText}</p>
            </div>
        </div>
    );
};

export default EmptyMessage;