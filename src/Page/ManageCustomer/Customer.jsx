import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
// import { styleError, styleSuccess } from "../../Components/ToastNotifyStyle";

import "./customer.scss";
import "../dashboard.scss";
import { Box, Button } from "@mui/material";

// import axios from "axios";
// import Modal from "../../Components/Modal";
// import ModalAssignService from "../../Components/ModalAssignService";
import { useImperativeDisableScroll } from "../../Utils/configScrollbar";
// import { ToastContainer, toast } from "react-toastify";
import ExcelJS from "exceljs";
// import ToastNotify from "../../Components/ToastNotify";
// import ModalChooseFile from "../../Components/ModalChooseFile";
// import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Modal from "../../Components/Modal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ToastNotify from "../../Components/ToastNotify";
import { styleError, styleSuccess } from "../../Components/ToastNotifyStyle";
import { baseUrl } from "../../config";

const Customer = () => {
  //hidden scroll
  useImperativeDisableScroll({
    element: document.scrollingElement,
    disabled: true,
  });

  const [customers, setCustomers] = useState([
    {
      user_id: 0,
      username: "nguyenvana",
      name: "Nguyen van A",
      second_name: "writer",
      email: "aggaag@gmail.com",
      password: "1234",
      date_of_birth: "20/05/2001",
      role: {
        role_id: 1,
      },
    },
    {
      user_id: 1,
      username: "nguyenvanb",
      name: "Nguyen van B",
      second_name: "tags ",
      email: "aggsdsdaag@gmail.com",
      password: "1234",
      date_of_birth: "20/05/2001",
      role: {
        role_id: 1,
      },
    },
  ]);
  const [getIDRow, setIDRow] = useState(-1);

  const [editCustomerData, setEditCustomerData] = useState(null);

  //datacustomer for edit

  //active modal
  const [modal, setModal] = useState(false);

  const getCustomer = () => {
    axios
      .get(`${baseUrl}/api/user/get-all`)

      .then((res) => setCustomers(res.data))
      .catch((err) => console.log("sdhvs"));
  };
  useEffect(() => {
    document.title = "Người dùng";
  }, []);
  useEffect(() => {
    getCustomer();
  }, [modal]);

  const handleExportCustomer = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Customers");

    // Thêm tiêu đề cột
    const columns = [
      "STT",
      "Mã người dùng",
      "Tên người sử dụng",
      "Vai trò",
      "Email",
      "Ngày sinh",
    ];
    worksheet.addRow(columns);

    // Thêm dữ liệu khách hàng
    customers.forEach((customer, index) => {
      const row = [
        index + 1,
        customer.user_id,
        customer.name,
        customer.second_name,
        customer.email,
        customer.date_of_birth,
      ];
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
      a.download = "user_data.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const labelDisplayedRows = ({ from, to, count }) => {
    return `${from}-${to} trong ${count} bản ghi`; // Ví dụ: "1-10 of 100"
  };

  const handleRowClick = (row) => {
    if (getIDRow === -1 || getIDRow !== row.original.user_id) {
      setIDRow(row.original.user_id);
    } else {
      setIDRow(-1);
    }
  };

  const handleDeleteCustomer = (e) => {
    e.preventDefault();

    // Gửi yêu cầu DELETE đến endpoint để xóa khách hàng
    axios
      .delete(`${baseUrl}/api/user/delete${getIDRow}`)

      .then((response) => {
        // Xóa thành công
        toast.success(
          <ToastNotify status={0} message="Xoá người dùng thành công" />,
          { style: styleSuccess }
        );
        // Sau khi xóa, bạn có thể thực hiện lại yêu cầu GET để cập nhật danh sách khách hàng
        getCustomer();
        setIDRow(-1);
      })
      .catch((error) => {
        console.error("Lỗi khi xoá khách hàng:", error);
      });
  };
  const handleEditButtonClick = () => {
    if (getIDRow === -1) {
      // Nếu chưa chọn dòng nào, thông báo cho người dùng

      toast.error(
        <ToastNotify
          status={-1}
          message="Vui lòng chọn một khách hàng để sửa."
        />,
        { style: styleError }
      );
    } else {
      // Nếu đã chọn dòng, tìm dòng tương ứng trong danh sách khách hàng và mở modal chỉnh sửa
      const selectedCustomer = customers.find(
        (customer) => customer.user_id === getIDRow
      );
      if (selectedCustomer) {
        // Đổ thông tin của khách hàng vào state editCustomerData
        setEditCustomerData(selectedCustomer);

        // Mở modal
        setModal(true);
      }
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: "stt",
      header: "STT",

      Cell: ({ row }) => (
        <span className={row.original.user_id === getIDRow ? "active" : ""}>
          {row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "user_id",
      header: "Mã người dùng",
      Cell: ({ row }) => (
        <span className={row.original.user_id === getIDRow ? "active" : ""}>
          {row.original.user_id}
        </span>
      ),
    },

    {
      accessorKey: "name",
      header: "Tên người sử dụng",
      Cell: ({ row }) => (
        <span className={row.original.user_id === getIDRow ? "active" : ""}>
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "second_name",
      header: "Vai trò",
      Cell: ({ row }) => (
        <span className={row.original.user_id === getIDRow ? "active" : ""}>
          {row.original.second_name}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      Cell: ({ row }) => (
        <span className={row.original.user_id === getIDRow ? "active" : ""}>
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "date_of_birth",
      header: "Ngày sinh",
      Cell: ({ row }) => (
        <span className={row.original.user_id === getIDRow ? "active" : ""}>
          {row.original.date_of_birth}
        </span>
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
      <div className="gird-layout wide ">
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
        <ToastContainer autoClose={2000} hideProgressBar />
        <Modal
          modal={modal}
          setModal={setModal}
          editCustomerData={editCustomerData}
          setEditCustomerData={setEditCustomerData}
        />

        <div className="col l-12">
          <MaterialReactTable
            enableStickyHeader={true}
            enableStickyFooter={true}
            muiTablePaginationProps={{
              labelDisplayedRows: labelDisplayedRows,
            }}
            enableFilters={false}
            enableDensityToggle={false}
            enableFullScreenToggle={false}
            enablePinning
            icons={{
              ViewColumnIcon: () => (
                <div
                  style={{
                    border: "1px solid #64758B",
                    display: "flex",
                    padding: "10px",
                    borderRadius: "100%",
                  }}
                >
                  <span
                    style={{ fontSize: "11px" }}
                    class="fa-solid fa-gear"
                  ></span>
                </div>
              ),
            }}
            muiTableBodyRowProps={({ row }) => ({
              onClick: (event) => handleRowClick(row),
              className:
                getIDRow === row.original.user_id ? "selected-row" : "",
              sx: {
                cursor: "pointer",
              },
            })}
            enablePagination={true}
            columns={columns}
            data={customers}
            muiTableHeadCellFilterTextFieldProps={44}
            renderTopToolbarCustomActions={() => (
              <Box className="col">
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
                <Button className="btn_edit" onClick={handleEditButtonClick}>
                  <span
                    style={{ paddingRight: "5px" }}
                    className="fa-solid fa-pencil"
                  ></span>
                  <span style={{ paddingLeft: "5px" }}>Sửa</span>
                </Button>
                <Button
                  className="btn_remove"
                  onClick={(e) => handleDeleteCustomer(e)}
                >
                  <span
                    style={{ paddingRight: "5px" }}
                    className="fa-solid fa-trash"
                  ></span>
                  <span style={{ paddingLeft: "5px" }}>Xoá</span>
                </Button>

                <Button
                  className="btn_import"
                  //   onClick={() => setIsModalChooseFile(!isModalChooseFile)}
                >
                  <span
                    style={{ paddingRight: "5px" }}
                    className="fa-solid fa-file-import"
                  ></span>
                  <span style={{ paddingLeft: "5px" }}>Nhập Excel</span>
                </Button>
                <Button className="btn_export" onClick={handleExportCustomer}>
                  <span
                    style={{ paddingRight: "5px" }}
                    className="fa-solid fa-file-excel"
                  ></span>
                  <span style={{ paddingLeft: "5px" }}>Xuất Excel</span>
                </Button>
              </Box>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Customer;
