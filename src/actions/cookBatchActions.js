// src/actions/cookBatchActions.js
import axios from "../api/axiosInstance";

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
  COOKBATCH_POST_REVIEW_REQUEST,
  COOKBATCH_POST_REVIEW_SUCCESS,
  COOKBATCH_POST_REVIEW_FAIL,

  //
  COOKBATCH_ACTUALS_UPDATE_REQUEST,
  COOKBATCH_ACTUALS_UPDATE_SUCCESS,
  COOKBATCH_ACTUALS_UPDATE_FAIL,

  //
  RECIPE_LIST_REQUEST,
  RECIPE_LIST_SUCCESS,
  RECIPE_LIST_FAIL,

  //
  RECALIBRATE_REQUEST,
  RECALIBRATE_SUCCESS,
  RECALIBRATE_FAIL,

  //
  USER_ME_REQUEST,
  USER_ME_SUCCESS,
  USER_ME_FAIL,

  //
  ACCOUNT_ME_REQUEST,
  ACCOUNT_ME_SUCCESS,
  ACCOUNT_ME_FAIL,

  //
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,

  //
  USER_ROLE_UPDATE_REQUEST,
  USER_ROLE_UPDATE_SUCCESS,
  USER_ROLE_UPDATE_FAIL,

  //
  BRANCH_LIST_REQUEST,
  BRANCH_LIST_SUCCESS,
  BRANCH_LIST_FAIL,

  //
  BRANCH_MANAGER_STAFF_LIST_REQUEST,
  BRANCH_MANAGER_STAFF_LIST_SUCCESS,
  BRANCH_MANAGER_STAFF_LIST_FAIL,

  //
  BRANCH_MANAGER_ASSIGNMENT_DELETE_REQUEST,
  BRANCH_MANAGER_ASSIGNMENT_DELETE_SUCCESS,
  BRANCH_MANAGER_ASSIGNMENT_DELETE_FAIL,

  //
  BRANCH_MANAGER_BRANCH_LIST_REQUEST,
  BRANCH_MANAGER_BRANCH_LIST_SUCCESS,
  BRANCH_MANAGER_BRANCH_LIST_FAIL,

  //
  BRANCH_MANAGER_ASSIGNMENT_UPDATE_REQUEST,
  BRANCH_MANAGER_ASSIGNMENT_UPDATE_SUCCESS,
  BRANCH_MANAGER_ASSIGNMENT_UPDATE_FAIL,

  //
  BRANCH_MANAGER_USER_SEARCH_REQUEST,
  BRANCH_MANAGER_USER_SEARCH_SUCCESS,
  BRANCH_MANAGER_USER_SEARCH_FAIL,

  //
  BRANCH_MANAGER_ASSIGNMENT_CREATE_REQUEST,
  BRANCH_MANAGER_ASSIGNMENT_CREATE_SUCCESS,
  BRANCH_MANAGER_ASSIGNMENT_CREATE_FAIL,

  //
  PROTEIN_CHOICE_LIST_REQUEST,
  PROTEIN_CHOICE_LIST_SUCCESS,
  PROTEIN_CHOICE_LIST_FAIL,

  //
  RECIPE_DETAIL_REQUEST,
  RECIPE_DETAIL_SUCCESS,
  RECIPE_DETAIL_FAIL,

  //
  RECIPE_CREATE_REQUEST,
  RECIPE_CREATE_SUCCESS,
  RECIPE_CREATE_FAIL,

  //
  RECIPE_UPDATE_REQUEST,
  RECIPE_UPDATE_SUCCESS,
  RECIPE_UPDATE_FAIL,

  //
  RECIPE_DELETE_REQUEST,
  RECIPE_DELETE_SUCCESS,
  RECIPE_DELETE_FAIL,

  //
  RECIPE_INGREDIENT_LIST_REQUEST,
  RECIPE_INGREDIENT_LIST_SUCCESS,
  RECIPE_INGREDIENT_LIST_FAIL,

  //
  RECIPE_INGREDIENT_CREATE_REQUEST,
  RECIPE_INGREDIENT_CREATE_SUCCESS,
  RECIPE_INGREDIENT_CREATE_FAIL,

  //
  RECIPE_INGREDIENT_UPDATE_REQUEST,
  RECIPE_INGREDIENT_UPDATE_SUCCESS,
  RECIPE_INGREDIENT_UPDATE_FAIL,

  //
  RECIPE_INGREDIENT_DELETE_REQUEST,
  RECIPE_INGREDIENT_DELETE_SUCCESS,
  RECIPE_INGREDIENT_DELETE_FAIL,

  //
  RECIPE_CSV_UPLOAD_REQUEST,
  RECIPE_CSV_UPLOAD_SUCCESS,
  RECIPE_CSV_UPLOAD_FAIL,
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
  ({ recipe_id, branch_id, n_people, options = {}, notes = "" }) =>
  async (dispatch) => {
    try {
      dispatch({ type: COOKBATCH_CREATE_REQUEST });

      const body = { recipe_id, branch_id, n_people, options, notes };

      const { data } = await axios.post(
        `${API_BASE_URL}/api/cooking/batches/create/`,
        body,
        { headers: { "Content-Type": "application/json" } },
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
      `${API_BASE_URL}/api/cooking/batches/${id}/`,
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
        { headers: { "Content-Type": "application/json" } },
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

// POST REVIEW: PATCH /api/cooking/batches/:id/post-review/
export const postReviewUpdateCookBatch = (id, payload) => async (dispatch) => {
  try {
    dispatch({ type: COOKBATCH_POST_REVIEW_REQUEST });

    const { data } = await axios.patch(
      `${API_BASE_URL}/api/cooking/batches/${id}/post-review/`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    dispatch({
      type: COOKBATCH_POST_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COOKBATCH_POST_REVIEW_FAIL,
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

//
// LIST PROTEIN CHOICES: GET /api/recipes/protein-choices/
export const listProteinChoices =
  (recipeId = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: PROTEIN_CHOICE_LIST_REQUEST });

      let url = `${API_BASE_URL}/api/recipes/protein-choices/`;

      if (recipeId) {
        url += `?recipe_id=${recipeId}`;
      }

      const { data } = await axios.get(url);

      dispatch({
        type: PROTEIN_CHOICE_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PROTEIN_CHOICE_LIST_FAIL,
        payload: getErrorMessage(error),
      });
    }
  };

//
export const recalibrateIngredients =
  ({ tau_days = 14 } = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: RECALIBRATE_REQUEST });

      const { data } = await axios.post(
        `${API_BASE_URL}/api/cooking/recalibrate/`,
        { tau_days },
        { headers: { "Content-Type": "application/json" } },
      );

      dispatch({
        type: RECALIBRATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: RECALIBRATE_FAIL,
        payload: getErrorMessage(error),
      });
    }
  };

//
export const getCurrentUser = () => async (dispatch) => {
  try {
    dispatch({ type: USER_ME_REQUEST });

    const { data } = await axios.get(`${API_BASE_URL}/api/accounts/me/`);

    dispatch({
      type: USER_ME_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_ME_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

//Admin Ui Management

export const getAccountMe = () => async (dispatch) => {
  try {
    dispatch({ type: ACCOUNT_ME_REQUEST });

    const { data } = await axios.get(`${API_BASE_URL}/api/accounts/me/`);

    dispatch({
      type: ACCOUNT_ME_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ACCOUNT_ME_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

export const listUsers =
  ({ search = "", role = "", branch = "", page = 1 } = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: USER_LIST_REQUEST });

      let url = `${API_BASE_URL}/api/accounts/users/`;

      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (role) params.append("role", role);
      if (branch) params.append("branch", branch);
      params.append("page", page);

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const { data } = await axios.get(url);

      dispatch({
        type: USER_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_LIST_FAIL,
        payload: getErrorMessage(error),
      });
    }
  };

export const updateUserRoles = (id, roleData) => async (dispatch) => {
  try {
    dispatch({ type: USER_ROLE_UPDATE_REQUEST });

    const { data } = await axios.put(
      `${API_BASE_URL}/api/accounts/users/${id}/roles/`,
      roleData,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    dispatch({
      type: USER_ROLE_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_ROLE_UPDATE_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

export const listBranches = () => async (dispatch) => {
  try {
    dispatch({ type: BRANCH_LIST_REQUEST });

    const { data } = await axios.get(`${API_BASE_URL}/api/accounts/branches/`);

    dispatch({
      type: BRANCH_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BRANCH_LIST_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

export const listBranchManagerStaff =
  ({ search = "", branch = "", role = "", page = 1 } = {}) =>
  async (dispatch) => {
    try {
      dispatch({ type: BRANCH_MANAGER_STAFF_LIST_REQUEST });

      let url = `${API_BASE_URL}/api/accounts/branch-manager/staff/`;

      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (branch) params.append("branch", branch);
      if (role) params.append("role", role);
      params.append("page", page);

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const { data } = await axios.get(url);

      dispatch({
        type: BRANCH_MANAGER_STAFF_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: BRANCH_MANAGER_STAFF_LIST_FAIL,
        payload: getErrorMessage(error),
      });
    }
  };

export const deleteBranchManagerAssignment =
  (assignmentId) => async (dispatch) => {
    try {
      dispatch({ type: BRANCH_MANAGER_ASSIGNMENT_DELETE_REQUEST });

      await axios.delete(
        `${API_BASE_URL}/api/accounts/branch-manager/branch-roles/${assignmentId}/delete/`,
      );

      dispatch({
        type: BRANCH_MANAGER_ASSIGNMENT_DELETE_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: BRANCH_MANAGER_ASSIGNMENT_DELETE_FAIL,
        payload: getErrorMessage(error),
      });
    }
  };

export const listBranchManagerBranches = () => async (dispatch) => {
  try {
    dispatch({ type: BRANCH_MANAGER_BRANCH_LIST_REQUEST });

    const { data } = await axios.get(
      `${API_BASE_URL}/api/accounts/branch-manager/branches/`,
    );

    dispatch({
      type: BRANCH_MANAGER_BRANCH_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BRANCH_MANAGER_BRANCH_LIST_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

export const updateBranchManagerAssignment =
  (assignmentId, payload) => async (dispatch) => {
    try {
      dispatch({ type: BRANCH_MANAGER_ASSIGNMENT_UPDATE_REQUEST });

      const { data } = await axios.put(
        `${API_BASE_URL}/api/accounts/branch-manager/branch-roles/${assignmentId}/`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      dispatch({
        type: BRANCH_MANAGER_ASSIGNMENT_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: BRANCH_MANAGER_ASSIGNMENT_UPDATE_FAIL,
        payload: getErrorMessage(error),
      });
    }
  };

export const searchBranchManagerUsers =
  (search = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: BRANCH_MANAGER_USER_SEARCH_REQUEST });

      let url = `${API_BASE_URL}/api/accounts/branch-manager/user-search/`;

      const params = new URLSearchParams();

      if (search) {
        params.append("search", search);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const { data } = await axios.get(url);

      dispatch({
        type: BRANCH_MANAGER_USER_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: BRANCH_MANAGER_USER_SEARCH_FAIL,
        payload: getErrorMessage(error),
      });
    }
  };

export const createBranchManagerAssignment = (payload) => async (dispatch) => {
  try {
    dispatch({ type: BRANCH_MANAGER_ASSIGNMENT_CREATE_REQUEST });

    const { data } = await axios.post(
      `${API_BASE_URL}/api/accounts/branch-manager/branch-roles/`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    dispatch({
      type: BRANCH_MANAGER_ASSIGNMENT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BRANCH_MANAGER_ASSIGNMENT_CREATE_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// RECIPE DETAIL: GET /api/recipes/:id/
export const getRecipeDetail = (id) => async (dispatch) => {
  try {
    dispatch({ type: RECIPE_DETAIL_REQUEST });

    const { data } = await axios.get(`${API_BASE_URL}/api/recipes/${id}/`);

    dispatch({
      type: RECIPE_DETAIL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RECIPE_DETAIL_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// RECIPE CREATE: POST /api/recipes/manage/
export const createRecipe = (payload) => async (dispatch) => {
  try {
    dispatch({ type: RECIPE_CREATE_REQUEST });

    const { data } = await axios.post(
      `${API_BASE_URL}/api/recipes/manage/`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    dispatch({
      type: RECIPE_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RECIPE_CREATE_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// RECIPE UPDATE: PUT /api/recipes/manage/:id/
export const updateRecipe = (id, payload) => async (dispatch) => {
  try {
    dispatch({ type: RECIPE_UPDATE_REQUEST });

    const { data } = await axios.put(
      `${API_BASE_URL}/api/recipes/manage/${id}/`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    dispatch({
      type: RECIPE_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RECIPE_UPDATE_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// RECIPE DELETE: DELETE /api/recipes/manage/:id/
export const deleteRecipe = (id) => async (dispatch) => {
  try {
    dispatch({ type: RECIPE_DELETE_REQUEST });

    await axios.delete(`${API_BASE_URL}/api/recipes/manage/${id}/`);

    dispatch({
      type: RECIPE_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: RECIPE_DELETE_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// RECIPE INGREDIENT LIST: GET /api/recipes/manage/:recipeId/ingredients/
export const listRecipeIngredients = (recipeId) => async (dispatch) => {
  try {
    dispatch({ type: RECIPE_INGREDIENT_LIST_REQUEST });

    const { data } = await axios.get(
      `${API_BASE_URL}/api/recipes/manage/${recipeId}/ingredients/`,
    );

    dispatch({
      type: RECIPE_INGREDIENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RECIPE_INGREDIENT_LIST_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// RECIPE INGREDIENT CREATE: POST /api/recipes/manage/:recipeId/ingredients/create/
export const createRecipeIngredient =
  (recipeId, payload) => async (dispatch) => {
    try {
      dispatch({ type: RECIPE_INGREDIENT_CREATE_REQUEST });

      const { data } = await axios.post(
        `${API_BASE_URL}/api/recipes/manage/${recipeId}/ingredients/create/`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      dispatch({
        type: RECIPE_INGREDIENT_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: RECIPE_INGREDIENT_CREATE_FAIL,
        payload: getErrorMessage(error),
      });
    }
  };

// RECIPE INGREDIENT UPDATE: PUT /api/recipes/ingredients/:id/manage/
export const updateRecipeIngredient = (id, payload) => async (dispatch) => {
  try {
    dispatch({ type: RECIPE_INGREDIENT_UPDATE_REQUEST });

    const { data } = await axios.put(
      `${API_BASE_URL}/api/recipes/ingredients/${id}/manage/`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    dispatch({
      type: RECIPE_INGREDIENT_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RECIPE_INGREDIENT_UPDATE_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// RECIPE INGREDIENT DELETE: DELETE /api/recipes/ingredients/:id/manage/
export const deleteRecipeIngredient = (id) => async (dispatch) => {
  try {
    dispatch({ type: RECIPE_INGREDIENT_DELETE_REQUEST });

    await axios.delete(`${API_BASE_URL}/api/recipes/ingredients/${id}/manage/`);

    dispatch({
      type: RECIPE_INGREDIENT_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: RECIPE_INGREDIENT_DELETE_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

// RECIPE CSV UPLOAD: POST /api/recipes/manage/import-csv/
export const uploadRecipeCsv = (file) => async (dispatch) => {
  try {
    dispatch({ type: RECIPE_CSV_UPLOAD_REQUEST });

    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post(
      `${API_BASE_URL}/api/recipes/manage/import-csv/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    dispatch({
      type: RECIPE_CSV_UPLOAD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RECIPE_CSV_UPLOAD_FAIL,
      payload: getErrorMessage(error),
    });
  }
};
