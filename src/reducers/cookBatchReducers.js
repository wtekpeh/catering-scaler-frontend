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
  PROTEIN_CHOICE_LIST_REQUEST,
  PROTEIN_CHOICE_LIST_SUCCESS,
  PROTEIN_CHOICE_LIST_FAIL,
  PROTEIN_CHOICE_LIST_RESET,

  //
  COOKBATCH_POST_REVIEW_REQUEST,
  COOKBATCH_POST_REVIEW_SUCCESS,
  COOKBATCH_POST_REVIEW_FAIL,
  COOKBATCH_POST_REVIEW_RESET,

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

  //
  BRANCH_MANAGER_STAFF_LIST_REQUEST,
  BRANCH_MANAGER_STAFF_LIST_SUCCESS,
  BRANCH_MANAGER_STAFF_LIST_FAIL,
  BRANCH_MANAGER_STAFF_LIST_RESET,

  //
  BRANCH_MANAGER_ASSIGNMENT_DELETE_REQUEST,
  BRANCH_MANAGER_ASSIGNMENT_DELETE_SUCCESS,
  BRANCH_MANAGER_ASSIGNMENT_DELETE_FAIL,
  BRANCH_MANAGER_ASSIGNMENT_DELETE_RESET,

  //
  BRANCH_MANAGER_BRANCH_LIST_REQUEST,
  BRANCH_MANAGER_BRANCH_LIST_SUCCESS,
  BRANCH_MANAGER_BRANCH_LIST_FAIL,
  BRANCH_MANAGER_BRANCH_LIST_RESET,

  //
  BRANCH_MANAGER_ASSIGNMENT_UPDATE_REQUEST,
  BRANCH_MANAGER_ASSIGNMENT_UPDATE_SUCCESS,
  BRANCH_MANAGER_ASSIGNMENT_UPDATE_FAIL,
  BRANCH_MANAGER_ASSIGNMENT_UPDATE_RESET,

  //
  BRANCH_MANAGER_USER_SEARCH_REQUEST,
  BRANCH_MANAGER_USER_SEARCH_SUCCESS,
  BRANCH_MANAGER_USER_SEARCH_FAIL,
  BRANCH_MANAGER_USER_SEARCH_RESET,

  //
  BRANCH_MANAGER_ASSIGNMENT_CREATE_REQUEST,
  BRANCH_MANAGER_ASSIGNMENT_CREATE_SUCCESS,
  BRANCH_MANAGER_ASSIGNMENT_CREATE_FAIL,
  BRANCH_MANAGER_ASSIGNMENT_CREATE_RESET,

  //
  RECIPE_DETAIL_REQUEST,
  RECIPE_DETAIL_SUCCESS,
  RECIPE_DETAIL_FAIL,
  RECIPE_DETAIL_RESET,

  //
  RECIPE_CREATE_REQUEST,
  RECIPE_CREATE_SUCCESS,
  RECIPE_CREATE_FAIL,
  RECIPE_CREATE_RESET,

  //
  RECIPE_UPDATE_REQUEST,
  RECIPE_UPDATE_SUCCESS,
  RECIPE_UPDATE_FAIL,
  RECIPE_UPDATE_RESET,

  //
  RECIPE_DELETE_REQUEST,
  RECIPE_DELETE_SUCCESS,
  RECIPE_DELETE_FAIL,
  RECIPE_DELETE_RESET,

  //
  RECIPE_INGREDIENT_LIST_REQUEST,
  RECIPE_INGREDIENT_LIST_SUCCESS,
  RECIPE_INGREDIENT_LIST_FAIL,
  RECIPE_INGREDIENT_LIST_RESET,

  //
  RECIPE_INGREDIENT_CREATE_REQUEST,
  RECIPE_INGREDIENT_CREATE_SUCCESS,
  RECIPE_INGREDIENT_CREATE_FAIL,
  RECIPE_INGREDIENT_CREATE_RESET,

  //
  RECIPE_INGREDIENT_UPDATE_REQUEST,
  RECIPE_INGREDIENT_UPDATE_SUCCESS,
  RECIPE_INGREDIENT_UPDATE_FAIL,
  RECIPE_INGREDIENT_UPDATE_RESET,

  //
  RECIPE_INGREDIENT_DELETE_REQUEST,
  RECIPE_INGREDIENT_DELETE_SUCCESS,
  RECIPE_INGREDIENT_DELETE_FAIL,
  RECIPE_INGREDIENT_DELETE_RESET,

  //
  RECIPE_CSV_UPLOAD_REQUEST,
  RECIPE_CSV_UPLOAD_SUCCESS,
  RECIPE_CSV_UPLOAD_FAIL,
  RECIPE_CSV_UPLOAD_RESET,

  //
  COOKBATCH_ACTUALS_LOCK_REQUEST,
  COOKBATCH_ACTUALS_LOCK_SUCCESS,
  COOKBATCH_ACTUALS_LOCK_FAIL,
  COOKBATCH_ACTUALS_LOCK_RESET,

  //
  RECIPE_ACTUALS_LOCK_REQUEST,
  RECIPE_ACTUALS_LOCK_SUCCESS,
  RECIPE_ACTUALS_LOCK_FAIL,
  RECIPE_ACTUALS_LOCK_RESET,

  //
  RECIPE_ACTUALS_UNLOCK_REQUEST,
  RECIPE_ACTUALS_UNLOCK_SUCCESS,
  RECIPE_ACTUALS_UNLOCK_FAIL,
  RECIPE_ACTUALS_UNLOCK_RESET,
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

