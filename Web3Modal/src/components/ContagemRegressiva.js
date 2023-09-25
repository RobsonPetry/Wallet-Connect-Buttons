import React, { useState, useEffect } from 'react';

function ContagemRegressiva() {
  const [tempoRestante, setTempoRestante] = useState(calcularTempoRestante());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const novoTempoRestante = calcularTempoRestante();

      if (novoTempoRestante <= 0) {
        clearInterval(intervalId);
      }

      setTempoRestante(novoTempoRestante);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function calcularTempoRestante() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = agora.getMonth();
    const dataFinal = new Date(ano, mes, 25);
    const diferenca = dataFinal - agora;
    return diferenca > 0 ? diferenca : 0;
  }

  const segundos = Math.floor((tempoRestante / 1000) % 60);
  const minutos = Math.floor((tempoRestante / (1000 * 60)) % 60);
  const horas = Math.floor((tempoRestante / (1000 * 60 * 60)));

  return (
    <span>{`${horas}:${minutos}:${segundos}`}</span>
  );
}

export default ContagemRegressiva;