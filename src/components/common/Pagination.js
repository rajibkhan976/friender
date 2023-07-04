import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import "../../assets/scss/component/common/_pagination.scss"

const Pagination = ({ pageNum, itemsPerPage, onNumClick }) => {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    // console.log("This the pagination com[p]",pageNum)
    setCurrentItems([...Array(Number(pageNum)).keys()].slice(itemOffset, endOffset));
    setPageCount(Math.ceil([...Array(Number(pageNum)).keys()].length / itemsPerPage));
  }, [itemOffset, itemsPerPage, pageNum]);

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage % [...Array(Number(pageNum)).keys()].length;
    onNumClick(event)
    setItemOffset(newOffset);
  };

  return (
    <>
      <ReactPaginate
        // nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        // previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

export default Pagination;