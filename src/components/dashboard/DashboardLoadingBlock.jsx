const DashboardLoadingBlock = ({ message = "Loading dashboard..." }) => {
  return (
    <div className="dashboard-feedback dashboard-feedback--loading">
      <div className="dashboard-feedback__spinner" />
      <p className="dashboard-feedback__text">{message}</p>
    </div>
  );
};

export default DashboardLoadingBlock;
