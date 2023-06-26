import React, { useState, useEffect } from "react";
import {
  Cross2
} from '../../assets/icons/Icons';
import "../../assets/scss/component/common/_kewords.scss"

const Keywords = (props) => {
  const [reFrndngInput2, setReFrndngInput2] = useState('');
  const [modify, setModify] = useState(true);
  const { reFrndngKeywords, setFrndngKeywords, isModified } = props;

  /**
   * Hook for maintaining Modify Keywords Input..
   */
  useEffect(() => {
    console.log(reFrndngKeywords.length);
    if (!isModified) {
      if (reFrndngKeywords.length) {
        setModify(false);
      }
    }
    if (isModified) {
      setModify(true);
    }
  }, [isModified]);

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
    const newKeywords = keyword.split(/[,]+/).map((KW) => KW.trim());
    const filteredKeywords = newKeywords.filter((KW) => KW !== '');
    const uniqueKeywords = filteredKeywords.filter((KW) => {
      const lowercaseKW = KW.toLowerCase();
      return !reFrndngKeywords.toLowerCase().split(',').some((existingKW) => {
        return existingKW.trim().toLowerCase() === lowercaseKW || existingKW.trim().toLowerCase().includes(` ${lowercaseKW}`);
      });
    });

    if (uniqueKeywords.length > 0) {
      const updatedKeywords = reFrndngKeywords ? `${reFrndngKeywords}, ${uniqueKeywords.join(',')}` : uniqueKeywords.join(',');
      setFrndngKeywords(updatedKeywords);
    }

    setReFrndngInput2('');
  };




  const removeKeyword = (keyword) => {
    // For String Case..
    const updatedKeywords = reFrndngKeywords.split(',').filter((KW) => KW.trim() !== keyword.trim()).join(',');
    setFrndngKeywords(updatedKeywords);

    // For Array Case..
    // setReFrndngKeywords(reFrndngKeywords.filter((KW) => KW !== keyword));
  };


  console.log("Modified -- ", modify);

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
        placeholder={!modify ? '' : 'Add keyword'}
        disabled={!modify}
        value={reFrndngInput2}
        onChange={(e) => {
          setReFrndngInput2(e.target.value);
        }}
        onMouseDown={props.onMouseDownHandler}
        onKeyDown={handleKeywordsInputKeyDown}
      />
    </div>
  );
}
export default Keywords;