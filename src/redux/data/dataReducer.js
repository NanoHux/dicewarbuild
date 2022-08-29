const initialState = {
  loading: false,
  name: "",
  totalSupply: 0,
  cost: 0,
  presaleCost: 0,
  mintedTokens : 0,
  newDwtPrice : 0,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        name: action.payload.name,
        totalSupply: action.payload.totalSupply,
        cost: action.payload.cost,
        presaleCost: action.payload.presaleCost,
        mintedTokens : action.payload.mintedTokens,
        newDwtPrice : action.payload.newDwtPrice,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
