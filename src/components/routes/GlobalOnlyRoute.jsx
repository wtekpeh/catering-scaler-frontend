import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAccountMe } from "../../actions/cookBatchActions";

const GlobalOnlyRoute = ({ children }) => {
  const dispatch = useDispatch();

  const accountMe = useSelector((state) => state.accountMe);
  const { loading, user } = accountMe;

  useEffect(() => {
    if (!user) {
      dispatch(getAccountMe());
    }
  }, [dispatch, user]);

  if (loading && !user) {
    return (
      <div className="page">
        <div className="container">Loading...</div>
      </div>
    );
  }

  // 🔥 THIS IS THE IMPORTANT PART
  const globalRole = user?.global_role;

  const isGlobalUser =
    globalRole === "boss" || globalRole === "managing_director";

  if (!isGlobalUser) {
    return <Navigate to="/cooking/batches" replace />;
  }

  return children;
};

export default GlobalOnlyRoute;
