const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getExecutiveSummary = async () => {
  await wait(300);

  return {
    summary: {
      totalUsers: 128,
      activeUsers: 94,
      totalBranches: 8,
      totalBatches: 1460,
      batchesThisWeek: 64,
      batchesThisMonth: 238,
    },
    highlights: {
      mostActiveBranch: "Accra Central",
      largestBranch: "Tema Branch",
      peakBatchDay: "Wednesday",
      mostUsedRecipe: "Jollof Rice",
      averageBatchesPerBranch: 29,
    },
  };
};

export const getBatchTrends = async () => {
  await wait(300);

  return {
    batchTrends: [
      { label: "Mon", count: 12 },
      { label: "Tue", count: 18 },
      { label: "Wed", count: 24 },
      { label: "Thu", count: 16 },
      { label: "Fri", count: 22 },
      { label: "Sat", count: 14 },
      { label: "Sun", count: 10 },
    ],
  };
};

export const getStaffSummary = async () => {
  await wait(300);

  return {
    userTrends: [
      { label: "Mon", count: 2 },
      { label: "Tue", count: 3 },
      { label: "Wed", count: 1 },
      { label: "Thu", count: 4 },
      { label: "Fri", count: 2 },
      { label: "Sat", count: 1 },
      { label: "Sun", count: 3 },
    ],
    roleSummary: {
      globalRoles: [
        { role: "Boss", count: 1 },
        { role: "Managing Director", count: 2 },
      ],
      branchRoles: [
        { role: "Branch Manager", count: 8 },
        { role: "Chef", count: 54 },
      ],
      activeVsInactive: [
        { status: "Active", count: 94 },
        { status: "Inactive", count: 34 },
      ],
    },
  };
};

export const getBranchSummary = async () => {
  await wait(300);

  return {
    branchSummary: [
      { branchName: "Accra Central", staffCount: 18, batchCount: 44 },
      { branchName: "Tema Branch", staffCount: 22, batchCount: 39 },
      { branchName: "Kumasi Branch", staffCount: 15, batchCount: 31 },
      { branchName: "Takoradi Branch", staffCount: 12, batchCount: 20 },
      { branchName: "Cape Coast", staffCount: 10, batchCount: 14 },
    ],
  };
};

export const getRecentBatches = async () => {
  await wait(300);

  return {
    recentBatches: [
      {
        id: 1,
        recipeName: "Jollof Rice",
        branchName: "Accra Central",
        createdBy: "Kwame Mensah",
        createdAt: "2026-04-08 09:10",
      },
      {
        id: 2,
        recipeName: "Fried Rice",
        branchName: "Tema Branch",
        createdBy: "Akosua Owusu",
        createdAt: "2026-04-08 10:00",
      },
      {
        id: 3,
        recipeName: "Waakye",
        branchName: "Kumasi Branch",
        createdBy: "Yaw Boateng",
        createdAt: "2026-04-08 11:20",
      },
    ],
  };
};
