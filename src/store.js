// src/store.js
import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from "redux";
import { thunk } from "redux-thunk";

import {
  cookBatchListReducer,
  cookBatchCreateReducer,
  cookBatchDetailReducer,
  cookBatchActualsUpdateReducer,
  recipeListReducer,
  recalibrateReducer,
  userMeReducer,
  accountMeReducer,
  userListReducer,
  userRoleUpdateReducer,
  branchListReducer,
  branchManagerStaffListReducer,
  branchManagerAssignmentDeleteReducer,
  branchManagerBranchListReducer,
  branchManagerAssignmentUpdateReducer,
  branchManagerUserSearchReducer,
  branchManagerAssignmentCreateReducer,
} from "./reducers/cookBatchReducers";

const reducer = combineReducers({
  cookBatchList: cookBatchListReducer,
  cookBatchCreate: cookBatchCreateReducer,
  cookBatchDetail: cookBatchDetailReducer,
  cookBatchActualsUpdate: cookBatchActualsUpdateReducer,
  recipeList: recipeListReducer,
  recalibrate: recalibrateReducer,
  userMe: userMeReducer,
  accountMe: accountMeReducer,
  userList: userListReducer,
  userRoleUpdate: userRoleUpdateReducer,
  branchList: branchListReducer,
  branchManagerStaffList: branchManagerStaffListReducer,
  branchManagerAssignmentDelete: branchManagerAssignmentDeleteReducer,
  branchManagerBranchList: branchManagerBranchListReducer,
  branchManagerAssignmentUpdate: branchManagerAssignmentUpdateReducer,
  branchManagerUserSearch: branchManagerUserSearchReducer,
  branchManagerAssignmentCreate: branchManagerAssignmentCreateReducer,
});

const composeEnhancer =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const initialState = {};
const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(...middleware)),
);

export default store;
