import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { listCookBatches } from "../actions/cookBatchActions";

const CookBatchListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cookBatchList = useSelector((state) => state.cookBatchList);
  const { loading, error, batches } = cookBatchList;

  useEffect(() => {
    dispatch(listCookBatches());
  }, [dispatch]);

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0 }}>Cook Batches</h2>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={() => dispatch(listCookBatches())}>
            Refresh
          </button>

          <button
            type="button"
            onClick={() => navigate("/cooking/batches/create")}
          >
            + Create Batch
          </button>
        </div>
      </div>

      {loading && <p>Loading batches...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <>
          {!batches || batches.length === 0 ? (
            <div style={emptyBox}>
              <p style={{ marginTop: 0 }}>
                No batches yet. Create your first prediction run.
              </p>
              <button
                type="button"
                onClick={() => navigate("/cooking/batches/create")}
              >
                Create Batch
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto", marginTop: 12 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 900,
                }}
              >
                <thead>
                  <tr>
                    <th style={th}>ID</th>
                    <th style={th}>Recipe</th>
                    <th style={th}>People</th>
                    <th style={th}>Protein</th>
                    <th style={th}>Status</th>
                    <th style={th}>Notes</th>
                    <th style={th}>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {batches.map((b) => (
                    <tr
                      key={b.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/cooking/batches/${b.id}`)}
                      title="Open batch detail"
                    >
                      <td style={td}>{b.id}</td>
                      <td style={td}>{b.recipe_name}</td>
                      <td style={td}>{b.n_people}</td>
                      <td style={td}>{b.protein_type || "-"}</td>
                      <td style={td}>
                        <StatusPill status={b.status} />
                      </td>
                      <td style={td} title={b.notes || ""}>
                        {truncate(b.notes || "-", 60)}
                      </td>
                      <td style={td}>{formatDateTime(b.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const emptyBox = {
  marginTop: 14,
  padding: 14,
  border: "1px solid #eee",
  borderRadius: 10,
};

const th = {
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  padding: "10px 8px",
  whiteSpace: "nowrap",
};

const td = {
  borderBottom: "1px solid #f0f0f0",
  padding: "10px 8px",
  whiteSpace: "nowrap",
};

function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function truncate(text, maxLen) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + "…";
}

const StatusPill = ({ status }) => {
  const s = (status || "").toLowerCase();

  const bg = s === "final" ? "#e8f7ee" : s === "draft" ? "#eef2ff" : "#f6f6f6";

  const border =
    s === "final"
      ? "1px solid #a7e2bf"
      : s === "draft"
      ? "1px solid #c7d2fe"
      : "1px solid #ddd";

  const color = s === "final" ? "#0f7a3d" : s === "draft" ? "#3730a3" : "#333";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        background: bg,
        border,
        color,
      }}
    >
      {status}
    </span>
  );
};

export default CookBatchListScreen;
