import React, { useEffect, useState } from "react";
import "./Modal.css";
import "../../src/Page/dashboard.scss";
import axios from "axios";
import ToastNotify from "./ToastNotify";
import { ToastContainer, toast } from "react-toastify";
import { styleError, styleSuccess } from "./ToastNotifyStyle";

export default function Modal(props) {
  const [userName, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [second_name, setSecond_name] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [role_id, setRole_id] = useState();

  const { modal, setModal, editCustomerData, setEditCustomerData } = props;
  const toggleModal = () => {
    setModal(!modal);
    setEditCustomerData(null);
  };
  useEffect(() => {
    // Nếu có dữ liệu khách hàng, thì điền dữ liệu đó vào các trường nhập liệu
    if (editCustomerData) {
      setUsername(editCustomerData.userName || "");
      setPassword(editCustomerData.password || "");
      setSecond_name(editCustomerData.second_name || "");
      setDateOfBirth(editCustomerData.date_of_birth || "");
      setEmail(editCustomerData.email || "");
      setRole_id(editCustomerData.role_id || "");
    } else {
      // Nếu không có dữ liệu khách hàng, xóa toàn bộ trường nhập liệu
      setUsername("");
      setPassword("");
      setSecond_name("");
      setDateOfBirth("");
      setEmail("");
      setRole_id("");
    }
  }, [editCustomerData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (userName.trim === "") {
      toast.styleError(
        <ToastNotify
          status={-1}
          message="Vui lòng điền đẩy đủ trường thông tin"
        />,
        {
          style: styleError,
        }
      );
      return;
    } else {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8081/CreateCustomer",
          {
            userName,
            password,
            second_name,
            date_of_birth,
            email,
            role: {
              role_id,
            },
          }
        );

        toast.success(
          <ToastNotify status={0} message="Thêm khách hàng thành công" />,
          {
            style: styleSuccess,
          }
        );
        setModal(!modal); // Đặt trạng thái modal tại đây nếu cần
      } catch (error) {
        toast.success(<ToastNotify status={0} message={error.massage} />, {
          style: styleError,
        });
      }
    }
  };
  // Hàm xử lý cập nhật thông tin khách hàng
  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://127.0.0.1:8081/UpdateCustomer/${editCustomerData.user_id}`,
        {
          userName,
          password,
          second_name,
          date_of_birth,
          email,
          role: {
            role_id,
          },
        }
      );
      toast.success(
        <ToastNotify status={0} message="Cập nhật dữ liệu thành công" />,
        {
          style: styleSuccess,
        }
      );
      setModal(!modal);
      toggleModal();
    } catch (error) {
      toggleModal();
      toast.success(<ToastNotify status={0} message={error.massage} />, {
        style: styleError,
      });
    }
  };
  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <>
      <ToastContainer />
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay">
            {" "}
          </div>

          <div className="modal-content">
            <div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontWeight: "700",
                    fontSize: "1rem",
                    marginBottom: "0.75rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {editCustomerData ? "Sửa thông tin" : "Thêm mới khách hàng"}
                </span>
                <div className="close-modal" onClick={toggleModal}>
                  <i
                    className="fa-solid fa-xmark"
                    style={{ fontSize: "16px", color: "#AAAA" }}
                  ></i>
                </div>
              </div>
              {
                <form className="form-customer">
                  {/* row 1 name - acoutn type */}
                  <div className="row">
                    <div className="col l-7">
                      <label className="block lbl-txt" htmlFor="namecustomer">
                        Tên người dùng
                      </label>
                      <input
                        value={userName}
                        className="input-customer"
                        id="username"
                        type="text"
                        name="ContactName"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    <div className="col l-5">
                      <label className="block lbl-txt" htmlFor="namecustomer">
                        Loại tài khoản
                      </label>
                      <select
                        value={role_id}
                        name="AccountType"
                        className="input-customer"
                        id="unitbase"
                        onChange={(e) => setRole_id(e.target.value)}
                      >
                        <option className="option" value={0}>
                          Chọn loại tài khoản
                        </option>
                        <option className="option" value={1}>
                          Admin
                        </option>
                        <option className="option" value={2}>
                          User
                        </option>
                        <option className="option" value={3}>
                          Writer
                        </option>
                        <option className="option" value={4}>
                          Editor
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="block col" style={{ flex: 1 }}>
                      <label className="block lbl-txt">Tên người sử dụng</label>
                      <input
                        value={name}
                        className="input-customer"
                        id="username"
                        type="text"
                        name="Address"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="block col" style={{ flex: 1 }}>
                      <label className="block lbl-txt">Mật khẩu</label>
                      <input
                        value={password}
                        className="input-customer"
                        id="username"
                        type="password"
                        name="Address"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col l-6">
                      <label className="block lbl-txt" htmlFor="">
                        Email
                      </label>
                      <input
                        value={email}
                        className="input-customer"
                        id="username"
                        type="text"
                        name="Email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="col l-6">
                      <label className="block lbl-txt" htmlFor="">
                        Ngày sinh
                      </label>
                      <input
                        value={date_of_birth}
                        className="input-customer"
                        id="username"
                        type="text"
                        name="WebsiteAddress"
                        onChange={(e) => setDateOfBirth(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* row 4 name - acoutn type */}
                  {/* row 5 address */}

                  {/* row 5 addres */}
                  {/* row 5 address */}

                  <div
                    className="row"
                    style={{
                      justifyContent: "flex-end",
                      margin: "0 10px",
                      marginTop: "5px",
                    }}
                  >
                    <div className="btn-cancel col" onClick={toggleModal}>
                      <span
                        className="fa-solid fa-xmark"
                        style={{ paddingRight: "5px" }}
                      ></span>

                      <span className="p-component">Đóng</span>
                    </div>
                    {editCustomerData ? (
                      <button
                        onClick={handleUpdateCustomer}
                        className="btn-edit col "
                        style={{
                          marginLeft: "5px",
                        }}
                      >
                        <span
                          className="fa-solid fa-check"
                          style={{
                            paddingRight: "5px",
                          }}
                        ></span>
                        <span className="p-component">Cập nhật</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className="btn-save col "
                        style={{ marginLeft: "5px" }}
                      >
                        <span
                          className="fa-solid fa-check"
                          style={{ paddingRight: "5px" }}
                        ></span>
                        <span className="p-component">Lưu</span>
                      </button>
                    )}
                  </div>
                </form>
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}
