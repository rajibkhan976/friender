import { lazy, Suspense } from "react"

import "../../assets/scss/component/common/_no_data_found.scss";

const NoDataFound = ({ customText = "Nothing found yet!", additionalText, isInteraction = null, interactionText }) => {
    const NoDataDefault = lazy(() => import('../../assets/animations/components/NoDataDefault'));
    const NoDataLight = lazy(() => import('../../assets/animations/components/NoDataLight'));

    return (
        <div className="no-data-found d-flex f-justify-center f-align-center d-flex-column">
            <figure className="dark-theme">
                <Suspense fallback={""}>
                    <NoDataDefault
                        play
                        background="transparent"
                        style={{ width: "190px", height: "171px" }}
                    />
                </Suspense>
            </figure>
            <figure className="light-theme">
                <Suspense fallback={""}>
                    <NoDataLight
                        play
                        background="transparent"
                        style={{ width: "190px", height: "171px" }}
                    />
                </Suspense>
            </figure>
            <p>{customText}</p>
            {additionalText && <span style={{ fontSize: "18px", fontWeight: "400", textAlign: "center", marginTop: "10px" }}>{additionalText}</span>}
            {isInteraction && <button className="btn-primary no-data-button" onClick={isInteraction}>{interactionText}</button>}
        </div>
    );
};
export default NoDataFound;