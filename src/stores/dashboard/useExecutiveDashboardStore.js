import { create } from "zustand";
import {
  exportIngredientCategoryDailyExcel,
  exportIngredientCategoryDailyPDF,
  exportBatchDetailExcel,
  exportBatchDetailPDF,
  sendAIChatMessage,
} from "../../api/dashboardApi";

const initialState = {
  summary: null,
  batchTrends: [],
  dailyPlanTrends: [],
  userTrends: [],
  branchSummary: [],
  roleSummary: {
    globalRoles: [],
    branchRoles: [],
    activeVsInactive: [],
  },
  highlights: null,
  recentBatches: [],
  recentDailyPlans: [],
  ingredientCategoryDaily: [],
  exportingIngredientCategoryDailyExcel: false,
  exportingIngredientCategoryDailyPDF: false,
  exportingBatchDetailExcel: false,
  exportingBatchDetailPDF: false,
  topRecipeVariance: [],
  aiChatMessages: [],
  aiChatLoading: false,
  aiChatError: null,
  aiChatSessionId: `executive-ai-${Date.now()}`,
  loading: false,
  error: null,
};

export const useExecutiveDashboardStore = create((set) => ({
  ...initialState,

  setLoading: (loading) =>
    set(() => ({
      loading,
    })),

  setError: (error) =>
    set(() => ({
      error,
      loading: false,
    })),

  setExecutiveDashboardData: (payload) =>
    set(() => ({
      summary: payload.summary ?? null,
      batchTrends: payload.batchTrends ?? [],
      dailyPlanTrends: payload.dailyPlanTrends ?? [],
      userTrends: payload.userTrends ?? [],
      branchSummary: payload.branchSummary ?? [],
      roleSummary: payload.roleSummary ?? {
        globalRoles: [],
        branchRoles: [],
        activeVsInactive: [],
      },
      highlights: payload.highlights ?? null,
      recentBatches: payload.recentBatches ?? [],
      recentDailyPlans: payload.recentDailyPlans ?? [],
      loading: false,
      error: null,
    })),

  setIngredientCategoryDaily: (data) =>
    set(() => ({
      ingredientCategoryDaily: data,
      loading: false,
      error: null,
    })),

  exportIngredientCategoryDailyExcel: async (startDate, endDate) => {
    try {
      set({ exportingIngredientCategoryDailyExcel: true });

      const blob = await exportIngredientCategoryDailyExcel(startDate, endDate);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `ingredient_category_daily_${startDate}_to_${endDate}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      set({ exportingIngredientCategoryDailyExcel: false });
    } catch (err) {
      set({
        exportingIngredientCategoryDailyExcel: false,
        error: err?.message || "Export failed",
      });
    }
  },

  exportBatchDetailExcel: async (batchId) => {
    try {
      set({ exportingBatchDetailExcel: true });

      const blob = await exportBatchDetailExcel(batchId);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `batch_detail_${batchId}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      set({ exportingBatchDetailExcel: false });
    } catch (err) {
      set({
        exportingBatchDetailExcel: false,
        error: err?.message || "Batch export failed",
      });
    }
  },

  exportIngredientCategoryDailyPDF: async (startDate, endDate) => {
    try {
      set({ exportingIngredientCategoryDailyPDF: true });

      const blob = await exportIngredientCategoryDailyPDF(startDate, endDate);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `ingredient_category_daily_${startDate}_to_${endDate}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      set({ exportingIngredientCategoryDailyPDF: false });
    } catch (err) {
      set({
        exportingIngredientCategoryDailyPDF: false,
        error: err?.message || "PDF export failed",
      });
    }
  },

  exportBatchDetailPDF: async (batchId) => {
    try {
      set({ exportingBatchDetailPDF: true });

      const blob = await exportBatchDetailPDF(batchId);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `batch_detail_${batchId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      set({ exportingBatchDetailPDF: false });
    } catch (err) {
      set({
        exportingBatchDetailPDF: false,
        error: err?.message || "Batch PDF export failed",
      });
    }
  },

  setTopRecipeVariance: (topRecipeVariance) =>
    set(() => ({
      topRecipeVariance,
      loading: false,
      error: null,
    })),

  sendAIChatMessage: async (message, filters = {}) => {
    try {
      set({ aiChatLoading: true, aiChatError: null });

      const state = useExecutiveDashboardStore.getState();

      const userMessage = {
        role: "user",
        content: message,
      };

      set({
        aiChatMessages: [...state.aiChatMessages, userMessage],
      });

      const response = await sendAIChatMessage({
        session_id: state.aiChatSessionId,
        message,
        start_date: "",
        end_date: "",
        branch_id: null,
      });

      const assistantMessage = {
        role: "assistant",
        content: response.assistant_response,
        intent: response.intent,
        usedTools: response.used_tools || [],
        chartSuggestions: response.chart_suggestions || [],
        chartData: response.chart_data || {},
      };

      set((currentState) => ({
        aiChatMessages: [...currentState.aiChatMessages, assistantMessage],
        aiChatLoading: false,
        aiChatError: null,
      }));
    } catch (err) {
      set({
        aiChatLoading: false,
        aiChatError: err?.message || "AI chat failed",
      });
    }
  },

  resetExecutiveDashboard: () =>
    set(() => ({
      ...initialState,
    })),
}));
