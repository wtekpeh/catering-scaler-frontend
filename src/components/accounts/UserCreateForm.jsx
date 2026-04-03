import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createUser } from "../../actions/cookBatchActions";
import { USER_CREATE_RESET } from "../../constants/cookBatchConstants";

const UserCreateForm = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [globalRole, setGlobalRole] = useState("none");
  const [isActive, setIsActive] = useState(true);

  const userCreateState = useSelector((state) => state.userCreate);
  const { loading, error, success } = userCreateState;

  useEffect(() => {
    if (success) {
      setEmail("");
      setUsername("");
      setFullName("");
      setGlobalRole("none");
      setIsActive(true);

      const timer = setTimeout(() => {
        dispatch({ type: USER_CREATE_RESET });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      createUser({
        email,
        username,
        full_name: fullName,
        global_role: globalRole,
        is_active: isActive,
      }),
    );
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <h4 className="mb-3">Create User</h4>

        {success && (
          <div className="alert alert-success">User created successfully.</div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submitHandler}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Global Role</label>
              <select
                className="form-select"
                value={globalRole}
                onChange={(e) => setGlobalRole(e.target.value)}
              >
                <option value="none">None</option>
                <option value="boss">Boss</option>
                <option value="managing_director">Managing Director</option>
              </select>
            </div>

            <div className="col-12 d-flex justify-content-between align-items-center mt-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="is_active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="is_active">
                  Active User
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-success px-4"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreateForm;
