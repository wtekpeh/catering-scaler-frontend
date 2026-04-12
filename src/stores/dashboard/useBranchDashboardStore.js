import { create } from "zustand";

const initialState = {
  summary: null,

  batchTrends: [],
  roleSummary: {
    branchRoles: [],
  },
  recentBatches: [],

  loading: false,
  error: null,
};
export const useBranchDashboardStore = create((set) => ({
  ...initialState,

  setLoading: (loading) =>
    set(() => ({
      loading,
      error: null,
    })),

  setError: (error) =>
    set(() => ({
      error,
      loading: false,
    })),

  setSummary: (summary) =>
    set(() => ({
      summary,
      loading: false,
      error: null,
    })),

  resetBranchDashboard: () =>
    set(() => ({
      ...initialState,
    })),

  setBatchTrends: (batchTrends) =>
    set(() => ({
      batchTrends,
    })),

  setRoleSummary: (roleSummary) =>
    set(() => ({
      roleSummary,
    })),

  setRecentBatches: (recentBatches) =>
    set(() => ({
      recentBatches,
    })),
}));
