import { create } from "zustand";

const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 29);

  const formatDate = (date) => date.toISOString().split("T")[0];

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

const defaultDates = getDefaultDateRange();

export const useDashboardFilterStore = create((set) => ({
  startDate: defaultDates.startDate,
  endDate: defaultDates.endDate,
  branchId: "",
  groupBy: "day",
  branches: [],

  setDateRange: ({ startDate, endDate }) =>
    set(() => ({
      startDate,
      endDate,
    })),

  setBranchId: (branchId) =>
    set(() => ({
      branchId,
    })),

  setGroupBy: (groupBy) =>
    set(() => ({
      groupBy,
    })),

  setBranches: (branches) =>
    set(() => ({
      branches,
    })),

  resetFilters: () =>
    set(() => {
      const resetDates = getDefaultDateRange();

      return {
        startDate: resetDates.startDate,
        endDate: resetDates.endDate,
        branchId: "",
        groupBy: "day",
      };
    }),
}));
