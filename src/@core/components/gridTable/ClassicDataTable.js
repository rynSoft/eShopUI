import DataTable from 'react-data-table-component'
import { ChevronDown } from "react-feather";
import '@styles/react/libs/tables/react-dataTable-component.scss'
import CustomPagination from '../../../@core/components/gridTable/CustomPagination';
import { useEffect, useState } from 'react';
import ExportPdf from "../../../@core/components/gridTable/ExportPdf/exportPdf.js";
import ExportExcel from "./ExportExcel";


const ClassicDataTable = (props) => {
  const [rowCount, setRowCount] = useState(window.screen.height < 801 ? 8 : 11);
  const [filteredData, setFilteredData] = useState([]);
  const customStyles = {
    head: {
      style: {
        height: '60px',

      },
    },
    headCells: {
      style: {
        height: '60px',

      },
    },
  };//datatable  header height props
  const { data, columns, noDataText, searchValue } = props;

  useEffect(() => {
    const value = searchValue;
    let updatedData = [];
    if (value.length) {
      //setCurrentPage(0);
      updatedData = data.filter((item) => {
        const startsWith =

        item?.orderNo?.toLowerCase?.().startsWith(value.toLowerCase()) ||
        item?.aciklama?.toString().toLowerCase?.().startsWith(value.toLowerCase()) ||

        item?.uretimAdi?.toString().toLowerCase?.().startsWith(value.toLowerCase()) 

      const includes =
        item?.orderNo?.toLowerCase?.().startsWith(value.toLowerCase()) ||
        item?.aciklama?.toString().toLowerCase?.().startsWith(value.toLowerCase()) ||
        item?.uretimAdi?.toString().toLowerCase?.().startsWith(value.toLowerCase()) 


      if (startsWith) {
        return startsWith;
      } else if (!startsWith && includes) {
        return includes;
      } else return null;
    });
      setFilteredData(updatedData);
    }
  }, [searchValue]);
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <DataTable
      noHeader
      pagination
      selectableRowsNoSelectAll
      columns={columns}
      customStyles={customStyles}
      className='react-dataTable'
      paginationPerPage={rowCount}
      sortIcon={<ChevronDown size={10} />}
      paginationDefaultPage={currentPage + 1}
      paginationComponent={() => CustomPagination(searchValue.length>0 ? filteredData : data, currentPage, (value) => setCurrentPage(value))}

      data={searchValue.length>0? filteredData : data}
      noDataComponent={noDataText}
    />
  )


}

export default ClassicDataTable