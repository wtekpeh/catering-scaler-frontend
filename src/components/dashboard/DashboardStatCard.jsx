const DashboardStatCard = ({ title, value }) => {
  return (
    <div className="dashboard-stat-card">
      <p className="dashboard-stat-card__title">{title}</p>
      <h3 className="dashboard-stat-card__value">{value}</h3>
    </div>
  );
};

export default DashboardStatCard;
