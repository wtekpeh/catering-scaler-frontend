const ExecutiveRecentDailyPlansTable = ({ plans }) => {
  const items = plans || [];

  return (
    <div className="dashboard-chart-card">
      <div className="dashboard-chart-card__header">
        <h3 className="dashboard-chart-card__title">Recent Daily Plans</h3>
        <p className="dashboard-chart-card__subtitle">
          Latest operational daily consumption plans.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="dashboard-chart-card__subtitle">
          No recent daily plans available.
        </p>
      ) : (
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Plan Date</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Created By</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.daily_plan_id}>
                  <td>{item.plan_date}</td>
                  <td>{item.branch_name}</td>
                  <td>{item.status}</td>
                  <td>{item.created_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExecutiveRecentDailyPlansTable;
