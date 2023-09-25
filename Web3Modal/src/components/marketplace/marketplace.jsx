import React, { useState, useEffect } from "react";


const marketplace = () => {
    const [Amount, setAmount] = useState(0);
    const [type, setType] = useState(0);
    const [logged, setLogged] = useState(false);
    const [appAddress, setAppAddress] = useState("");

    function formatNumber(value) {
        const integerPart = Math.floor(value);
        const decimalPart = Math.round((value - integerPart) * 100);  // Pegue apenas 2 casas decimais
    
        // Formate a parte inteira com pontos como separadores de milhar
        const integerFormatted = integerPart.toLocaleString('de-DE');
    
        // Combine a parte inteira formatada com a parte decimal
        return `${integerFormatted},${decimalPart.toString().padStart(2, '0')}`;
    }

      const Login= async () => {
            setLogged(true);
      }
    useEffect(() => {
        initializeWeb3_2();
      }, []);

      

    return (
        <>
        
        </>    
    );
   
};

export default marketplace;