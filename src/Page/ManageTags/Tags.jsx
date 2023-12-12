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
import "./Tags.css";

import { baseUrl } from "../../config";
import ModalTags from "../../Components/Modaltags";
const Tags = () => {
  const [getIDRow, setIDRow] = useState(0);

  const [editTagsData, setEditTagsData] = useState();

  //active modal

  const [tagsData, setTagsData] = useState([
    {
      tags_id: 1,
      value: "Chung khoang",
    },
    {
      tags_id: 2,
      value: "handheld",
    },
  ]);

  const [modal, setModal] = useState(false);

  useEffect(() => {
    document.title = "Nhãn Dán";
  }, []);

  const fetchData = async () => {
    try {
      // Fetching receipt data
      const receiptResponse = await axios.get(`${baseUrl}/api/tag/all-tags`);
      setTagsData(receiptResponse.data);
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
    tagsData.forEach((Invoices) => {
      const row = [tagsData.value];
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
      a.download = "Tags_list.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const labelDisplayedRows = ({ from, to, count }) => {
    return `${from}-${to} trong ${count} bản ghi`; // Ví dụ: "1-10 of 100"
  };

  const handleRowClick = (row) => {
    if (getIDRow === "" || getIDRow !== row.original.tags_id) {
      setIDRow(row.original.tags_id);
    } else {
      setIDRow("");
    }
  };

  const handleDeleteCategories = (tags_id) => {
    if (!tags_id) {
      toast.error(
        <ToastNotify status={-1} message="Vui lòng một tag để xoá" />,
        { style: styleError }
      );
      return;
    } else {
      // Gửi yêu cầu DELETE đến endpoint để xóa khách hàng
      axios
        .delete(`${baseUrl}/api/tag/delete/${tags_id}`)
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

  const handleEditTags = (row) => {
    // Tạo một promise
    const promise = new Promise((resolve) => {
      // Set dữ liệu cho setEditCategoreData(row)
      setEditTagsData(row);

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
        <span className={row.original.tags_id === getIDRow ? "active" : ""}>
          {row.index + 1}
        </span>
      ),
    },

    {
      accessorKey: "tags_id",
      header: "Mã nhãn dán",
      size: "300",
      Cell: ({ row }) => (
        <span className={row.original.tags_id === getIDRow ? "active" : ""}>
          {row.original.tags_id}
        </span>
      ),
    },
    {
      accessorKey: "value",
      header: "Tên nhãn dán",
      size: "300",
      Cell: ({ row }) => (
        <span className={row.original.tags_id === getIDRow ? "active" : ""}>
          {row.original.value}
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
              handleEditTags(row);
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
            onClick={() => handleDeleteCategories(row.original.tags_id)}
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

        <ModalTags
          modal={modal}
          setModal={setModal}
          editTagsData={editTagsData}
          setEditTagsData={setEditTagsData}
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
            data={tagsData}
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

export default Tags;
