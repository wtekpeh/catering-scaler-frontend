import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import logo from "../assets/newco-logo.png";
import { keycloak } from "../auth/AuthProvider";
import "../styles/header.css";

function AppHeader() {
  const navigate = useNavigate();

  const userMe = useSelector((state) => state.userMe);
  const { user: currentUser } = userMe;

  const isAdminUser =
    currentUser?.global_role === "boss" ||
    currentUser?.global_role === "managing_director";

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div
          className="app-logo"
          onClick={() => navigate("/cooking/batches")}
          title="NewCo Catering & Logistics"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/cooking/batches");
            }
          }}
        >
          <img src={logo} alt="NewCo Catering & Logistics Ltd" />
        </div>

        <div className="app-header__actions">
          {isAdminUser && (
            <button
              type="button"
              className="app-header__logout"
              onClick={() => navigate("/admin/users")}
            >
              Admin
            </button>
          )}

          <button
            type="button"
            className="app-header__logout"
            onClick={() => keycloak.logout()}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
