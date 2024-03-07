import {

  Row

} from "reactstrap";
import DataTable from "react-data-table-component";
import "@styles/base/core/menu/menu-types/vertical-menu.scss";
import PerfectScrollbar from "react-perfect-scrollbar";
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss";



import "@styles/react/libs/tables/react-dataTable-component.scss";

import "@styles/react/libs/tables/react-dataTable-component.scss";


import "./ProductionDetail.css";
import UILoader from "../../../@core/components/ui-loader";

const BomkitInformation = (props) => {
  const { bomData,bomInfoBlock } = props
  const columnsBokKit = [
    {
      name: "Malzeme",
      selector: (row) => row.material,
      width: "160px",
    },
    {
      name: "Parti Numarası",
      selector: (row) => row.partyNumber,
      width: "160px",
    },
    {
      name: "Açıklama",

      maxWidth: "400px",
      cell: (row) => {
        return (
          <div>{row.explanation}</div>
        );
      },
    },
  ];




  return (
    <UILoader blocking={bomInfoBlock}>
      <div className="react-dataTable">
        <PerfectScrollbar
          options={{ wheelPropagation: false, suppressScrollX: true }}
          className="ScrollHeightAll"
        >
          <div
            className="react-dataTable"

            style={{
              minHeight: window.screen.height * 0.7,
              maxHeight: window.screen.height *  0.7,
             
            }}
          >
            <DataTable
              selectableRowsNoSelectAll
              columns={columnsBokKit}
              className="react-dataTable custom-height"
              data={bomData}
              noDataComponent="Bom Kit Verisi Mevcut Değil"
            />
          </div>
        </PerfectScrollbar>
      </div>
      <Row></Row>

    </UILoader>
  );
};

export default BomkitInformation;
