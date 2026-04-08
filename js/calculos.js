function calcularFrete(dados) {
  const pesoCubado = dados.comprimento * dados.largura * dados.altura * dados.fatorCubagem;
  const pesoTaxado = Math.max(dados.pesoReal, pesoCubado);
  const valorFrete = (pesoTaxado * dados.tarifaKg) + dados.taxasFixas;
  const baseCalculo = pesoTaxado === dados.pesoReal ? 'Peso Real' : 'Peso Cubado';

  return {
    ...dados,
    pesoCubado,
    pesoTaxado,
    valorFrete,
    baseCalculo
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
}

function formatNumber(value, digits = 2) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value || 0);
}