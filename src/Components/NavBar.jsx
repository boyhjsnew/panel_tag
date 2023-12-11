/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import "./NavBar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  //   const [isModalMenu, setIsModalMenu] = useState(false);
  //   const [isModalChangePass, setIsModalChangePass] = useState(false);
  const getLocation = useLocation();
  const navigate = useNavigate();

  return (
    <div
      // layout navbar
      className="layout-navbar"
    >
      {/* logo */}

      <img
        onClick={() => navigate("/dashboard")}
        src={require("../assets/logo-minvoice.png")}
      ></img>

      {/* navbar list */}
      <div style={{ flex: 6, display: "flex", justifyContent: "center" }}>
        <ul className="ul-list-nav">
          <li
            className={getLocation.pathname === "/invoices" ? "active" : ""}
            role="none"
            style={{ alignItems: "center" }}
          >
            <Link className="link" to="/invoices">
              <span
                style={{ paddingRight: "5px" }}
                className="fa-solid fa-layer-group"
              ></span>
              <span>Quản lý danh mục</span>
            </Link>
          </li>

          <li
            role="none"
            style={{ alignItems: "center" }}
            className={getLocation.pathname === "/customers" ? "active" : ""}
          >
            <Link className="link" to="/customers">
              <span
                style={{ paddingRight: "5px" }}
                className="fa-solid fa-users"
              ></span>
              <span>Quản lý người dùng</span>
            </Link>
          </li>
          <li
            role="none"
            style={{ alignItems: "center" }}
            className={getLocation.pathname === "/services" ? "active" : ""}
          >
            <Link className="link" to="/services">
              <span
                style={{ paddingRight: "5px" }}
                class="fa-solid fa-tag"
              ></span>
              <span>Quản lý tags </span>
            </Link>
          </li>
        </ul>
      </div>
      {/* link contact */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <i className="i-user fa-regular fa-user"></i>
        <span
          style={{ fontSize: "14px", paddingLeft: "10px", color: "#0069b4" }}
        >
          Admin
        </span>

        {/* {isModalMenu && (
          <ModalMenu
            setIsModalMenu={setIsModalMenu}
            isModalChangePass={isModalChangePass}
            setIsModalChangePass={setIsModalChangePass}
          />
        )} */}
      </div>
      {/* {isModalChangePass && (
        <ModalChangePass
          isModalChangePass={isModalChangePass}
          setIsModalChangePass={setIsModalChangePass}
        />
      )} */}
    </div>
  );
};
<style type="text/css"></style>;

export default NavBar;
