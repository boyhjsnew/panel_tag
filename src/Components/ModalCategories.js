import React, { useEffect, useState } from "react";
import "./Modal.css";
import "../../src/Page/dashboard.scss";
import axios from "axios";

import { baseUrl } from "../config";
import { toast } from "react-toastify";
import ToastNotify from "./ToastNotify";
import { styleError, styleSuccess } from "./ToastNotifyStyle";
export default function ModalCategories(props) {
  const [name, setName] = useState("");

  const { modal, setModal, editCategoriesData, setEditCategoreData } = props;
  const toggleModal = () => {
    setModal(!modal);
    setEditCategoreData("");
  };

  useEffect(() => {
    // Nếu có dữ liệu khách hàng, thì điền dữ liệu đó vào các trường nhập liệu
    if (editCategoriesData) {
      setName(editCategoriesData.original.name || "");
    } else {
      // Nếu không có dữ liệu khách hàng, xóa toàn bộ trường nhập liệu
      setName("");
    }
  }, [editCategoriesData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Gửi yêu cầu POST
      const response = await axios.post(`${baseUrl}/api/category/add`, {
        name,
      });

      setModal(!modal); // Đặt trạng thái modal tại đây nếu cần
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleUpdateCategories = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${baseUrl}/api/category/update?categories_id=${editCategoriesData.original.categories_id}`,
        {
          name,
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
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
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
                  {editCategoriesData ? "Sửa thông tin" : "Thêm mới danh mục"}
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
                    <div className="block col" style={{ flex: 1 }}>
                      <label className="block lbl-txt" htmlFor="">
                        Tên danh mục
                      </label>
                      <input
                        value={name}
                        className="input-customer"
                        id="username"
                        type="text"
                        name="ServiceName"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

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
                    {editCategoriesData ? (
                      <button
                        onClick={handleUpdateCategories}
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
