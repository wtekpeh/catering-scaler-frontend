import { useDashboardFilterStore } from "../../stores/dashboard/useDashboardFilterStore";

const formatDate = (date) => date.toISOString().split("T")[0];

const DashboardFilterBar = () => {
  const {
    startDate,
    endDate,
    branchId,
    groupBy,
    branches,
    setDateRange,
    setBranchId,
    setGroupBy,
    resetFilters,
  } = useDashboardFilterStore();

  const applyPreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));

    setDateRange({
      startDate: formatDate(start),
      endDate: formatDate(end),
    });
  };

  const handleStartDateChange = (event) => {
    setDateRange({
      startDate: event.target.value,
      endDate,
    });
  };

  const handleEndDateChange = (event) => {
    setDateRange({
      startDate,
      endDate: event.target.value,
    });
  };

  return (
    <div className="dashboard-filter-shell">
      <div className="dashboard-filter-presets">
        <button
          type="button"
          className="dashboard-filter-presets__btn"
          onClick={() => applyPreset(7)}
        >
          Last 7 Days
        </button>
        <button
          type="button"
          className="dashboard-filter-presets__btn"
          onClick={() => applyPreset(30)}
        >
          Last 30 Days
        </button>
        <button
          type="button"
          className="dashboard-filter-presets__btn"
          onClick={() => applyPreset(90)}
        >
          Last 90 Days
        </button>
      </div>

      <div className="dashboard-filter-bar">
        <div className="dashboard-filter-bar__group">
          <label className="dashboard-filter-bar__label">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="dashboard-filter-bar__input"
          />
        </div>

        <div className="dashboard-filter-bar__group">
          <label className="dashboard-filter-bar__label">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="dashboard-filter-bar__input"
          />
        </div>

        <div className="dashboard-filter-bar__group">
          <label className="dashboard-filter-bar__label">Branch</label>
          <select
            value={branchId}
            onChange={(event) => setBranchId(event.target.value)}
            className="dashboard-filter-bar__input"
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="dashboard-filter-bar__group">
          <label className="dashboard-filter-bar__label">Group By</label>
          <select
            value={groupBy}
            onChange={(event) => setGroupBy(event.target.value)}
            className="dashboard-filter-bar__input"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>

        <div className="dashboard-filter-bar__actions">
          <button
            type="button"
            onClick={resetFilters}
            className="dashboard-filter-bar__reset-btn"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilterBar;
