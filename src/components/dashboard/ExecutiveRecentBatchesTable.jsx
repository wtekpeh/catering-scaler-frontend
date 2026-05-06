import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const ExecutiveRecentBatchesTable = ({ data }) => {
  const [sorting, setSorting] = useState([{ id: "createdAt", desc: true }]);

  const tableData = useMemo(() => data || [], [data]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "recipeName",
        header: "Recipe",
        cell: ({ row }) => (
          <span className="dashboard-table__primary-cell">
            {row.original.recipeName}
          </span>
        ),
      },
      {
        accessorKey: "branchName",
        header: "Site",
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!tableData.length) {
    return (
      <div className="dashboard-chart-card">
        <div className="dashboard-chart-card__header">
          <h3 className="dashboard-chart-card__title">Recent Consumptions</h3>
          <p className="dashboard-chart-card__subtitle">
            No recent consumption data available.
          </p>
        </div>
      </div>
    );
  }

  const getSortIndicator = (column) => {
    const sorted = column.getIsSorted();

    if (sorted === "asc") return "▲";
    if (sorted === "desc") return "▼";
    return "↕";
  };

  return (
    <div className="dashboard-chart-card">
      <div className="dashboard-chart-card__header">
        <h3 className="dashboard-chart-card__title">Recent Consumptions</h3>
        <p className="dashboard-chart-card__subtitle">
          Latest cooking activity across sites.
        </p>
      </div>

      <div className="dashboard-table-wrapper">
        <table className="dashboard-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();

                  return (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className={`dashboard-table__sort-btn ${
                            canSort ? "is-sortable" : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                          disabled={!canSort}
                        >
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                          <span className="dashboard-table__sort-indicator">
                            {canSort ? getSortIndicator(header.column) : ""}
                          </span>
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell ??
                        cell.column.columnDef.accessorKey,
                      cell.getContext(),
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default ExecutiveRecentBatchesTable;
