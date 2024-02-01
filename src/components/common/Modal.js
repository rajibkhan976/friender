import React from "react";
import { XMarkIcon } from "../../assets/icons/Icons";

const Modal = ({
  headerText,
  modalIcon,
  bodyText,
  modalType,
  open,
  setOpen,
  closeBtnTxt = "Close",
  closeBtnFun = null,
  btnText,
  ModalFun,
  ModalIconElement,
  ExtraProps = {},
  modalButtons = true,
  additionalClass="",
  modalWithChild = false,
  children,
}) => {
  return (
    <div
      className={`modal-background ${additionalClass}`}
      style={{ display: open ? "block" : "none" }}
    // onClick={() => {
    //   setOpen(false);
    // }}
    >
      <div className="modal">
        <div className="modal-content-wraper">
          <span
            className="close-modal"
            onClick={() => {
              setOpen(false);
            }}
          >
            <XMarkIcon />
          </span>
          <div className={`modal-header d-flex f-align-center ${modalType}`}>
            {modalIcon && (
              <figure>
                <img src={modalIcon} className="modal-icon" alt="" loading='lazy' />
              </figure>
            )}
            {ModalIconElement && (
              <span
                className="icon-modal-comm"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <ModalIconElement />
              </span>
            )}
            <span style={{ color: modalType === "DELETE" ? '#FF6A77' : '#fff' }}>{headerText}</span>
          </div>
          <div className="modal-content">{bodyText} </div>

          {modalWithChild && <div className="modal-content">{children}</div>}

          {modalButtons && <div className="modal-buttons d-flex justifyContent-end">
            <button
              className="btn-primary outline"
              disabled={ExtraProps?.cancelBtnDisable}
              onClick={
                closeBtnFun
                  ? () => { closeBtnFun() }
                  : () => {
                    setOpen(false);
                  }
              }
            >
              {closeBtnTxt}
            </button>
            {ModalFun && (
              <button
                className={modalType === "DELETE" ? `btn-danger unfriend` : `btn-primary unfriend`}
                disabled={ExtraProps?.primaryBtnDisable}
                onClick={() => {
                  ModalFun();
                }}
              >
                {btnText}
              </button>
            )}
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