//
export const cookBatchPostReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case COOKBATCH_POST_REVIEW_REQUEST:
      return { loading: true };

    case COOKBATCH_POST_REVIEW_SUCCESS:
      return { loading: false, success: true };

    case COOKBATCH_POST_REVIEW_FAIL:
      return { loading: false, error: action.payload };

    case COOKBATCH_POST_REVIEW_RESET:
      return {};

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

// 6) PROTEIN CHOICES: GET /api/recipes/protein-choices/
export const proteinChoiceListReducer = (
  state = { loading: false, proteinChoices: [] },
  action,
) => {
  switch (action.type) {
    case PROTEIN_CHOICE_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case PROTEIN_CHOICE_LIST_SUCCESS:
      return {
        loading: false,
        proteinChoices: action.payload.results || [],
        error: null,
      };

    case PROTEIN_CHOICE_LIST_FAIL:
      return {
        loading: false,
        proteinChoices: [],
        error: action.payload,
      };

    case PROTEIN_CHOICE_LIST_RESET:
      return { loading: false, proteinChoices: [] };

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
  state = {
    loading: false,
    users: [],
    count: 0,
    next: null,
    previous: null,
  },
  action,
) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case USER_LIST_SUCCESS:
      return {
        loading: false,
        users: action.payload.results || [],
        count: action.payload.count || 0,
        next: action.payload.next || null,
        previous: action.payload.previous || null,
        error: null,
      };

    case USER_LIST_FAIL:
      return {
        loading: false,
        users: [],
        count: 0,
        next: null,
        previous: null,
        error: action.payload,
      };

    case USER_LIST_RESET:
      return {
        loading: false,
        users: [],
        count: 0,
        next: null,
        previous: null,
      };

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

export const branchManagerStaffListReducer = (
  state = {
    loading: false,
    staff: [],
    count: 0,
    next: null,
    previous: null,
  },
  action,
) => {
  switch (action.type) {
    case BRANCH_MANAGER_STAFF_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case BRANCH_MANAGER_STAFF_LIST_SUCCESS:
      return {
        loading: false,
        staff: action.payload.results || [],
        count: action.payload.count || 0,
        next: action.payload.next || null,
        previous: action.payload.previous || null,
        error: null,
      };

    case BRANCH_MANAGER_STAFF_LIST_FAIL:
      return {
        loading: false,
        staff: [],
        count: 0,
        next: null,
        previous: null,
        error: action.payload,
      };

    case BRANCH_MANAGER_STAFF_LIST_RESET:
      return {
        loading: false,
        staff: [],
        count: 0,
        next: null,
        previous: null,
      };

    default:
      return state;
  }
};

export const branchManagerAssignmentDeleteReducer = (
  state = { loading: false, success: false },
  action,
) => {
  switch (action.type) {
    case BRANCH_MANAGER_ASSIGNMENT_DELETE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case BRANCH_MANAGER_ASSIGNMENT_DELETE_SUCCESS:
      return { loading: false, success: true, error: null };

    case BRANCH_MANAGER_ASSIGNMENT_DELETE_FAIL:
      return { loading: false, success: false, error: action.payload };

    case BRANCH_MANAGER_ASSIGNMENT_DELETE_RESET:
      return { loading: false, success: false };

    default:
      return state;
  }
};

export const branchManagerBranchListReducer = (
  state = { loading: false, branches: [] },
  action,
) => {
  switch (action.type) {
    case BRANCH_MANAGER_BRANCH_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case BRANCH_MANAGER_BRANCH_LIST_SUCCESS:
      return { loading: false, branches: action.payload, error: null };

    case BRANCH_MANAGER_BRANCH_LIST_FAIL:
      return { loading: false, branches: [], error: action.payload };

    case BRANCH_MANAGER_BRANCH_LIST_RESET:
      return { loading: false, branches: [] };

    default:
      return state;
  }
};

export const branchManagerAssignmentUpdateReducer = (
  state = { loading: false, success: false, assignment: null },
  action,
) => {
  switch (action.type) {
    case BRANCH_MANAGER_ASSIGNMENT_UPDATE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case BRANCH_MANAGER_ASSIGNMENT_UPDATE_SUCCESS:
      return {
        loading: false,
        success: true,
        assignment: action.payload,
        error: null,
      };

    case BRANCH_MANAGER_ASSIGNMENT_UPDATE_FAIL:
      return {
        loading: false,
        success: false,
        assignment: null,
        error: action.payload,
      };

    case BRANCH_MANAGER_ASSIGNMENT_UPDATE_RESET:
      return { loading: false, success: false, assignment: null };

    default:
      return state;
  }
};

export const branchManagerUserSearchReducer = (
  state = { loading: false, users: [] },
  action,
) => {
  switch (action.type) {
    case BRANCH_MANAGER_USER_SEARCH_REQUEST:
      return { ...state, loading: true, error: null };

    case BRANCH_MANAGER_USER_SEARCH_SUCCESS:
      return { loading: false, users: action.payload, error: null };

    case BRANCH_MANAGER_USER_SEARCH_FAIL:
      return { loading: false, users: [], error: action.payload };

    case BRANCH_MANAGER_USER_SEARCH_RESET:
      return { loading: false, users: [] };

    default:
      return state;
  }
};

export const branchManagerAssignmentCreateReducer = (
  state = { loading: false, success: false, assignment: null },
  action,
) => {
  switch (action.type) {
    case BRANCH_MANAGER_ASSIGNMENT_CREATE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case BRANCH_MANAGER_ASSIGNMENT_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        assignment: action.payload,
        error: null,
      };

    case BRANCH_MANAGER_ASSIGNMENT_CREATE_FAIL:
      return {
        loading: false,
        success: false,
        assignment: null,
        error: action.payload,
      };

    case BRANCH_MANAGER_ASSIGNMENT_CREATE_RESET:
      return { loading: false, success: false, assignment: null };

    default:
      return state;
  }
};

