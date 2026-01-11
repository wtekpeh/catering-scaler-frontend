// src/actions/cookBatchActions.js
import axios from "axios";

import {
  COOKBATCH_LIST_REQUEST,
  COOKBATCH_LIST_SUCCESS,
  COOKBATCH_LIST_FAIL,

  //
  COOKBATCH_CREATE_REQUEST,
  COOKBATCH_CREATE_SUCCESS,
  COOKBATCH_CREATE_FAIL,

  //
  COOKBATCH_DETAIL_REQUEST,
  COOKBATCH_DETAIL_SUCCESS,
  COOKBATCH_DETAIL_FAIL,

  //
  COOKBATCH_ACTUALS_UPDATE_REQUEST,
  COOKBATCH_ACTUALS_UPDATE_SUCCESS,
  COOKBATCH_ACTUALS_UPDATE_FAIL,

  //
  RECIPE_LIST_REQUEST,
  RECIPE_LIST_SUCCESS,
  RECIPE_LIST_FAIL,
} from "../constants/cookBatchConstants";

// Base API URL from Vite env (.env: VITE_API_BASE_URL=http://127.0.0.1:8000)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// --- helpers ---
const getErrorMessage = (error) => {
  // DRF commonly returns {detail: "..."} or field errors
  if (error?.response?.data) {
    const data = error.response.data;

    if (typeof data === "string") return data;
    if (data.detail) return data.detail;

    // If it's an object of field errors, show a compact string
    if (typeof data === "object") {
      try {
        return JSON.stringify(data);
      } catch {
        return "Request failed (could not parse error).";
      }
    }
  }
  return error?.message || "Request failed.";
};

// 1) LIST: GET /api/cooking/batches/
export const listCookBatches = () => async (dispatch) => {
  try {
    dispatch({ type: COOKBATCH_LIST_REQUEST });

    const { data } = await axios.get(`${API_BASE_URL}/api/cooking/batches/`);

    dispatch({
      type: COOKBATCH_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COOKBATCH_LIST_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// 2) CREATE: POST /api/cooking/batches/create/
// Input: { recipe_id, n_people, options, notes }
// options example: { protein: "chicken" }  (adjust to match your backend)
export const createCookBatch =
  ({ recipe_id, n_people, options = {}, notes = "" }) =>
  async (dispatch) => {
    try {
      dispatch({ type: COOKBATCH_CREATE_REQUEST });

      const body = { recipe_id, n_people, options, notes };

      const { data } = await axios.post(
        `${API_BASE_URL}/api/cooking/batches/create/`,
        body,
        { headers: { "Content-Type": "application/json" } }
      );

      dispatch({
        type: COOKBATCH_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: COOKBATCH_CREATE_FAIL,
        payload: getErrorMessage(error),
      });
    }
  };

// 3) DETAIL: GET /api/cooking/batches/:id/
export const getCookBatchDetail = (id) => async (dispatch) => {
  try {
    dispatch({ type: COOKBATCH_DETAIL_REQUEST });

    const { data } = await axios.get(
      `${API_BASE_URL}/api/cooking/batches/${id}/`
    );

    dispatch({
      type: COOKBATCH_DETAIL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COOKBATCH_DETAIL_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// 4) PATCH ACTUALS / FINALIZE: PATCH /api/cooking/batches/:id/actuals/
// payload shape (matches backend):
// {
//   items: [{ id: 123, actual_g: 2000, notes: "..." }, ...],
//   finalize: true|false
// }
//
// Notes:
// - "id" is CookBatchItem.id (must belong to the batch)
// - actual_kg is computed server-side from actual_g

export const updateCookBatchActuals =
  (id, { items = [], finalize = false } = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: COOKBATCH_ACTUALS_UPDATE_REQUEST });

      const body = { items, finalize };

      const { data } = await axios.patch(
        `${API_BASE_URL}/api/cooking/batches/${id}/actuals/`,
        body,
        { headers: { "Content-Type": "application/json" } }
      );

      dispatch({
        type: COOKBATCH_ACTUALS_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: COOKBATCH_ACTUALS_UPDATE_FAIL,
        payload: getErrorMessage(error),
      });
    }
  };

// 0) LIST RECIPES: GET /api/recipes/
// Returns [{ id, name, ... }]
export const listRecipes = () => async (dispatch) => {
  try {
    dispatch({ type: RECIPE_LIST_REQUEST });

    const { data } = await axios.get(`${API_BASE_URL}/api/recipes/`);

    dispatch({
      type: RECIPE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RECIPE_LIST_FAIL,
      payload: getErrorMessage(error),
    });
  }
};
