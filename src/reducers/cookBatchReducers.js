// src/reducers/cookBatchReducers.js
import {
  COOKBATCH_LIST_REQUEST,
  COOKBATCH_LIST_SUCCESS,
  COOKBATCH_LIST_FAIL,
  COOKBATCH_LIST_RESET,

  //
  COOKBATCH_CREATE_REQUEST,
  COOKBATCH_CREATE_SUCCESS,
  COOKBATCH_CREATE_FAIL,
  COOKBATCH_CREATE_RESET,

  //
  COOKBATCH_DETAIL_REQUEST,
  COOKBATCH_DETAIL_SUCCESS,
  COOKBATCH_DETAIL_FAIL,
  COOKBATCH_DETAIL_RESET,

  //
  COOKBATCH_ACTUALS_UPDATE_REQUEST,
  COOKBATCH_ACTUALS_UPDATE_SUCCESS,
  COOKBATCH_ACTUALS_UPDATE_FAIL,
  COOKBATCH_ACTUALS_UPDATE_RESET,

  //
  //
  RECIPE_LIST_REQUEST,
  RECIPE_LIST_SUCCESS,
  RECIPE_LIST_FAIL,
  RECIPE_LIST_RESET,
} from "../constants/cookBatchConstants";

// 1) LIST: GET /api/cooking/batches/
export const cookBatchListReducer = (
  state = { loading: false, batches: [] },
  action
) => {
  switch (action.type) {
    case COOKBATCH_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case COOKBATCH_LIST_SUCCESS:
      return { loading: false, batches: action.payload, error: null };

    case COOKBATCH_LIST_FAIL:
      return { loading: false, batches: [], error: action.payload };

    case COOKBATCH_LIST_RESET:
      return { loading: false, batches: [] };

    default:
      return state;
  }
};

// 2) CREATE: POST /api/cooking/batches/create/
export const cookBatchCreateReducer = (
  state = { loading: false, success: false, batch: null },
  action
) => {
  switch (action.type) {
    case COOKBATCH_CREATE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case COOKBATCH_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        batch: action.payload,
        error: null,
      };

    case COOKBATCH_CREATE_FAIL:
      return {
        loading: false,
        success: false,
        batch: null,
        error: action.payload,
      };

    case COOKBATCH_CREATE_RESET:
      return { loading: false, success: false, batch: null };

    default:
      return state;
  }
};

// 3) DETAIL: GET /api/cooking/batches/:id/
export const cookBatchDetailReducer = (
  state = { loading: false, batch: null },
  action
) => {
  switch (action.type) {
    case COOKBATCH_DETAIL_REQUEST:
      // keep current batch (if any) while loading, prevents UI flicker
      return { ...state, loading: true, error: null };

    case COOKBATCH_DETAIL_SUCCESS:
      return { loading: false, batch: action.payload, error: null };

    case COOKBATCH_DETAIL_FAIL:
      return { loading: false, batch: null, error: action.payload };

    case COOKBATCH_DETAIL_RESET:
      return { loading: false, batch: null };

    default:
      return state;
  }
};

// 4) ACTUALS UPDATE / FINALIZE: PATCH /api/cooking/batches/:id/actuals/
export const cookBatchActualsUpdateReducer = (
  state = { loading: false, success: false, updatedBatch: null },
  action
) => {
  switch (action.type) {
    case COOKBATCH_ACTUALS_UPDATE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case COOKBATCH_ACTUALS_UPDATE_SUCCESS:
      return {
        loading: false,
        success: true,
        updatedBatch: action.payload,
        error: null,
      };

    case COOKBATCH_ACTUALS_UPDATE_FAIL:
      return {
        loading: false,
        success: false,
        updatedBatch: null,
        error: action.payload,
      };

    case COOKBATCH_ACTUALS_UPDATE_RESET:
      return { loading: false, success: false, updatedBatch: null };

    default:
      return state;
  }
};

// 5) RECIPE LIST: GET /api/recipes/
export const recipeListReducer = (
  state = { loading: false, recipes: [] },
  action
) => {
  switch (action.type) {
    case RECIPE_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case RECIPE_LIST_SUCCESS:
      return { loading: false, recipes: action.payload, error: null };

    case RECIPE_LIST_FAIL:
      return { loading: false, recipes: [], error: action.payload };

    case RECIPE_LIST_RESET:
      return { loading: false, recipes: [] };

    default:
      return state;
  }
};