export const recipeDetailReducer = (
  state = { loading: false, recipe: null },
  action,
) => {
  switch (action.type) {
    case RECIPE_DETAIL_REQUEST:
      return { ...state, loading: true, error: null };

    case RECIPE_DETAIL_SUCCESS:
      return { loading: false, recipe: action.payload, error: null };

    case RECIPE_DETAIL_FAIL:
      return { loading: false, recipe: null, error: action.payload };

    case RECIPE_DETAIL_RESET:
      return { loading: false, recipe: null };

    default:
      return state;
  }
};

export const recipeCreateReducer = (
  state = { loading: false, success: false, recipe: null },
  action,
) => {
  switch (action.type) {
    case RECIPE_CREATE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case RECIPE_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        recipe: action.payload,
        error: null,
      };

    case RECIPE_CREATE_FAIL:
      return {
        loading: false,
        success: false,
        recipe: null,
        error: action.payload,
      };

    case RECIPE_CREATE_RESET:
      return { loading: false, success: false, recipe: null };

    default:
      return state;
  }
};

export const recipeUpdateReducer = (
  state = { loading: false, success: false, recipe: null },
  action,
) => {
  switch (action.type) {
    case RECIPE_UPDATE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case RECIPE_UPDATE_SUCCESS:
      return {
        loading: false,
        success: true,
        recipe: action.payload,
        error: null,
      };

    case RECIPE_UPDATE_FAIL:
      return {
        loading: false,
        success: false,
        recipe: null,
        error: action.payload,
      };

    case RECIPE_UPDATE_RESET:
      return { loading: false, success: false, recipe: null };

    default:
      return state;
  }
};

export const recipeDeleteReducer = (
  state = { loading: false, success: false },
  action,
) => {
  switch (action.type) {
    case RECIPE_DELETE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case RECIPE_DELETE_SUCCESS:
      return { loading: false, success: true, error: null };

    case RECIPE_DELETE_FAIL:
      return { loading: false, success: false, error: action.payload };

    case RECIPE_DELETE_RESET:
      return { loading: false, success: false };

    default:
      return state;
  }
};

