import DataTable from 'react-data-table-component'
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { dateFormat, serverDateFormat } from "../../../utility/Constants";
import CustomPagination from "../../../@core/components/gridTable/CustomPagination";

import PropTypes from "prop-types";
import './ProductionLogs.css';

const ProductionLogs = (props) => {
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const columns = [
        {
            name: 'Tarih',
            selector: row => row.date,
            width: '200px',
            cell: row => row.date != null ? moment(row.date, serverDateFormat).format(dateFormat) : null
        },
        {
            name: 'Personel Bilgisi',
            selector: row => row.date,
            width: '200px',
            cell: row => row.userAd + " "+row.userSoyad
        },
        {
            name: 'Log',
            width: '400px',
            cell: (row) => {
                return (
                    <div className="d-flex">
                        {row.message}
                    </div>
                );
            },
        },
    ]

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'api/ProductionLog/GetAllAsyncProductId?id=' + props.productionId).then(response => {
            setLogs(response.data.data);
        }).finally(() => {

        })
    }

    return (
        <div className={'react-dataTable'} >
            <DataTable

                selectableRowsNoSelectAll
                columns={columns}
                data={logs}
                pagination
                paginationPerPage={20}
                paginationDefaultPage={currentPage + 1}
                // paginationComponent={() => CustomPagination(searchValue.length ? filteredData : logs, currentPage, (value) => setCurrentPage(value))}
            />
        </div>
    )
}

ProductionLogs.propTypes = {
    productionId: PropTypes.number
};

ProductionLogs.defaultProps = {};

export default ProductionLogs
