import React from 'react'
import { useSelector } from 'react-redux';
import { AddIcon } from '../../assets/icons/Icons'

function ListHeader({HeaderText,DataLength,AddFun}) {
  const isLoadingMessage = useSelector((state) => state.message.isLoading);
    /**@param args  HeaderText="string"*/
    /**@param args  DataLength="string" list data length*/
    /**@param args  AddFun=function() for add button*/
  return (
    <div className="message-left-nav-header">
        <div className="d-flex">
          {" "}
          <h4>{HeaderText}</h4>
          {(DataLength >0) &&
            <span className="num-header-count num-well">{DataLength}</span>
          }          
        </div>
        <button 
          className="btn add-new-message" 
          onClick={AddFun}
          // disabled={isLoadingMessage}
        >
          <figure>
           <AddIcon />
          </figure>
        </button>
      </div>
  )
}

export default ListHeader
