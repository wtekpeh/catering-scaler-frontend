import { create } from "zustand";

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

  resetExecutiveDashboard: () =>
    set(() => ({
      ...initialState,
    })),
}));
