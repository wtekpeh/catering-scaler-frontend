import React from "react";
import "../styles/dashboard.css";
import ExecutiveAIAssistantPanel from "../components/dashboard/ExecutiveAIAssistantPanel";
import { useDashboardFilterStore } from "../stores/dashboard/useDashboardFilterStore";

const ExecutiveAIAssistantScreen = () => {
  const { startDate, endDate, branchId, groupBy } = useDashboardFilterStore();

  return (
    <div className="ai-assistant-screen">
      <div className="ai-assistant-screen__header">
        <div>
          <h1 className="ai-assistant-screen__title">
            NewCo AI Operations Assistant
          </h1>

          <p className="ai-assistant-screen__subtitle">
            Ask operational questions about sites, consumptions, recipes,
            ingredients, planning, and management actions.
          </p>
        </div>
      </div>

      <div className="ai-assistant-screen__workspace">
        <ExecutiveAIAssistantPanel
          filters={{
            startDate,
            endDate,
            branchId,
            groupBy,
          }}
        />
      </div>
    </div>
  );
};

export default ExecutiveAIAssistantScreen;