export const recipeIngredientListReducer = (
  state = { loading: false, ingredients: [] },
  action,
) => {
  switch (action.type) {
    case RECIPE_INGREDIENT_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case RECIPE_INGREDIENT_LIST_SUCCESS:
      return {
        loading: false,
        ingredients: action.payload,
        error: null,
      };

    case RECIPE_INGREDIENT_LIST_FAIL:
      return {
        loading: false,
        ingredients: [],
        error: action.payload,
      };

    case RECIPE_INGREDIENT_LIST_RESET:
      return { loading: false, ingredients: [] };

    default:
      return state;
  }
};

export const recipeIngredientCreateReducer = (
  state = { loading: false, success: false, ingredient: null },
  action,
) => {
  switch (action.type) {
    case RECIPE_INGREDIENT_CREATE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case RECIPE_INGREDIENT_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        ingredient: action.payload,
        error: null,
      };

    case RECIPE_INGREDIENT_CREATE_FAIL:
      return {
        loading: false,
        success: false,
        ingredient: null,
        error: action.payload,
      };

    case RECIPE_INGREDIENT_CREATE_RESET:
      return { loading: false, success: false, ingredient: null };

    default:
      return state;
  }
};

export const recipeIngredientUpdateReducer = (
  state = { loading: false, success: false, ingredient: null },
  action,
) => {
  switch (action.type) {
    case RECIPE_INGREDIENT_UPDATE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case RECIPE_INGREDIENT_UPDATE_SUCCESS:
      return {
        loading: false,
        success: true,
        ingredient: action.payload,
        error: null,
      };

    case RECIPE_INGREDIENT_UPDATE_FAIL:
      return {
        loading: false,
        success: false,
        ingredient: null,
        error: action.payload,
      };

    case RECIPE_INGREDIENT_UPDATE_RESET:
      return { loading: false, success: false, ingredient: null };

    default:
      return state;
  }
};

export const recipeIngredientDeleteReducer = (
  state = { loading: false, success: false },
  action,
) => {
  switch (action.type) {
    case RECIPE_INGREDIENT_DELETE_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case RECIPE_INGREDIENT_DELETE_SUCCESS:
      return { loading: false, success: true, error: null };

    case RECIPE_INGREDIENT_DELETE_FAIL:
      return { loading: false, success: false, error: action.payload };

    case RECIPE_INGREDIENT_DELETE_RESET:
      return { loading: false, success: false };

    default:
      return state;
  }
};

export const recipeCsvUploadReducer = (
  state = { loading: false, success: false, result: null },
  action,
) => {
  switch (action.type) {
    case RECIPE_CSV_UPLOAD_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case RECIPE_CSV_UPLOAD_SUCCESS:
      return {
        loading: false,
        success: true,
        result: action.payload,
        error: null,
      };

    case RECIPE_CSV_UPLOAD_FAIL:
      return {
        loading: false,
        success: false,
        result: null,
        error: action.payload,
      };

    case RECIPE_CSV_UPLOAD_RESET:
      return { loading: false, success: false, result: null };

    default:
      return state;
  }
};

export const cookBatchActualsLockReducer = (
  state = { loading: false, success: false },
  action,
) => {
  switch (action.type) {
    case COOKBATCH_ACTUALS_LOCK_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case COOKBATCH_ACTUALS_LOCK_SUCCESS:
      return { loading: false, success: true, error: null };

    case COOKBATCH_ACTUALS_LOCK_FAIL:
      return { loading: false, success: false, error: action.payload };

    case COOKBATCH_ACTUALS_LOCK_RESET:
      return { loading: false, success: false };

    default:
      return state;
  }
};

export const recipeActualsLockReducer = (
  state = { loading: false, success: false, result: null },
  action,
) => {
  switch (action.type) {
    case RECIPE_ACTUALS_LOCK_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case RECIPE_ACTUALS_LOCK_SUCCESS:
      return {
        loading: false,
        success: true,
        result: action.payload,
        error: null,
      };

    case RECIPE_ACTUALS_LOCK_FAIL:
      return {
        loading: false,
        success: false,
        result: null,
        error: action.payload,
      };

    case RECIPE_ACTUALS_LOCK_RESET:
      return { loading: false, success: false, result: null };

    default:
      return state;
  }
};

export const recipeActualsUnlockReducer = (
  state = { loading: false, success: false, result: null },
  action,
) => {
  switch (action.type) {
    case RECIPE_ACTUALS_UNLOCK_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case RECIPE_ACTUALS_UNLOCK_SUCCESS:
      return {
        loading: false,
        success: true,
        result: action.payload,
        error: null,
      };

    case RECIPE_ACTUALS_UNLOCK_FAIL:
      return {
        loading: false,
        success: false,
        result: null,
        error: action.payload,
      };

    case RECIPE_ACTUALS_UNLOCK_RESET:
      return { loading: false, success: false, result: null };

    default:
      return state;
  }
};
