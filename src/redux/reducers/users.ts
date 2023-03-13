import { DataItem, DefaultState } from "../../interfaces";
import { ACTIONS } from "../constants";

const defaultState: DefaultState = {
  data: [],
  tableData: [],
};

export const users = (state = defaultState, action: { type: string, data: DataItem }) => {
  switch (action.type) {
    case ACTIONS.GET_USERS: {
      return { ...state, data: action.data, tableData: action.data};
    }

    case ACTIONS.GET_TABLE_USERS: {
      return { ...state, tableData: action.data };
    }
    default:
      return state;
  }
};
