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

const Material = (props) => {
  const { materialData, setMaterialData } = props;
  const [currentPage, setCurrentPage] = useState(0);
  const { t } = useTranslation();
  const columnsMaterial = [
    {
      name: t("Ürün Adı").toLocaleUpperCase(),
      selector: (row) => row.name,
      width: "350px",
    },
    {
      name: t("Kod").toLocaleUpperCase(),
      selector: (row) => row.code ,
      width: "350px",
    },
    {
      name: t("Miktar").toLocaleUpperCase(),
      selector: (row) => row.quantity,
      width: "250px",
    },
    {
      name: t("Düşüm Miktarı").toLocaleUpperCase(),
      selector: (row) => row.decreaseQuantity,
      width: "250px",
    },
    {
      name: t("Kalan Miktar").toLocaleUpperCase(),
      selector: (row) => row.remainQuantity,
      width: "250px",
    },
    {
      name: t("Depo Bilgisi").toLocaleUpperCase(),
      selector: (row) => row.soureProductPlace,
      width: "220px",
    },
    {
      name: t("Birim").toLocaleUpperCase(),
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
        columns={columnsMaterial}
        data={materialData}
        pagination
        paginationPerPage={10}
        paginationDefaultPage={currentPage + 1}
      />
    </div>
  );
};

export default Material;
