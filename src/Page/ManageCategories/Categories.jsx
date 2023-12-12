import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";

import "../ManageCustomer/customer.scss";
import "../dashboard.scss";
import { Box, Button } from "@mui/material";

import { useImperativeDisableScroll } from "../../Utils/configScrollbar";
import { toast } from "react-toastify";

import axios from "axios";
import ToastNotify from "../../Components/ToastNotify";
import { styleError, styleSuccess } from "../../Components/ToastNotifyStyle";

import ExcelJS from "exceljs";
import "./categories.css";
import ModalCategories from "../../Components/ModalCategories";
import { baseUrl } from "../../config";

const Categroies = () => {
  const [getIDRow, setIDRow] = useState(0);

  const [editCategoriesData, setEditCategoreData] = useState();

  //active modal

  const [categoriesData, setCategoriesData] = useState([
    {
      categories_id: 1,
      name: "Bong da",
    },
    {
      categories_id: 2,
      name: "Covid",
    },
  ]);

  const [modal, setModal] = useState(false);

  useEffect(() => {
    document.title = "Danh mục";
  }, []);

  const fetchData = async () => {
    try {
      // Fetching receipt data
      const receiptResponse = await axios.get(
        `${baseUrl}/api/category/all-categories`
      );
      setCategoriesData(receiptResponse.data);
    } catch (error) {
      // Handle errors
      console.error(error);
      toast.error(<ToastNotify status={-1} message={error.message} />, {
        style: styleError,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  //hidden scroll
  useImperativeDisableScroll({
    element: document.scrollingElement,
    disabled: true,
  });

  const handleExportInvoices = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invoices");

    // Thêm tiêu đề cột
    const columns = [
      "Số phiếu thu",
      "Đơn vị thu",
      "Ký hiệu",
      "Ngày ra phiếu",
      "Chủ sở hữu",
      "Tổng cộng",
      "Tiền bằng chữ",
    ];
    worksheet.addRow(columns);

    // Thêm dữ liệu khách hàng
    categoriesData.forEach((Invoices) => {
      const row = [categoriesData.name];
      worksheet.addRow(row);
    });

    // Tạo tệp Excel và tải xuống
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Receipt.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const labelDisplayedRows = ({ from, to, count }) => {
    return `${from}-${to} trong ${count} bản ghi`; // Ví dụ: "1-10 of 100"
  };

  const handleRowClick = (row) => {
    if (getIDRow === "" || getIDRow !== row.original.categories_id) {
      setIDRow(row.original.categories_id);
    } else {
      setIDRow("");
    }
  };

  const handleDeleteCategories = (categories_id) => {
    console.log(categories_id);
    if (!categories_id) {
      toast.error(
        <ToastNotify status={-1} message="Vui lòng một danh mục để xoá" />,
        { style: styleError }
      );
      return;
    } else {
      // Gửi yêu cầu DELETE đến endpoint để xóa khách hàng
      axios
        .delete(`${baseUrl}/api/category/delete/${categories_id}`)
        .then((response) => {
          // Xóa thành công
          toast.success(
            <ToastNotify status={0} message="Xoá phiếu thu thành công" />,
            { style: styleSuccess }
          );
          // Sau khi xóa, bạn có thể thực hiện lại yêu cầu GET để cập nhật danh sách khách hàng
          fetchData();
          setIDRow(null);
        })
        .catch((error) => {
          toast.error(<ToastNotify status={-1} message={error.message} />, {
            style: styleError,
          });
        });
    }
  };

  const handleEditRecipt = (row) => {
    // Tạo một promise
    const promise = new Promise((resolve) => {
      // Set dữ liệu cho setEditCategoreData(row)
      setEditCategoreData(row);

      // Giải quyết promise sau khi đã set dữ liệu
      resolve();
    });

    // Sau khi promise được giải quyết, mở setModal(!modal)
    promise.then(() => {
      setModal(!modal);
    });
  };

  const columns = useMemo(() => [
    {
      accessorKey: "iddp",
      header: "#",

      Cell: ({ row }) => (
        <span
          className={row.original.categories_id === getIDRow ? "active" : ""}
        >
          {row.index + 1}
        </span>
      ),
    },

    {
      accessorKey: "categories_id",
      header: "Mã danh mục",
      size: "300",
      Cell: ({ row }) => (
        <span
          className={row.original.categories_id === getIDRow ? "active" : ""}
        >
          {row.original.categories_id}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên danh mục",
      size: "300",
      Cell: ({ row }) => (
        <span
          className={row.original.categories_id === getIDRow ? "active" : ""}
        >
          {row.original.name}
        </span>
      ),
    },

    {
      header: "Chức năng",
      accessorKey: "assignService",
      // Tiêu đề của cột "Assign Service"
      accessor: "assignService", // Truy cập dữ liệu của cột "Assign Service"
      size: "180",

      Cell: ({ row }) => (
        <div
          style={{ display: "flex", justifyContent: "space-evenly", gap: 10 }}
        >
          <button
            onClick={() => {
              handleEditRecipt(row);
            }}
            title="Sửa"
            style={{
              border: "1px solid #F6A120",
              display: "flex",
              borderRadius: "100%",
              alignItems: "center",
              justifyContent: "center",
              height: "2rem",
              padding: "13px",
              width: "2rem ",
              color: "#F6A120",
              backgroundColor: "#FFFF",
              cursor: row.original.trangthai === 1 ? "" : "pointer",
            }}
          >
            <i style={{ fontSize: "11px" }} className="fa-solid fa-pen"></i>
          </button>
          <button
            onClick={() => handleDeleteCategories(row.original.categories_id)}
            title="Xoá"
            style={{
              border: "1px solid #6466F1",
              display: "flex",
              borderRadius: "100%",
              alignItems: "center",
              justifyContent: "center",
              height: "2rem",
              padding: "13px",
              width: "2rem ",
              color: "#6466F1",
              backgroundColor: "#FFFF",
              cursor: "pointer",
            }}
          >
            <i style={{ fontSize: "11px" }} className="fa-solid fa-trash"></i>
          </button>
        </div>
      ),
    },
  ]);

  return (
    <div
      style={{
        paddingTop: "4rem",
        backgroundColor: "#EDF1F5",
      }}
    >
      <div className="gird-layout wide">
        <style>
          {`
                          ::-webkit-scrollbar {
                            width: 5px;
                            height:5px
                          }
                          ::-webkit-scrollbar-thumb {
                            background-color: #6466F1; 
                            border-radius:5px
                          }
                          ::-webkit-scrollbar-track {
                            background-color: transparent; 
                          }
                        `}
        </style>

        <ModalCategories
          modal={modal}
          setModal={setModal}
          editCategoriesData={editCategoriesData}
          setEditCategoreData={setEditCategoreData}
        />

        <div className="col l-12">
          <MaterialReactTable
            icons={{
              ViewColumnIcon: () => (
                <div
                  style={{
                    border: "1px solid #64758B",
                    display: "flex",
                    padding: "8px",
                    borderRadius: "100%",
                  }}
                >
                  <span
                    style={{ fontSize: "13px" }}
                    class="fa-solid fa-gear"
                  ></span>
                </div>
              ),
            }}
            enablePinning
            enableColumnResizing
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            initialState={{ columnPinning: { right: ["assignService"] } }} //pin email column to left by default
            muiTableBodyRowProps={({ row }) => ({
              onClick: (event) => handleRowClick(row),
              className:
                getIDRow === row.original.phieuthu_id ? "selected-row" : "",
              sx: {
                cursor: "pointer",
              },
            })}
            enableStickyHeader={true}
            enableStickyFooter={true}
            muiTablePaginationProps={{
              labelRowsPerPage: "",
              labelDisplayedRows: labelDisplayedRows,
            }}
            enablePagination={true}
            columns={columns}
            data={categoriesData}
            muiTableHeadCellFilterTextFieldProps={44}
            renderTopToolbarCustomActions={() => (
              <Box className="col">
                <Button className="btn_reload" onClick={fetchData}>
                  <p
                    style={{ paddingRight: "5px" }}
                    className="fa-solid fa-rotate-right"
                  ></p>
                  <span style={{ paddingLeft: "5px" }}>Tải dữ liệu</span>
                </Button>
                <Button
                  className="btn_add"
                  style={{}}
                  onClick={() => setModal(!modal)}
                >
                  <span
                    style={{ paddingRight: "5px" }}
                    className="fa-solid fa-plus"
                  ></span>
                  <span style={{ paddingLeft: "5px" }}>Thêm</span>
                </Button>

                <Button className="btn_export" onClick={handleExportInvoices}>
                  <span
                    style={{ paddingRight: "5px" }}
                    className="fa-solid fa-file-excel"
                  ></span>
                  <span style={{ paddingLeft: "5px" }}>Xuất excel</span>
                </Button>
              </Box>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Categroies;
