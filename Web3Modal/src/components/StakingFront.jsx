import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import StakingContractABI from "./StakingContractABI.json";
import TokenContractABI from "./TokenContractABI.json"; 
import contractABI from "./factory.json"; 
import wbnbABI from "./wbnb.json"; 


const StakingFront = () => {
  
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isShowInfos, setShowInfos] = useState(false);
    const [isNftPopupOpen, setNftPopupOpen] = useState(false);
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [userAmount, setUserAmount] = useState(0);
    const [Amount, setAmount] = useState(0);
    const [pendingRewards, setPendingRewards] = useState(0);
    const [remainingLockTime, setRemainingLockTime] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isApproveLoading, setIsApproveLoading] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [userTokensCount, setTokensCount] = useState(0);
    const [totalStaked, setTotalStaked] = useState("0");
    const [bnbDol, setBnbDol] = useState(0);

    const initializeWeb3_2 = async () => {
        let provider;

        if (window.ethereum) {
            provider = window.ethereum;
            try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (error) {
            console.error('User denied access to wallet.');
            return;
            }
        }
        else {
            
            console.error('User denied access wallet');
            
        }

        // Criamos uma instância de web3 com o provider selecionado
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
        
        try {
            const accounts = await web3Instance.eth.getAccounts();
            setAccounts(accounts);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error('Could not get accounts.');
        }
    };
  
    const initializeContract = () => {
      const contractAddress = "0x88ef26d260b54CcBfee1dA875cb4Fb94711C56dE";
      const contractInstance = new web3.eth.Contract(
        StakingContractABI,
        contractAddress
      );
      setContract(contractInstance);
    };
  
    const approveTokens = async () => {
      if (!contract || !currentAccount) {
        return;
      }
  
      setIsApproveLoading(true);
  
      try {
        const tokenAddress = "0x95Ca12cd249D27008a482009e101a8501cf3a64f"; // Substitua pelo endereço do contrato do token
        const tokenContract = new web3.eth.Contract(TokenContractABI, tokenAddress);
  
        const allowance = await tokenContract.methods.allowance(currentAccount, contract.options.address).call();
  
        console.log(Amount+' Approval allowance '+allowance);
        if (allowance===0|| allowance < web3.utils.toWei(Amount, 'ether')) {
          await tokenContract.methods.approve(contract.options.address, web3.utils.toWei("1000000000", 'ether')).send({ 
            from: currentAccount, 
            gasPrice: web3.utils.toWei("3", 'gwei'),
            gas: 3000000
          });
          console.log('Approval successful');
          setIsApproved(true);
        } else {
          console.log('Contract is already approved');
          setIsApproved(true);
        }
      } catch (error) {
        console.error('Error approving tokens:', error);
        setIsApproved(false);
      } finally {
        console.log('approveTokens finally');
        setIsApproveLoading(false);
      }
    };  
    
    const harvestRewards = async () => {
      if (!contract || !currentAccount) {
        return;
      }
  if(pendingRewards<=0)
  {
    alert("No rewards");
    return;
  }
      setIsLoading(true);
  
      try {
        await contract.methods.harvestRewards().send({ from: currentAccount,
          gasPrice: web3.utils.toWei("3", 'gwei')});
        console.log('Rewards harvested successfully');
        updateData();
      } catch (error) {
        console.error('Error harvesting rewards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReserves = async () => {
      let bnb = 0;
      try{
        const contractAddress = '0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE';
        const contract = new web3.eth.Contract(wbnbABI, contractAddress);

        const reserves = await contract.methods.getReserves().call();
        
        const a =web3.utils.fromWei(reserves._reserve0, 'ether');
        const b = web3.utils.fromWei(reserves._reserve1, 'ether');
        console.log((a/ b)+" a "+a+"\n b "+b);
        bnb = a/ b;
      } catch (error) {
        console.error('Erro ao buscar as reservas:', error);
      }
      try{
        const contractAddress = '0xfEC2bEc0F032462e6E1bC8CB97ccde7c93be4A3b';
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        const reserves = await contract.methods.getReserves().call();
        
        const a =web3.utils.fromWei(reserves._reserve0, 'ether');
        const b = web3.utils.fromWei(reserves._reserve1, 'ether');
        const valueInBnb = (b / a)*bnb;
        console.log(bnb+" valueInBnb "+(valueInBnb)+"\n "+a+"\n "+b);
        setBnbDol(valueInBnb);
      } catch (error) {
        console.error('Erro ao buscar as reservas:', error);
      }
    };

    const updateData = async () => {
      console.log("updateData "+(!contract || !currentAccount));
      if (!contract || !currentAccount) {
        return;
      }
      fetchReserves();
      setIsLoading(true);
      try {
        const t = await contract.methods.totalstakedAmount().call();
        setTotalStaked(web3.utils.fromWei(t, 'ether'));
        const lockTime = await contract.methods.remainLockTime(currentAccount).call();
        setRemainingLockTime(lockTime);
    
        const pendingRewardsWei = await contract.methods.pendingReward(currentAccount).call();
        const userPendingRewardsEther = web3.utils.fromWei(pendingRewardsWei, 'ether');
        const formattedPendingRewards = parseFloat(userPendingRewardsEther).toFixed(18);
        const firstThreeDigits = formattedPendingRewards.slice(0, 5); // Pega os 3 primeiros dígitos
        setPendingRewards(firstThreeDigits);
    
        const userInfo = await contract.methods.userInfo(currentAccount).call();
        const userAmountWei = userInfo.amount;
        const userRewardDebtWei = userInfo.rewardDebt;
        const userAmountEther = web3.utils.fromWei(userAmountWei, 'ether');
        setUserAmount(userAmountEther);
    
        const tokenAddress = "0x95Ca12cd249D27008a482009e101a8501cf3a64f"; // Substitua pelo endereço do contrato do token
        const tokenContract = new web3.eth.Contract(TokenContractABI, tokenAddress);
        const balance = await tokenContract.methods.balanceOf(currentAccount).call();
        setTokensCount(web3.utils.fromWei(balance.toString(), 'ether'));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const stakeTokens = async () => {
      if (!contract || !Amount || Amount <= 0 || !currentAccount) {
        return;
      }
      setIsApproved(false);
      setIsLoading(true);
      setIsApproveLoading(true);
      try {
        const amountInWei = web3.utils.toWei(Amount.toString(), 'ether');
        await contract.methods.deposit(amountInWei).send({ 
          from: currentAccount, 
          gasPrice: web3.utils.toWei("3", 'gwei')});
        console.log('Staking successful');
        alert("Stake success");
        updateData();
      } catch (error) {
        console.error('Error staking:', error);
      } finally {
        setIsLoading(false);
        setIsApproveLoading(false);
        handleClosePopup();
      }
    };

    const setMaxToken= async () => {
      setAmount(userTokensCount-1);
    }

    const withdrawTokens = async () => {
      if (!contract || !Amount || Amount <= 0 || !currentAccount) {
        return;
      }
  
      setIsLoading(true);
  
      try {
        const amountInWei = web3.utils.toWei(Amount.toString(), 'ether');
        await contract.methods.withdraw(amountInWei).send({ from: currentAccount, 
          gasPrice: web3.utils.toWei("3", 'gwei'),
          gas: 3000000 });
        console.log('Withdraw successful');
        updateData();
      } catch (error) {
        console.error('Error withdrawing:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const withdrawAllTokens = async () => {
      if (!contract || userAmount <= 0 || !currentAccount) {
        return;
      }
      if(remainingLockTime>0){
        alert("Wait "+remainingLockTime+" s to withdraw tokens");
        return;
      }
  
      setIsLoading(true);
  
      try {
        const amountInWei = web3.utils.toWei(userAmount.toString(), 'ether');
        await contract.methods.withdraw(amountInWei).send({ from: currentAccount, 
          gasPrice: web3.utils.toWei("3", 'gwei'),
          gas: 3000000 });
        console.log('Withdraw All successful');
        updateData();
      } catch (error) {
        console.error('Error withdrawing:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      initializeWeb3_2();
    }, []);
    
    useEffect(() => {
      if (web3) {
        initializeContract();
        const intervalId = setInterval(() => {
          updateData();
        }, 5000);
  
        window.ethereum.on("accountsChanged", (newAccounts) => {
          setAccounts(newAccounts);
          setCurrentAccount(newAccounts[0]);
        });
  
        if (currentAccount) {
          updateData();
        }
  
        return () => {
          clearInterval(intervalId);
        };
      }
    }, [web3, currentAccount]);

    const handleButtonClick = () => {  
         
      setIsPopupOpen(true);
    };
  
    const handleClosePopup = () => {
      setIsPopupOpen(false);
    };
    const handleOpenNftPopup = () => {
      setShowInfos(false);
      setNftPopupOpen(true);
    };
    const handleCloseNftPopup = () => {
      setNftPopupOpen(false);
    };
    const handleShowInfos = () => {
      setShowInfos(true);
    };
    const handleShowInfosClose = () => {
      setShowInfos(false);
    };
    function formatNumber(value) {
      const integerPart = Math.floor(value);
      const decimalPart = Math.round((value - integerPart) * 100);  // Pegue apenas 2 casas decimais
  
      // Formate a parte inteira com pontos como separadores de milhar
      const integerFormatted = integerPart.toLocaleString('de-DE');
  
      // Combine a parte inteira formatada com a parte decimal
      return `${integerFormatted},${decimalPart.toString().padStart(2, '0')}`;
  }

    return (
        <div style={{backgroundColor: '#ffffff'}}>   
            <div className="staking"> </div>
            <div className="line">
                <div className="moveStaking">
                    <div className="moveStakingIcon"></div> 
                    Move Staking Dashboard
                    </div>
                </div>
                
            <button className="NFT" onClick={handleOpenNftPopup} type="button"></button>

            <div className="boxesLine">
                <div className="stakingPanel">
                {currentAccount==null ? (
                <>
                <p>Connect first.</p>
                <button className="stake" onClick={initializeWeb3_2} type="button">Connect</button>
                </>
        ) : (
            <>
                    <div className="title">MY Move Staking</div>
                    <div className="wallet">Wallet: {currentAccount && currentAccount.slice(0, 4)}...{currentAccount && currentAccount.slice(-4)}</div>
                    <div style={{ height: '35px' }}></div> {/* Espaço */}
                    <div className="textoEspacoTexto">
                        <span className="title2">TOTAL STAKED</span>
                        <span className="title2">PENDING REWARDS</span>
                    </div>
                    <div className="textoEspacoTexto">
                        <span className="value">{formatNumber(userAmount)}</span>
                        <span className="info">MOVE</span>
                        <span className="value">{pendingRewards}</span>
                        <span className="info">USDT</span>
                    </div>
                    <button className="stake" onClick={handleButtonClick} type="button">STAKE</button>
                    <div style={{ height: '15px' }}></div> {/* Espaço */}
                    <div className="textoEspacoTexto">
                    <button className="withdraw" onClick={withdrawAllTokens} type="button">UNSTAKE ({remainingLockTime}) s</button>
                    <button className="withdraw" onClick={harvestRewards} type="button">WITHDRAW REWARDS</button>
                    </div>
                    </>
                    )}
                </div>
                <div className="boxesViertical">
                    <div className="horizontal">
                        <div className="totalStaked">
                            <div className="textA">Total Staked</div>
                            <div className="textB">{formatNumber(totalStaked)} MOVE</div>
                            <div className="textC">$--</div>
                        </div>
                        <div className="estimatedRewards">
                            <div className="textD">Your Total Rewards</div>
                            <div className="textE">-- USDT</div>
                        </div>
                    </div>
                    <div className="moveStatus">
                        <div className="textI">Move stats</div>
                    <div style={{ height: '20px' }}></div> {/* Espaço */}
                        <div className="textoEspacoTexto">
                            <span className="textG">PRICE</span>
                            <span className="textG">STAKED TOKENS</span>
                            <span className="textG">CIRCULATION SUPLY</span>
                        </div>
                        <div className="textoEspacoTexto">
                            <span className="textH">{bnbDol.toFixed(4)} USDT</span>
                            <span className="textH">{(totalStaked/239000000*100).toFixed(2)}%</span>
                            <span className="textH">{formatNumber(239000000)} MOVE</span>
                        </div>
                    </div>
                </div>
            </div>

            {isNftPopupOpen && (
            <div className="overlay" onClick={handleCloseNftPopup}>
              <div className="popup2" onClick={(e) => e.stopPropagation()}>
                {
                  isShowInfos ?(
                    <>
                    <button style={{cursor:"pointer",background:"none",border:"none",fontSize:"25",fontWeight:"blod"}} onClick={handleShowInfosClose}>&lt;</button>
                    <h3 style={{ textAlign: 'center', color: '#333' }}>
                        🌟 Invest your Tokens and Win Mystery Boxes! 🌟
                      </h3>
                      <p style={{ color: '#555' }}>
                        Discover the thrill of opening our <strong>Mystery Boxes</strong>, available in three exclusive tiers, based on the number of tokens you have:
                      </p>
                      <ul style={{ paddingLeft: '20px', color: '#555' }}>
                        <li>🔘 <strong>Common</strong> (between 100.000 and 400.000 tokens)</li>
                        <li>🔴 <strong>Rare</strong> (between 200.000 and 400.000 tokens)</li>
                        <li>🟠 <strong>Legendary</strong> (between 400.000 and 1.000.000 tokens)</li>
                        <li>🟠🔴 <strong>Legendary+Rare</strong> (more than 1.000.000 tokens)</li>
                      </ul>
                      <p style={{ fontWeight: 'bold', color: '#555' }}>
                        💎 What can you win?
                      </p>
                      <p style={{ color: '#555' }}>
                        - 1 exclusive sneakers from the rarity of your box -Guaranteed-<br />
                        - Mysterious rewards, including additional tokens, precious gems, and valuable consumable items. -random-
                      </p>
                      <p style={{ fontWeight: 'bold', color: '#555' }}>Don’t stop there!</p>
                      <p style={{ color: '#555' }}>
                        You can either open your box to discover your rewards or sell it on the market.
                      </p>
                      <p style={{ fontWeight: 'bold', color: '#555' }}>👟 Boost your chances in the game</p>
                      <p style={{ color: '#555' }}>
                        Use your new sneakers to perform activities in the game. Remember: better sneakers increase your chances of success!
                      </p>
                      <div style={{ textAlign: 'center', color: '#333' }}>
                        <strong>Start investing now and discover a world of possibilities and rewards!</strong>
                      </div>
                    
                    </>
                  ):(
                  <>
                <button className="closeButton" onClick={handleCloseNftPopup}>X</button>
                <div style={{display: "flex", gap: "20px"}}>
                <div>Collect prize  </div><button className="infos" onClick={handleShowInfos}  type="button" >?</button>
                </div>
                    <div style={{ height: '10px' }}></div> {/* Espaço */}                    
                    <div className="videoTeste">
                    <video 
                      onClick={(e) => e.currentTarget.play()} 
                      autoplay="true" 
                      loop 
                      muted 
                      playsinline 
                      preload="auto"
                    >
                        <source src="https://move-app.com/video/stakeNft.mp4" type="video/mp4" /> {/* Note o "/" no final */}
                        Seu navegador não suporta o elemento de vídeo.
                      </video>
                    </div>
                    <div style={{ height: '30px' }}></div>
                    
                    {userAmount>1000000 &&(
                        <div style={{marginRight:"20px", width: "70%"}}>
                        <span className="textG" style={{color:"gray"}}> You have {formatNumber(userAmount)},[LEGENDARY+RARE] </span>
                        </div>
                        )}
                    {userAmount<1000000 && userAmount>=400000 ?(
                        <span className="textG" style={{color:"#FFD700"}}>You have {formatNumber(userAmount)} [LEGENDARY] need {formatNumber(1000000-userAmount)} to [LEGENDARY+RARE].</span>
                    ):null}
                    {userAmount<400000 && userAmount>=200000 ?
                    (
                      <span className="textG" style={{color:"red"}}>You have {formatNumber(userAmount)},[RARE]<br/> need {formatNumber(400000-userAmount)} to [LEGENDARY].</span>
                    )
                    : null 
                    }
                    {userAmount<200000 && userAmount>=100000 ?
                    (
                      <div style={{marginRight:"20px", width: "70%"}}>
                      <span className="textG" style={{color:"gray"}}> You have {formatNumber(userAmount)},[COMMON]<br/>  need {formatNumber(200000-userAmount)} to [RARE]. </span>
                      </div>
                      ):null}
                      {userAmount<100000 ?
                    (
                      <div style={{marginRight:"20px", width: "70%"}}>
                      <span className="textG" style={{color:"gray"}}> You have {formatNumber(userAmount)}, <br/>  need {formatNumber(100000-userAmount)} to [COMMON]. </span>
                      </div>
                      ):null}

                      <button className="collect"  type="button" >Collect 🔒</button>
                </>
                  )
                }
                
                
              </div>
            </div>
            )
            }

           {isPopupOpen && (
        <div className="overlay" onClick={handleClosePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <button className="closeButton" onClick={handleClosePopup}>X</button>
            <div>Stake</div>
                    <div style={{ height: '35px' }}></div> {/* Espaço */}
            <div className="boxBorder">
            <div className="textoEspacoTexto">
                            <span className="textG">AMOUNT</span>
                            <span className="textG">AVAILABLE</span>
                        </div>
                        <div className="textoEspacoTexto">
                            <input className="textG"
                            type="number"
                            placeholder="Amount to Stake"
                            value={Amount}
                            onChange={(e) =>
                              { 
                                let v = e.target.value;
                                if(v>=userTokensCount)
                                v= userTokensCount-1;
                                setAmount(v);
                              }
                              }
                            />
                            <button className="maxBtn" onClick={setMaxToken} type="button">Max</button>
                        <span className="value">{formatNumber(userTokensCount)}</span>
                            
                        </div>
            </div>
                    <div style={{ height: '35px' }}></div> {/* Espaço */}
                    
                    {!isApproved ? (
                        isApproveLoading ? (
                          <span style={{width:'100%', textAlign:'center'}}>
                            Processing, wait here.
                          </span>
                        ) : (
                          <button className="stakeButton" onClick={approveTokens} type="button">
                            APPROVE
                          </button>
                        )
                      ) : (
                        <button className="stakeButton" onClick={stakeTokens} type="button">
                          STAKE
                        </button>
                      )}

          </div>
        </div>
      )}

        </div>
    );
};

export default StakingFront;