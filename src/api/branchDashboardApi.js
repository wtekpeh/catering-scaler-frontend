import axios from "../api/axiosInstance";

const GO_REPORTING_BASE_URL = import.meta.env.VITE_GO_API_BASE_URL;

export const getBranchDashboardSummary = async () => {
  const { data } = await axios.get(
    `${GO_REPORTING_BASE_URL}/branch-dashboard/summary`,
  );

  return data;
};

export const getBranchBatchTrends = async () => {
  const { data } = await axios.get(
    `${GO_REPORTING_BASE_URL}/branch-dashboard/batch-trends`,
  );

  return data;
};

export const getBranchRoleDistribution = async () => {
  const { data } = await axios.get(
    `${GO_REPORTING_BASE_URL}/branch-dashboard/role-distribution`,
  );

  return data;
};

export const getBranchRecentBatches = async () => {
  const { data } = await axios.get(
    `${GO_REPORTING_BASE_URL}/branch-dashboard/recent-batches`,
  );

  return data;
};
