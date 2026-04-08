const DashboardErrorBlock = ({ message = "Something went wrong." }) => {
  return (
    <div className="dashboard-feedback dashboard-feedback--error">
      <p className="dashboard-feedback__text">{message}</p>
    </div>
  );
};

export default DashboardErrorBlock;
