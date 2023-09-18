import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

function ListHeader({HeaderText,DataLength,AddFun,HeaderIcon,isLoading}) {
  const isLoadingMessage = useSelector((state) => state.message.isLoading);
    /**@param args  HeaderText="string"*/
    /**@param args  DataLength="string" list data length*/
    /**@param args  AddFun=function() for add button*/

  useEffect(() => {
    console.log(HeaderText, isLoading, isLoadingMessage);
  }, [isLoading, isLoadingMessage])
  return (
    <div className="message-left-nav-header d-flex justifyContent-spaceBetween">
      <h3 className='message-header-text d-flex f-align-center'>
        <figure><HeaderIcon/></figure>{HeaderText}<span className='num-header-count num-well'>{DataLength}</span>
      </h3>

      <button
        className='btn add-message btn-capsule'
        disabled={isLoading || isLoadingMessage}
        onClick={AddFun}
      >+ Add</button>
        {/* <div className="d-flex">
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
        </button>  */}
      </div>
  )
}

export default ListHeader
