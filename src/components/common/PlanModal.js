import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { ModeContext } from "../../context/ThemeContext";
import { showModal } from "../../actions/PlanAction";

import logoDefault from "../../assets/images/logo_sidebar.png";
import logoLight from "../../assets/images/logoL.png";

const PlanModal = () => {
    const dispatch = useDispatch()
  const { darkMode, toggleDarkMode } = useContext(ModeContext);

  const closeModal = () => {
    dispatch(showModal(false))
  }

  return (
    <div className="plan-modal">
      <div className="plan-modal-overlay"></div>
      <div className="plan-modal-content">
        <button 
            className="btn btn-close-plan-modal"
            onClick={closeModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M11.668 12L1.668 2M11.668 2L1.66797 12"
              stroke="#575757"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <figure className="d-flex d-flex-column">
          <img src={darkMode ? logoDefault : logoLight} alt="" loading="lazy" />
          <span className="logoText">Your organic marketing best friend</span>
        </figure>
        <p>
          <span>In order to upgrade</span> your plan email Tier5 sales team on
        </p>
        <a href="mailto:sales@tier5.us">
          <svg
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.25 5.58359L9.5 10.0836L2.75 5.58359M4.25 14.5859H14.75C15.5784 14.5859 16.25 13.9144 16.25 13.0859V5.58594C16.25 4.75751 15.5784 4.08594 14.75 4.08594H4.25C3.42157 4.08594 2.75 4.75751 2.75 5.58594V13.0859C2.75 13.9144 3.42157 14.5859 4.25 14.5859Z"
              stroke="#8998B8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          sales@tier5.us
        </a>
      </div>
    </div>
  );
};

export default PlanModal;
