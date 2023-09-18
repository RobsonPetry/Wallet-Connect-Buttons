import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import TokenContractABI from "./TokenContractABI.json"; 


const Swap = () => {
    const [userTokensCount, setTokensCount] = useState(0);
    const [web3, setWeb3] = useState(null);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [Amount, setAmount] = useState(0);
    const [type, setType] = useState(0);
    const [logged, setLogged] = useState(false);
    const [appAddress, setAppAddress] = useState("");
    const [appToken, setAppToken] = useState("");

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
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error('Could not get accounts.');
        }
    };
    
    const updateData = async () => {
        const tokenAddress = "0x95Ca12cd249D27008a482009e101a8501cf3a64f"; // Substitua pelo endereço do contrato do token
        const tokenContract = new web3.eth.Contract(TokenContractABI, tokenAddress);
        const balance = await tokenContract.methods.balanceOf(currentAccount).call();
        
        setTokensCount(web3.utils.fromWei(balance.toString(), 'ether'));
    };
    const setMaxToken= async () => {
        setAmount(userTokensCount-1);
      }
      function formatNumber(value) {
        const integerPart = Math.floor(value);
        const decimalPart = Math.round((value - integerPart) * 100);  // Pegue apenas 2 casas decimais
    
        // Formate a parte inteira com pontos como separadores de milhar
        const integerFormatted = integerPart.toLocaleString('de-DE');
    
        // Combine a parte inteira formatada com a parte decimal
        return `${integerFormatted},${decimalPart.toString().padStart(2, '0')}`;
    }
    const Deposit= async () => {

        if(appAddress.length<=0){
            alert("Set the app address first")
        }
      }
      const Login= async () => {
            setLogged(true);
      }
    useEffect(() => {
        initializeWeb3_2();
      }, []);

      useEffect(() => {
        if (web3) {
          const intervalId = setInterval(() => {
            updateData();
          }, 5000);
    
          window.ethereum.on("accountsChanged", (newAccounts) => {
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

    return (
        <>
    <div className="horixontalCentralized2">
        {
            type==0? 
            <button className="buttonSwap-selected" type="button">Deposit</button>
            :
            <button className="buttonSwap" onClick={()=>{setType(0)}} type="button">Deposit</button>
        }
        {
            type==1?
            <button className="buttonSwap-selected" type="button">Withdraw</button>
            :
            <button className="buttonSwap" onClick={()=>{setType(1)}} type="button">Withdraw</button>
        }
    </div>
    {
            type==0? 
        <div className="horixontalCentralized">
            <div className="box">
                <div className="title" style={{ textAlign:'center' }}>My web3 Wallet</div>
                <div className="wallet">Wallet: {currentAccount && currentAccount.slice(0, 4)}...{currentAccount && currentAccount.slice(-4)}</div>
                
                <div style={{ height: '20px' }}></div> {/* Espaço */}
                <div className="textoEspacoTexto">
                    <div className="tokenIcon"/>
                <div className="textA">{formatNumber(userTokensCount)} MOVE</div>
                </div>
                
                <div style={{ height: '20px' }}></div> {/* Espaço */}
                <div className="textoEspacoTexto">
                    <input className="textG"
                                    type="number"
                                    placeholder="Amount to Stake"
                                    value={Amount}
                                    onChange={(e) =>
                                    { 
                                        setAmount(e.target.value);
                                    }
                                    }
                                    />
                    <button className="maxBtn" onClick={setMaxToken} type="button">Max</button>
                </div>
                <div style={{ height: '20px' }}></div> {/* Espaço */}
                <button className="stake" onClick={Deposit} type="button">Deposit</button>
            </div>
            <a>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</a> 
            <div className="box">
            <div className="title" style={{ textAlign:'center' }}>My app Wallet</div>
                <div style={{ height: '25%' }}></div> {/* Espaço */}
            <input 
                placeholder="App address"
                value=""
                onChange={(e) =>
                { 
                    setAppAddress(e.target);
                }
                }
            />
            </div>
        </div>
        :
        <div className="horixontalCentralized">
            <div className="box">
            <div className="title" style={{ textAlign:'center' }}>My app Wallet</div>
            {
                !logged?
                <><div style={{ height: '10px' }}></div> {/* Espaço */}
                
                <input 
                placeholder="App address"
                value=""
                onChange={(e) =>
                { 
                setAppAddress(e.target);
                }
                }
                />
                <input 
                    placeholder="password"
                    value=""
                    onChange={(e) =>
                    { 
                    setAppAddress(e.target);
                    }
                    }
                />
                <button className="stake" onClick={Login} type="button">Login</button></>
                :
                <>
                <div style={{ height: '20px' }}></div> {/* Espaço */}
                <div className="textoEspacoTexto">
                    <div className="tokenIcon"/>
                <div className="textA">{formatNumber(userTokensCount)} MOVE</div>
                </div>
                
                <div style={{ height: '20px' }}></div> {/* Espaço */}
                <div className="textoEspacoTexto">
                    <input className="textG"
                                    type="number"
                                    placeholder="Amount to Stake"
                                    value={Amount}
                                    onChange={(e) =>
                                    { 
                                        setAmount(e.target.value);
                                    }
                                    }
                                    />
                    <button className="maxBtn" onClick={setMaxToken} type="button">Max</button>
                </div>
                <button className="stake" onClick={Deposit} type="button">Withdraw</button>
                </>
            }
            

            </div>            
            <a>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</a> 
            <div className="box">
            <div className="title" style={{ textAlign:'center' }}>My web3 Wallet</div>
                <div className="wallet">Wallet: {currentAccount && currentAccount.slice(0, 4)}...{currentAccount && currentAccount.slice(-4)}</div>
                
                <div style={{ height: '40px' }}></div> {/* Espaço */}
                <div className="textoEspacoTexto">
                    <div className="tokenIcon"/>
                <div className="textA">{formatNumber(userTokensCount)} MOVE</div>
                </div>

            </div>
        </div>
                                }
        </>
    );
   
};

export default Swap;