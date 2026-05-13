import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import DailySharedRuleManager from "../components/dailyPlans/DailySharedRuleManager";

import {
  DAILY_SHARED_RULE_CREATE_RESET,
  DAILY_SHARED_RULE_UPDATE_RESET,
  DAILY_SHARED_RULE_DELETE_RESET,
} from "../constants/cookBatchConstants";

const DailySharedRuleScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: DAILY_SHARED_RULE_CREATE_RESET,
    });

    dispatch({
      type: DAILY_SHARED_RULE_UPDATE_RESET,
    });

    dispatch({
      type: DAILY_SHARED_RULE_DELETE_RESET,
    });
  }, [dispatch]);

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1>Shared Ingredient Rules</h1>

          <p className="helper">
            Configure ingredients that participate in daily-plan shared learning
            adjustments.
          </p>
        </div>

        <div className="actions wrap">
          <Link to="/cooking/daily-plans" className="btn">
            Back to Daily Plans
          </Link>
        </div>
      </div>

      <DailySharedRuleManager />
    </div>
  );
};

export default DailySharedRuleScreen;
