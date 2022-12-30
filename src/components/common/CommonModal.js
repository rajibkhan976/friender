import React from 'react'
import { XMarkIcon } from '../../assets/icons/Icons'

function CommonModal({headerText,modalIcon,bodyText,modalType,open,setOpen,btnText,ModalFun}) {
    
  return (
    <div className='modal-background' style={{display:open?"block":"none"}}>
        <div className='modal'>
          <div className='modal-content-wraper'>
              <span className='close-modal-comm'  onClick={()=>{setOpen(false)}}>
              <XMarkIcon/>

              </span>
                <div className={`modal-header ${modalType}`} >
                  <figure>
                   <img src={modalIcon} className="modal-icon" alt="" loading='lazy' />
                  </figure> {headerText}

                </div>
                <div className='modal-content'>{bodyText} </div>
                <div className='modal-buttons d-flex justifyContent-end'>
                   <button className='btn-primary outline' 
                   onClick={()=>{setOpen(false)}}> Close</button><button className="btn-primary unfriend " onClick={()=>{ModalFun()}}>{btnText}</button> 
                </div>
          </div>
        </div>
      
    </div>
  )
}

export default CommonModal
