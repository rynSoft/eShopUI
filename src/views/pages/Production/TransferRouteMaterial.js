import React, { useState,useEffect } from 'react';
import { Space, Switch, Table, Tag, Transfer } from 'antd';
import axios from "axios";

// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelect,
      onItemSelectAll,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;
      const rowSelection = {
        getCheckboxProps: () => ({
          disabled: listDisabled,
        }),
        onChange(selectedRowKeys) {
          onItemSelectAll(selectedRowKeys, 'replace');
        },
        selectedRowKeys: listSelectedKeys,
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
      };
      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{
            pointerEvents: listDisabled ? 'none' : undefined,
          }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) {
                return;
              }
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);



const columns = [
  {
    dataIndex: 'name',
    title: 'Name',
  },
  {
    dataIndex: 'code',
    title: 'Code',
  },
  {
    dataIndex: 'description',
    title: 'Description',
  },
  {
    dataIndex: 'quantity',
    title: 'Miktar',
  },
  {
    dataIndex: 'id',
    title: 'Id',
    render: (id) => (
      <Tag
        style={{
          marginInlineEnd: 0,
        }}
        color="yellow"
      >
        {id}
      {/* {tag.toUpperCase()} */}
      </Tag>
    ),
  },
  
];


const TransferRouteMaterial = () => {
  const [targetKeys, setTargetKeys] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const [data, setData] = useState([]);
  
const loadMaterialData = () => {
  axios
    .get(
      process.env.REACT_APP_API_ENDPOINT +
        "api/Material/GetAllMaterialId?productionId=728"
    )
    .then((response) => {
      
      setData(response.data.data);

  
    });
};


useEffect(() => {
  loadMaterialData();

 

}, []);

  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };
  const toggleDisabled = (checked) => {
    setDisabled(checked);
  };

  const mockData  =  data.map(obj => ({
          key: obj.id.toString(),
          description: obj.description,
          id: obj.id,
          name : obj.name,
          code: obj.code,
          quantity : obj.quantity
      } 
  ));


  return (
    <>
      <TableTransfer
        dataSource={mockData}
        targetKeys={targetKeys}
        disabled={disabled}
        showSearch
        showSelectAll={false}
        onChange={onChange}
        filterOption={(inputValue, item) =>
          item.name.indexOf(inputValue) !== -1 || item.id.indexOf(inputValue) !== -1
        }
        leftColumns={columns}
        rightColumns={columns}
      />
      <Space
        style={{
          marginTop: 16,
        }}
      >
        <Switch
          unCheckedChildren="disabled"
          checkedChildren="disabled"
          checked={disabled}
          onChange={toggleDisabled}
        />
      </Space>
    </>
  );
};
export default TransferRouteMaterial;