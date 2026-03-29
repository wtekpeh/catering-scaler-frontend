import { useNavigate } from "react-router-dom";
import logo from "../assets/newco-logo.png";
import { keycloak } from "../auth/AuthProvider";
import "../styles/header.css";

function AppHeader() {
  const navigate = useNavigate();

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
