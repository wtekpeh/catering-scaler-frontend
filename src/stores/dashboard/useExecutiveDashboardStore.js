import { create } from "zustand";
import {
  exportIngredientCategoryDailyExcel,
  exportBatchDetailExcel,
  exportBatchDetailPDF,
} from "../../api/dashboardApi";

const initialState = {
  summary: null,
  batchTrends: [],
  userTrends: [],
  branchSummary: [],
  roleSummary: {
    globalRoles: [],
    branchRoles: [],
    activeVsInactive: [],
  },
  highlights: null,
  recentBatches: [],
  ingredientCategoryDaily: [],
  exportingIngredientCategoryDailyExcel: false,
  exportingBatchDetailExcel: false,
  exportingBatchDetailPDF: false,
  topRecipeVariance: [],
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
      userTrends: payload.userTrends ?? [],
      branchSummary: payload.branchSummary ?? [],
      roleSummary: payload.roleSummary ?? {
        globalRoles: [],
        branchRoles: [],
        activeVsInactive: [],
      },
      highlights: payload.highlights ?? null,
      recentBatches: payload.recentBatches ?? [],
      loading: false,
      error: null,
    })),

  setIngredientCategoryDaily: (data) =>
    set(() => ({
      ingredientCategoryDaily: data,
      loading: false,
      error: null,
    })),

  exportIngredientCategoryDailyExcel: async (date) => {
    try {
      set({ exportingIngredientCategoryDailyExcel: true });

      const blob = await exportIngredientCategoryDailyExcel(date);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `ingredient_category_daily_${date}.xlsx`;

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

  resetExecutiveDashboard: () =>
    set(() => ({
      ...initialState,
    })),
}));
