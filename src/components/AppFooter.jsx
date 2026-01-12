function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__line">
          © {new Date().getFullYear()} NewCo Catering &amp; Logistics Ltd
        </div>
        <div className="app-footer__line subtle">
          Ingredient Scaling &amp; Recipe Prediction Admin
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
