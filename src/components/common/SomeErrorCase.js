import { SomeErrorSVG } from "../../assets/icons/Icons";
import "../../assets/scss/component/common/_someErrorCase.scss"

const SomeErrorCase = ({additionalClass=""}) => {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className={`error-case-outer ${additionalClass}`}>
            <div className="error-case-body text-center">
                <figure>
                    <SomeErrorSVG />
                </figure>

                <h3>Unable to load data</h3>
                <p>
                    The server is currently having some issues, which means the page cannot load properly. Please refresh the page to try again.
                </p>
                <button 
                    className="btn btn-primary w-100"
                    onClick={handleRefresh}
                >Refresh page</button>
            </div>
        </div>
    );
}
 
export default SomeErrorCase;