import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import React, { useState, useEffect } from "react";
import Swap from "../components/Swap";
import StakingFront from "../components/StakingFront";
import { useAccount, useDisconnect } from "wagmi";
import VideoBg from "../components/videoBg";

export default function HomePage() {
  const [page, setPage] = useState(1);
  
  const handleSwapClick = () => {
    console.log('Swap clicado');
    setPage(0);
  };

  const handleStakingClick = () => {
    setPage(1);
  };
  

  const { isConnected } = useAccount();
  return (
    <>
    {isConnected?<></>:<VideoBg/>}
<div className="header">
            <div className="logo"> </div>
            <div className="menu">
                    <a href="https://www.move-app.com/#Home">Home</a>
                    {page==1? 
                    <a href="#Staking" className="select" onClick={handleStakingClick}>Staking</a>
                    : 
                    <a href="#Staking" onClick={handleStakingClick}>Staking</a>
                    } 
                    {page==0? 
                    <a href="#Swap" className="select" >Swap</a>
                    :
                    <a href="#Swap" >Swap</a>
                    }
                    
                </div>
            </div>
      {/* Custom button */}
      {
        isConnected ?        
          page == 0 ?
            <Swap />
          : 
          page == 1 ?
            <StakingFront />
          : <></>
        : <></>
      }
      <div className="web3buttonGridDesk">
      <Web3Button
          className="web3button"
          icon="show"
          label="Connect Wallet"
          balance="show"
        />
      </div>
      <div className="web3buttonGridMob">
      <Web3Button
          className="web3button"
          label="Connect Wallet"
        />
      </div>
    </>
  );
}
