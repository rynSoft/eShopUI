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
      name: t("Ürün Adı").toLocaleUpperCase(),
      selector: (row) => row.description,
      width: "350px",
    },
    {
      name: t("Malzeme Barkod Kodu").toLocaleUpperCase(),
      selector: (row) => row.material + '' + row.partyNumber,
      width: "350px",
    },
   
 
    {
      name: "Miktar".toLocaleUpperCase(),
      selector: (row) => row.quantity,
      width: "250px",
    },
    {
      name: "Depo Bilgisi".toLocaleUpperCase(),
      selector: (row) => row.soureProductPlace,
      width: "220px",
    },
    {
      name: "Birim".toLocaleUpperCase(),
      selector: (row) => row.unit,
      width: "200px",
    },
    {
      name: t("Açıklama").toLocaleUpperCase(),

      maxWidth: "400px",
      cell: (row) => {
        return (
          <div>{row.explanation}</div>
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
