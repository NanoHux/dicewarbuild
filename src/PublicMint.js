import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import i1 from "./assets/images/1.png";

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #ffffff;
  padding: 10px;
  font-weight: bold;
  color: #000000;
  width: 200px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledSmallButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #ffffff;
  padding: 10px;
  font-weight: bold;
  color: #000000;
  width: 50px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledImg = styled.img`
  width: 200px;
  height: 200px;
  @media (min-width: 767px) {
    width: 350px;
    height: 350px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

function PublicMint() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("Maybe it's your lucky day.");
  const [claimingNft, setClaimingNft] = useState(false);
  //const mintFee = 250;
  const mintFee = data.cost/ 1000000000000000000;

  const [counterAmount, setCounterAmount] = useState(1);
  const incNum = () => {
    if (counterAmount < 20) {
      setCounterAmount(counterAmount+1);
    }
  }
  const decNum = () => {
    if (counterAmount > 1) {
      setCounterAmount(counterAmount-1);
    }
  }

  const redirectTo = (urlInput) => {
    window.location.href = urlInput;
  };

  const publicNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback("Minting your DiceWarNFT...");
    setClaimingNft(true);

    const highGasMint = async() => {
      await blockchain.web3.eth.getGasPrice()
      .then((receipt)=>{
        console.log(receipt)
        blockchain.smartContract.methods
        .mint(_amount)
        .send({
          from: blockchain.account,
          value: data.cost * _amount,
          gasPrice : parseInt(receipt * 1.2 ) 
        })
        .once("error", (err) => {
          alert(err.message + " Page will reload and you can retry connect");
          window.location.reload();
          // setFeedback("Sorry, something went wrong please try again later.");
          // setClaimingNft(false);
        })
        .then((receipt) => {
          setFeedback(
            "WOW, you now own a DiceWarNFT. go visit Opensea.io to view it."
          );
          setClaimingNft(false);
          dispatch(fetchData(blockchain.account));
        });
      });
    }
    highGasMint()

    
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <s.Screen style={{ backgroundColor: "var(--black)" }}>
      <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
        <s.TextTitle
          style={{ textAlign: "center", fontSize: 28, fontWeight: "bold" }}
        >
          Mint a DiceWar NFT with Matic!
        </s.TextTitle>
        <s.SpacerMedium />
        <s.Container ai={"center"} jc={"center"} fd={"row"}>
          
          <StyledButton onClick={(e) => {
                e.preventDefault();
                redirectTo('')}}>$MATIC MINT</StyledButton>
          -------
          <StyledButton onClick={(e) => {
                e.preventDefault();
                redirectTo('DWTMint')}}>$DWT MINT</StyledButton>
        </s.Container>
        <s.SpacerMedium />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }}>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={i1} />
            <s.SpacerMedium />
            <s.TextTitle
              style={{ textAlign: "center", fontSize: 35, fontWeight: "bold" }}
            >
              {Number(data.mintedTokens) === 0 ? "Connect to see" : data.mintedTokens}/1111
            </s.TextTitle>
          </s.Container>
          <s.SpacerMedium />
          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            style={{ backgroundColor: "#383838", padding: 24 }}
          >
            {Number(data.mintedTokens) === 1111 ? (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                  The sale has ended.
                </s.TextTitle>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  You can still find DiceWar NFT on{" "}
                  <a
                    target={"_blank"}
                    rel={"noreferrer"}
                    href={"https://opensea.io/collection/dicewar"}
                  >
                    Opensea.io
                  </a>
                </s.TextDescription>
              </>
            ) : (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                  Each DiceWar NFT costs { mintFee === 0 ? "???" : mintFee  } MATIC.
                </s.TextTitle>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  {feedback}
                </s.TextDescription>
                <s.SpacerMedium />

                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription style={{ textAlign: "center" }}>
                      Connect to the Polygon network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription style={{ textAlign: "center" }}>
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledSmallButton onClick={decNum}> - </StyledSmallButton>
                    <s.TextTitle style={{padding:"16px", fontSize:"22px"}}>{counterAmount}</s.TextTitle>
                    <StyledSmallButton onClick={incNum}> + </StyledSmallButton>
                <s.SpacerLarge />
                    <StyledButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        publicNFTs(counterAmount);
                        getData();
                      }}
                    >
                      {claimingNft ? "BUSY" : "MINT"}
                    </StyledButton>
                  </s.Container>
                )}
              </>
            )}
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerSmall />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription style={{ textAlign: "center", fontSize: 20 }}>
            Please make sure you are connected to the right network (Polygon
            Mainnet) and the correct address. Please note: Once you make the
            purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default PublicMint;
