const AccountPagination = ({
  currentPage,
  totalCount,
  pageSize = 10,
  onPageChange,
}) => {
  const totalPages = Math.ceil((totalCount || 0) / pageSize);

  if (totalPages <= 1) return null;

  const buildPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
      }
      return pages;
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = buildPages();

  return (
    <div className="d-flex justify-content-center mt-4">
      <div className="d-flex flex-wrap gap-2 justify-content-center">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="btn btn-sm btn-light disabled"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`btn btn-sm ${
                page === currentPage ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AccountPagination;
