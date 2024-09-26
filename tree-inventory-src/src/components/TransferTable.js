import React, { useState, useMemo, useEffect } from "react";
import { useTable } from "react-table";
import "./transferTable.scss";
import { Modal } from "../pages/Admin/Admin";
import { updateInventory, getOrderDetails } from "./api/api";
const TransferTable = ({ data, onSelectedRowsChange }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState(data);
  const [isRemoveModalVisible, setRemoveModalVisible] = useState(false);
  const [IDtoRemove, setIDtoRemove] = useState(null);
  const showRemoveModal = () => setRemoveModalVisible(true);
  const hideRemoveModal = () => setRemoveModalVisible(false);

  const columns = useMemo(
    () => [
      {
        Header: "Confirm",
        accessor: "select",
        Cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedRows.includes(row.original)}
            onChange={(e) => {
              const checked = e.target.checked;
              setSelectedRows((prev) => {
                if (checked) {
                  return [...prev, row.original];
                } else {
                  return prev.filter((r) => r !== row.original);
                }
              });
            }}
          />
        ),
      },
      {
        Header: "Email",
        accessor: "Email",
      },
      {
        Header: "Total Order $",
        accessor: "Total Order $",
      },
      {
        Header: "Date Ordered",
        accessor: "Date",
      },
      {
        Header: "Pickup Location",
        accessor: "Pickup Location",
      },
      {
        Header: "Order ID",
        accessor: "Order ID",
      },

      {
        Header: "Remove Order",
        id: "remove",
        Cell: ({ row }) => (
          <button
            className="remove-btn"
            onClick={() => {
              setIDtoRemove(row.original["Order ID"]);
              showRemoveModal();
            }}
          >
            Remove
          </button>
        ),
      },
    ],
    [selectedRows, tableData]
  );
  useEffect(() => {
    onSelectedRowsChange(selectedRows);
  }, [selectedRows, onSelectedRowsChange]);

  // Helper function to tranform the string retrieved from google sheets to an object
  function parseItemsFromString(itemsString) {
    const itemsArray = itemsString.split("\n");
    const itemsObject = {};

    itemsArray.forEach((item) => {
      const [title, quantity] = item.match(/(.*?)\s\((\d+)\)/).slice(1);
      itemsObject[title] = parseInt(quantity, 10);
    });
    return itemsObject;
  }

  const removeOrder = async (orderID) => {
    // remove order from Pending Etransfers on Google Sheets
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/google-sheets/remove-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: orderID }),
        }
      );
      if (response.ok) {
        //removed order successfully
      }
    } catch (error) {
      console.error("Error Removing Order:", error);
    }
  };

  const removeRow = async () => {
    if (!IDtoRemove) {
      return;
    }
    const newData = tableData.filter((row) => {
      return row["Order ID"] !== IDtoRemove;
    });
    setTableData(newData);

    //Remove row from Google Sheets
    await removeOrder(IDtoRemove);

    // get order data -> how many items are purchased -> inventory adjustment
    const orderDetails = await getOrderDetails(IDtoRemove);
    //Adjust Inventory
    let itemsPurchased = parseItemsFromString(orderDetails["Items Purchased"]);
    await updateInventory(itemsPurchased, false); //false signifies increase inventory
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tableData });

  if (data.length === 0) {
    return <h2 className="no-pending-etransfers">No Pending Etransfers</h2>;
  }
  return (
    <>
      <Modal
        show={isRemoveModalVisible}
        onClose={hideRemoveModal}
        onConfirm={() => {
          removeRow();
          setIDtoRemove(null);
          hideRemoveModal();
        }}
        title="Cancel Order"
        message="Are you sure you want to Cancel and Remove this order? It will adjust the inventory and remove this order from the 'Pending E-Transfer' form on Google Sheets. The order will still appear on the 'Order Reports' tab on Google Sheets"
        actionButton="Confirm"
      />
      <table {...getTableProps()} className="transfer-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TransferTable;
