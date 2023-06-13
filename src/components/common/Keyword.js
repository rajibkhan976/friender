import React, { useState } from "react";
import {
  Cross2
} from '../../assets/icons/Icons';
import "../../assets/scss/component/common/_kewords.scss"

const Keywords = (props) => {
  const [reFrndngInput2, setReFrndngInput2] = useState('');
  const { reFrndngKeywords, setFrndngKeywords, isModified } = props;

  const handleKeywordsInputKeyDown = (event) => {
    if (event.key === 'Enter' && reFrndngInput2.trim() !== '') {
      event.preventDefault();
      addKeywords(reFrndngInput2.trim());

    } else if (event.key === 'Enter' && reFrndngInput2.trim() === '') {
      event.preventDefault();

    } else if (event.key === ',' || event.key === 'Comma') {
      event.preventDefault();
      addKeywords(reFrndngInput2.trim());
    }
  };

  const addKeywords = (keyword) => {
    // For String Case..
    const newKeywords = keyword.split(/[,]+/).map((KW) => KW.trim());
    const filteredKeywords = newKeywords.filter((KW) => KW !== '');

    if (filteredKeywords.length > 0) {
      const updatedKeywords = reFrndngKeywords ? `${reFrndngKeywords}, ${filteredKeywords.join(',')}`: filteredKeywords.join(',');
      setFrndngKeywords(updatedKeywords);
    }

    // For Array Case..
    // const newKeywords = keyword.split(',').map((keyword) => keyword.trim());
    // const filteredKeywords = newKeywords.filter(keyword => keyword !== '');

    // if (filteredKeywords.length > 0) {
    //   setReFrndngKeywords([...reFrndngKeywords, ...filteredKeywords]);
    // }

    setReFrndngInput2('');
  };

  const removeKeyword = (keyword) => {
    // For String Case..
    const updatedKeywords = reFrndngKeywords.split(',').filter((KW) => KW.trim() !== keyword.trim()).join(',');
    setFrndngKeywords(updatedKeywords);

    // For Array Case..
    // setReFrndngKeywords(reFrndngKeywords.filter((KW) => KW !== keyword));
  };

  return (
    <div className="inputBlock">
      {
        reFrndngKeywords?.length > 0 && reFrndngKeywords.split(',').map(keyword => {
          return (
            <div className={!isModified ? 'keywords-static' : 'keywords'} key={keyword}>
              {keyword} {isModified && <button className="cross" onClick={() => removeKeyword(keyword)}><Cross2 /></button>}
            </div>
          );    
        })
      }
      
      <textarea
        className="keyword-input"
        placeholder="Add keyword"
        value={reFrndngInput2}
        onChange={(e) => {
          setReFrndngInput2(e.target.value);
        }}
        disabled={!isModified}
        onMouseDown={props.onMouseDownHandler}
        onBlur={props.onBlurHandler}
        onMouseOut={props.onMouseOut}
        onKeyDown={handleKeywordsInputKeyDown}
      />
    </div>
  );
}
export default Keywords;