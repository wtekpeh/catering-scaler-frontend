import axios from "./axiosInstance";

const API_BASE = import.meta.env.VITE_GO_API_BASE_URL;

const buildParams = (filters = {}) => {
  return {
    start_date: filters.startDate || "",
    end_date: filters.endDate || "",
    branch_id: filters.branchId || "",
    group_by: filters.groupBy || "day",
  };
};

export const getExecutiveSummary = async (filters = {}) => {
  const { data } = await axios.get(`${API_BASE}/reports/executive-summary`, {
    params: buildParams(filters),
  });

  return {
    summary: {
      totalUsers: data?.kpis?.total_users ?? 0,
      activeUsers: data?.kpis?.total_active_users ?? 0,
      totalBranches: data?.kpis?.total_branches ?? 0,
      totalBatches: data?.kpis?.total_batches ?? 0,
      batchesThisWeek: data?.kpis?.batches_this_week ?? 0,
      batchesThisMonth: data?.kpis?.batches_this_month ?? 0,
    },
    highlights: {
      mostActiveBranch:
        data?.highlights?.most_active_branch?.branch_name ?? null,
      largestBranch: data?.highlights?.largest_branch?.branch_name ?? null,
      peakBatchDay: data?.highlights?.peak_batch_day?.day_name ?? null,
      mostUsedRecipe: data?.highlights?.most_used_recipe?.recipe_name ?? null,
      averageBatchesPerBranch:
        data?.highlights?.average_batches_per_branch?.value ?? 0,
    },
  };
};

export const getBatchTrends = async (filters = {}) => {
  const params = {};

  if (filters.branchId) {
    params.branch_id = filters.branchId;
  }

  const { data } = await axios.get(`${API_BASE}/reports/batch-trends`, {
    params,
  });

  return {
    batchTrends: data.series || [],
  };
};

export const getStaffSummary = async (filters = {}) => {
  const params = {};

  if (filters.branchId) {
    params.branch_id = filters.branchId;
  }

  const [userGrowthResponse, roleDistributionResponse] = await Promise.all([
    axios.get(`${API_BASE}/reports/user-growth`, { params }),
    axios.get(`${API_BASE}/reports/role-distribution`, { params }),
  ]);

  return {
    userTrends: userGrowthResponse.data.series || [],
    roleSummary: {
      globalRoles: [],
      branchRoles: (roleDistributionResponse.data.items || []).map((item) => ({
        role: item.role,
        count: item.count,
      })),
      activeVsInactive: [],
    },
  };
};

export const getBranchSummary = async (filters = {}) => {
  const params = {};

  if (filters.branchId) {
    params.branch_id = filters.branchId;
  }

  const { data } = await axios.get(`${API_BASE}/reports/branch-summary`, {
    params,
  });

  return {
    branchSummary: (data.items || []).map((item) => ({
      branchName: item.branch_name,
      staffCount: item.staff_count,
      batchCount: item.total_batches,
    })),
  };
};

export const getRecentBatches = async (filters = {}) => {
  const params = {};

  if (filters.branchId) {
    params.branch_id = filters.branchId;
  }

  const { data } = await axios.get(`${API_BASE}/reports/recent-batches`, {
    params,
  });

  return {
    recentBatches: (data.items || []).map((item) => ({
      id: item.batch_id,
      recipeName: item.recipe_name,
      branchName: item.branch_name,
      createdBy: item.created_by,
      createdAt: item.created_at,
    })),
  };
};

export const getBranches = async () => {
  const { data } = await axios.get(`${API_BASE}/reports/branches`);

  return {
    branches: (data.items || []).map((item) => ({
      id: String(item.id),
      name: item.name,
    })),
  };
};

export const getIngredientCategoryDaily = async (date) => {
  const { data } = await axios.get(
    `${API_BASE}/reports/ingredient-categories/daily`,
    {
      params: { date },
    },
  );

  return {
    ingredientCategoryDaily: data.items || [],
  };
};
