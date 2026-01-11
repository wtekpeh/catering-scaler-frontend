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
} from "./reducers/cookBatchReducers";

const reducer = combineReducers({
  cookBatchList: cookBatchListReducer,
  cookBatchCreate: cookBatchCreateReducer,
  cookBatchDetail: cookBatchDetailReducer,
  cookBatchActualsUpdate: cookBatchActualsUpdateReducer,
  recipeList: recipeListReducer,
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
  composeEnhancer(applyMiddleware(...middleware))
);

export default store;
