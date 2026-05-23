import React, { useEffect, useRef, useState } from "react";
import { useExecutiveDashboardStore } from "../../stores/dashboard/useExecutiveDashboardStore";

const ExecutiveAIAssistantPanel = ({ filters }) => {
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null);

  const { aiChatMessages, aiChatLoading, aiChatError, sendAIChatMessage } =
    useExecutiveDashboardStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [aiChatMessages, aiChatLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    setMessage("");

    await sendAIChatMessage(trimmedMessage, filters);
  };

  return (
    <div className="ai-chat-shell">
      <div
        className={`ai-chat-shell__messages ${
          aiChatMessages.length > 0 ? "has-messages" : ""
        }`}
      >
        {aiChatMessages.length === 0 && (
          <div className="ai-chat-empty">
            <div className="ai-chat-empty__icon">AI</div>

            <h2 className="ai-chat-empty__title">NewCo AI Assistant</h2>

            <p className="ai-chat-empty__subtitle">
              Ask operational questions about sites, consumptions, ingredients,
              planning, staffing, and executive performance.
            </p>

            <div className="ai-chat-empty__suggestions">
              <button
                type="button"
                onClick={() =>
                  sendAIChatMessage("Which site is performing best?", filters)
                }
              >
                Which site is performing best?
              </button>

              <button
                type="button"
                onClick={() =>
                  sendAIChatMessage("Which site is overloaded?", filters)
                }
              >
                Which site is overloaded?
              </button>

              <button
                type="button"
                onClick={() =>
                  sendAIChatMessage(
                    "Summarize operations for management",
                    filters,
                  )
                }
              >
                Summarize operations
              </button>
            </div>
          </div>
        )}

        {aiChatMessages.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className={`ai-chat-message ai-chat-message--${item.role}`}
          >
            <div className="ai-chat-message__bubble">
              <p>{item.content}</p>

              {item.chartSuggestions?.length > 0 && (
                <div className="ai-chat-message__chart">
                  Suggested chart:{" "}
                  <strong>{item.chartSuggestions[0].title}</strong>
                </div>
              )}
            </div>
          </div>
        ))}

        {aiChatLoading && (
          <div className="ai-chat-message ai-chat-message--assistant">
            <div className="ai-chat-message__bubble ai-chat-message__bubble--loading">
              Thinking...
            </div>
          </div>
        )}

        {aiChatError && <div className="ai-chat-error">{aiChatError}</div>}

        <div ref={messagesEndRef} />
      </div>

      <form className="ai-chat-input-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          className="ai-chat-input-bar__input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask operational questions..."
        />

        <button
          type="submit"
          className="ai-chat-input-bar__button"
          disabled={aiChatLoading}
        >
          Ask
        </button>
      </form>
    </div>
  );
};
export default ExecutiveAIAssistantPanel;
