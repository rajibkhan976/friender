import {lazy, Suspense } from "react"

import "../../assets/scss/component/common/_no_data_found.scss";

const NoDataFound = () => {
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
            <p>Nothing found yet!</p>
        </div>
    );
};

export default NoDataFound;