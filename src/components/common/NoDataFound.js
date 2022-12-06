import Lottie from "react-lottie-player";
import noDataAnimation from '../../assets/animations/noDataAnimation.json';

import "../../assets/scss/component/common/_no_data_found.scss";

const NoDataFound = () => {
    return (
        <div className="no-data-found d-flex f-justify-center f-align-center d-flex-column">
                <figure>
                    <Lottie
                        animationData={noDataAnimation}
                        play
                        background="transparent"
                        style={{ width: "190px", height: "171px" }}
                    />
              </figure>
            <p>Nothing found yet!</p>
        </div>
    );
};

export default NoDataFound;