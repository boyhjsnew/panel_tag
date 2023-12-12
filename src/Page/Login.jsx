import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

  return (
    <div className="login">
      <ToastContainer
        autoClose={2000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="left-row">
        <div style={{ backgroundImage: `./assets/bg-4.png` }}></div>
      </div>
      <div className="right-row">
        <div className="form-auth">
          <div style={{ textAlign: "center" }}>
            <img
              src={require("../assets/logo-minvoice.png")}
              alt="logo"
              width={"100px"}
            ></img>
            <p
              style={{
                fontWeight: 500,
                color: "#99321E",
                fontSize: "23px",
                marginBottom: "30px",
                whiteSpace: "pre-line",
              }}
            >
              Quản lý báo điện tử
            </p>
          </div>

          <form className="form-login">
            <label className="block mb-2 fz-15 " htmlFor="uname">
              Tài khoản
            </label>
            <input
              id="username"
              className="input-login mb-3"
              type="text"
              name="uname"
              // onChange={(e) => setUsername(e.target.value)}
            />
            <label className="block  lbl-text mb-2 fz-15" htmlFor="uname">
              Mật khẩu
            </label>
            <div style={{}}>
              <input
                id="password"
                className="input-login mb-3"
                type={isCheck ? "text" : "password"}
                name="pwrd"
                // onChange={(e) => setPassword(e.target.value)}
              />
              {/* them easye passs */}
            </div>
            <div
              style={{
                height: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                {/* quen mat khau */}
                <div>
                  <form
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      onClick={() => setIsCheck(!isCheck)}
                      checked={isCheck}
                      type="checkbox"
                      id="cb-mind"
                      name="mindAcc"
                      className="checkbox-input"
                    />
                    <label
                      className="lbl-checkbox fz-15"
                      style={{ padding: "8px" }}
                      htmlFor="cb-mind"
                    >
                      Hiện mật khẩu
                    </label>
                  </form>
                </div>
              </div>
            </div>
          </form>
          <button
            type="submit"
            className="p-button mt-2 fz-15"
            // onClick={handleSubmit}
          >
            <i class="fa-regular fa-user"></i>
            <Link
              style={{
                flex: 1,
                padding: "0.75rem",
                color: "#fff",
                textDecoration: "none",
                paddingRight: "15px",
              }}
              to="/dashboard"
            >
              Đăng nhập
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
