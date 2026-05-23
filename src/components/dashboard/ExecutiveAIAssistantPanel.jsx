import React, { useState } from "react";
import { useExecutiveDashboardStore } from "../../stores/dashboard/useExecutiveDashboardStore";

const ExecutiveAIAssistantPanel = ({ filters }) => {
  const [message, setMessage] = useState("");

  const { aiChatMessages, aiChatLoading, aiChatError, sendAIChatMessage } =
    useExecutiveDashboardStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    setMessage("");

    await sendAIChatMessage(trimmedMessage, filters);
  };

  return (
    <div className="ai-assistant-panel">
      <div className="ai-assistant-panel__header">
        <div>
          <h3 className="ai-assistant-panel__title">NewCo AI Assistant</h3>

          <p className="ai-assistant-panel__subtitle">
            Ask operational questions using approved reporting data.
          </p>
        </div>
      </div>

      <div className="ai-assistant-panel__messages">
        {aiChatMessages.length === 0 ? (
          <p className="ai-assistant-panel__empty">
            Try asking: “Which site is performing best?”
          </p>
        ) : (
          aiChatMessages.map((item, index) => (
            <div
              key={`${item.role}-${index}`}
              className={`ai-assistant-message ai-assistant-message--${item.role}`}
            >
              <p>{item.content}</p>

              {item.chartSuggestions?.length > 0 && (
                <div className="ai-assistant-chart-hint">
                  Suggested chart:{" "}
                  <strong>{item.chartSuggestions[0].title}</strong>
                </div>
              )}
            </div>
          ))
        )}

        {aiChatLoading && (
          <p className="ai-assistant-panel__loading">Thinking...</p>
        )}

        {aiChatError && (
          <p className="ai-assistant-panel__error">{aiChatError}</p>
        )}
      </div>

      <form className="ai-assistant-panel__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="ai-assistant-panel__input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about sites, consumptions, ingredients..."
        />

        <button
          type="submit"
          className="ai-assistant-panel__button"
          disabled={aiChatLoading}
        >
          Ask
        </button>
      </form>
    </div>
  );
};

export default ExecutiveAIAssistantPanel;
