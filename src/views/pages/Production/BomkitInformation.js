import {

  Row

} from "reactstrap";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import "@styles/base/core/menu/menu-types/vertical-menu.scss";
import PerfectScrollbar from "react-perfect-scrollbar";
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "./ProductionDetail.css";
import UILoader from "../../../@core/components/ui-loader";
import { useTranslation } from "react-i18next";

const BomkitInformation = (props) => {
  const { bomData, bomInfoBlock } = props;
  const [currentPage, setCurrentPage] = useState(0);
  const { t } = useTranslation();
  const columnsBokKit = [
    {
      name: t("Malzeme").toLocaleUpperCase(),
      selector: (row) => row.material,
      width: "250px",
    },
    {
      name: t("Parti Numarası").toLocaleUpperCase(),
      selector: (row) => row.partyNumber,
      width: "200px",
    },
    {
      name: t("Açıklama").toLocaleUpperCase(),
      maxWidth: "400px",
      cell: (row) => {
        return (
          <div >{row.explanation}</div>
        );
      },
    },
  ];


  return (
    <div className={'react-dataTable'} >
      <DataTable
      // style={{ maxHeight: '72vh', height: !bomData || bomData.length === 0 ? undefined : (bomData.length + 1) * 27  }}
        selectableRowsNoSelectAll
        columns={columnsBokKit}
        data={bomData}
        pagination
        paginationPerPage={10}
        paginationDefaultPage={currentPage + 1}
      // paginationComponent={() => CustomPagination(searchValue.length ? filteredData : logs, currentPage, (value) => setCurrentPage(value))}
      />
    </div>
  );
};

export default BomkitInformation;
