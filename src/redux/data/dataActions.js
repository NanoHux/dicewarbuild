// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let name = "DiceWarNFT";
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.maxSupply()
        .call();
      let cost = await store
        .getState()
        .blockchain.smartContract.methods.maticPrice()
        .call();
      let presaleCost = await store
        .getState()
        .blockchain.smartContract.methods.maticPreSalePrice()
        .call();
      let mintedTokens = await store
        .getState()
        .blockchain.smartContract.methods.mintedTokens()
        .call();
      let newDwtPrice = await store
        .getState()
        .blockchain.smartContract.methods.newDwtMintPrice()
        .call();

      dispatch(
        fetchDataSuccess({
          name,
          totalSupply,
          cost,
          mintedTokens,
          presaleCost,
          newDwtPrice
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
