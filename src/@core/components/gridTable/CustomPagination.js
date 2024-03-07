import { Fragment, useState } from "react";


import "@styles/react/libs/tables/react-dataTable-component.scss";
import ReactPaginate from "react-paginate";
function CustomPagination(processData,currentPage,setCurrentPage){
    const Previous = () => {
        return (
           <Fragment>
              <span className="align-middle d-none d-md-inline-block">
                 {"Önceki"}
              </span>
           </Fragment>
        );
     };
     // ** Pagination Next Component
     const Next = () => {
        return (
           <Fragment>
              <span className="align-middle d-none d-md-inline-block">
                 {"Sonraki"}
              </span>
           </Fragment>
        );
     };
     const handlePagination = (page) => {
        setCurrentPage(page.selected);
      };
    const [rowCount, setRowCount] = useState(window.screen.height < 801 ? 8 : 10);
   return  <ReactPaginate
    previousLabel={<Previous size={15} />}
    nextLabel={<Next size={15} />}
    forcePage={currentPage}
    onPageChange={(page) => handlePagination(page)}
    pageCount={
       Math.ceil(processData.length / rowCount) || 1
    }
    breakLabel={"..."}
    pageRangeDisplayed={2}
    marginPagesDisplayed={2}
    activeClassName={"active"}
    pageClassName={"page-item"}
    nextLinkClassName={"page-link"}
    nextClassName={"page-item next"}
    previousClassName={"page-item prev"}
    previousLinkClassName={"page-link"}
    pageLinkClassName={"page-link"}
    breakClassName="page-item"
    breakLinkClassName="page-link"
    containerClassName={
       "pagination react-paginate pagination-sm justify-content-end pe-1 mt-1"
    }
 />
}
export default CustomPagination;