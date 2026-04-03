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

  //
  RECALIBRATE_REQUEST,
  RECALIBRATE_SUCCESS,
  RECALIBRATE_FAIL,
  RECALIBRATE_RESET,

  //
  USER_ME_REQUEST,
  USER_ME_SUCCESS,
  USER_ME_FAIL,

  //
  ACCOUNT_ME_REQUEST,
  ACCOUNT_ME_SUCCESS,
  ACCOUNT_ME_FAIL,
  ACCOUNT_ME_RESET,

  //
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,

  //
  USER_ROLE_UPDATE_REQUEST,
  USER_ROLE_UPDATE_SUCCESS,
  USER_ROLE_UPDATE_FAIL,
  USER_ROLE_UPDATE_RESET,

  //
  BRANCH_LIST_REQUEST,
  BRANCH_LIST_SUCCESS,
  BRANCH_LIST_FAIL,
  BRANCH_LIST_RESET,
} from "../constants/cookBatchConstants";

// 1) LIST: GET /api/cooking/batches/
export const cookBatchListReducer = (
  state = { loading: false, batches: [] },
  action,
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
  action,
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
  action,
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
  action,
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
  action,
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

export const recalibrateReducer = (
  state = { loading: false, success: false, result: null },
  action,
) => {
  switch (action.type) {
    case RECALIBRATE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case RECALIBRATE_SUCCESS:
      return {
        loading: false,
        success: true,
        result: action.payload,
        error: null,
      };

    case RECALIBRATE_FAIL:
      return {
        loading: false,
        success: false,
        result: null,
        error: action.payload,
      };

    case RECALIBRATE_RESET:
      return { loading: false, success: false, result: null };

    default:
      return state;
  }
};

export const userMeReducer = (
  state = { loading: false, user: null },
  action,
) => {
  switch (action.type) {
    case USER_ME_REQUEST:
      return { ...state, loading: true, error: null };

    case USER_ME_SUCCESS:
      return { loading: false, user: action.payload, error: null };

    case USER_ME_FAIL:
      return { loading: false, user: null, error: action.payload };

    default:
      return state;
  }
};

export const accountMeReducer = (
  state = { loading: false, user: null },
  action,
) => {
  switch (action.type) {
    case ACCOUNT_ME_REQUEST:
      return { ...state, loading: true, error: null };

    case ACCOUNT_ME_SUCCESS:
      return { loading: false, user: action.payload, error: null };

    case ACCOUNT_ME_FAIL:
      return { loading: false, user: null, error: action.payload };

    case ACCOUNT_ME_RESET:
      return { loading: false, user: null };

    default:
      return state;
  }
};

export const userListReducer = (
  state = { loading: false, users: [] },
  action,
) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case USER_LIST_SUCCESS:
      return { loading: false, users: action.payload, error: null };

    case USER_LIST_FAIL:
      return { loading: false, users: [], error: action.payload };

    case USER_LIST_RESET:
      return { loading: false, users: [] };

    default:
      return state;
  }
};

export const userRoleUpdateReducer = (
  state = { loading: false, success: false, user: null },
  action,
) => {
  switch (action.type) {
    case USER_ROLE_UPDATE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case USER_ROLE_UPDATE_SUCCESS:
      return {
        loading: false,
        success: true,
        user: action.payload,
        error: null,
      };

    case USER_ROLE_UPDATE_FAIL:
      return {
        loading: false,
        success: false,
        user: null,
        error: action.payload,
      };

    case USER_ROLE_UPDATE_RESET:
      return { loading: false, success: false, user: null };

    default:
      return state;
  }
};

export const branchListReducer = (
  state = { loading: false, branches: [] },
  action,
) => {
  switch (action.type) {
    case BRANCH_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case BRANCH_LIST_SUCCESS:
      return { loading: false, branches: action.payload, error: null };

    case BRANCH_LIST_FAIL:
      return { loading: false, branches: [], error: action.payload };

    case BRANCH_LIST_RESET:
      return { loading: false, branches: [] };

    default:
      return state;
  }
};
