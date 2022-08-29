import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import i1 from "./assets/images/1.png";

const { MerkleTree } = require('merkletreejs');
//npm install keccak256
const keccak256 = require('keccak256');

let whitelistAddresses = [
  "0x75CfD5040aa37E183eE6aDB247D2352aE6804eeD",
  "0x0fEA5da7eCFfb55cc24289587533f572A84f9C70",
  "0xF032927f454A430C9fedf71B9Ff5b1AcC0A9D9DF",
  "0x5f8A5a55F554493FDa243c7b4F16065f2D62aF0d",
  "0x06108A9C82Fb7daeb443d4b20057146013d2ed3f",
  "0xf3F71f8032eD6c4A24981d1D8C92Bd96b2D7159a",
  "0x53F30De2D64a52CF1d9bDf83081028088ca09635",
  "0x0B7b470467B5b3b6582D3C5f08125FA97cD9E036",
  "0x3183ace2e285aE5671e3ca92aB8df41E141233D0"
]
export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #ffffff;
  padding: 10px;
  font-weight: bold;
  color: #000000;
  width: 100px;
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

function WhitelistMint() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  console.log(blockchain,data)
  const [feedback, setFeedback] = useState("Only for whitelisted users.");
  const [claimingNft, setClaimingNft] = useState(false);
  //const mintFee = 225;
  const wlMintFee = data.presaleCost / 1000000000000000000;

  const [counterAmount, setCounterAmount] = useState(1);
  const incNum = () => {
    if (counterAmount < 2) {
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

  const whitelistNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback("Minting your DiceWar NFT...");
    setClaimingNft(true);

    const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});

    // const rootHash = merkleTree.getRoot();
    // console.log(rootHash)

    const hashedAddress = keccak256(blockchain.account);
    let claimingAddress;
    //const claimingAddress = connection.selectedAddress;
    for(let i=0; i < leafNodes.length; i++){
        //console.log("leafNodes : ", leafNodes[i], "hashedAddress : ", hashedAddress);
        
        if(hashedAddress.toString() === leafNodes[i].toString()){
            //console.log("Bingo at : ", i);
            claimingAddress = leafNodes[i];
            i = leafNodes.length;
        }
    }
    
    if(claimingAddress != null) {
      const hexProof = merkleTree.getHexProof(claimingAddress);
      const hexProof2 = merkleTree.getProof(claimingAddress);
      console.log(hexProof)
      console.log(hexProof2[0].data.toString('hex'))
      console.log("root is : " + merkleTree.getRoot().toString('hex'))
      console.log("hashedAddress is : " + blockchain.account)

      const highGasMint = async() => {
        await blockchain.web3.eth.getGasPrice()
        .then((receipt)=>{
          console.log("gas price is : " + receipt)
          blockchain.smartContract.methods
          .whitelistMint(_amount, hexProof)
          //.whitelistMint(blockchain.account, _amount, hexProof)
          .send({
            //gasLimit: "285000",
            //to: "0x75CfD5040aa37E183eE6aDB247D2352aE6804eeD",
            //to: "0xeECFfD6bd991AF88dE4c5b075E6F9E6F89C3679a",
            from: blockchain.account,
            value: data.presaleCost * _amount,
            gasPrice : parseInt(receipt * 1.2 ) 
          })
          .once("error", (err) => {
            alert(err.message + " Page will reload and you can retry connect");
            console.log(err);
            window.location.reload();
            // setFeedback("Sorry, something went wrong please try again later.");
            // setClaimingNft(false);
          })
          .then((receipt) => {
            setFeedback(
              "WOW, you now own a DiceWar NFT. go visit Opensea.io to view it."
            );
            setClaimingNft(false);
            dispatch(fetchData(blockchain.account));
          });
        });
      }
      
      highGasMint()
      // console.log("gas1 price is : " + gasPrice)



    } else {
      setFeedback("You are not in whitelist!")
      setClaimingNft(false);
    }
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
          Mint a Whitelist DiceWarNFT
        </s.TextTitle>
        <s.SpacerMedium />
        <s.Container ai={"center"} jc={"center"} fd={"row"}>
          <StyledButton onClick={(e) => {
                e.preventDefault();
                redirectTo('/')}}>Whitelist</StyledButton>
          <StyledButton onClick={(e) => {
                e.preventDefault();
                redirectTo('PublicMint')}}>Public</StyledButton>
          <StyledButton onClick={(e) => {
                e.preventDefault();
                redirectTo('DWTMint')}}>DWTMint</StyledButton>
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
                  You can still find DiceWarNFT on{" "}
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
                  Each Whitelist DiceWarNFT costs { wlMintFee} MATIC.
                </s.TextTitle>
                <s.SpacerXSmall />
            
                <s.TextDescription style={{ textAlign: "center" , color: "red"}}>
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
                      } }
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
                    <s.TextTitle style={{ padding: "16px", fontSize: "22px" }}>{counterAmount}</s.TextTitle>
                    <StyledSmallButton onClick={incNum}> + </StyledSmallButton>
                    <s.SpacerLarge />
                    <StyledButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        whitelistNFTs(counterAmount);
                        getData();
                      } }
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
          <s.TextDescription style={{ textAlign: "center", fontSize: 9 }}>
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

export default WhitelistMint;
