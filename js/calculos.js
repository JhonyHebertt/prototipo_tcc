function calcularFrete(dados) {
  const pesoCubado = dados.comprimento * dados.largura * dados.altura * dados.fatorCubagem;
  const pesoTaxado = Math.max(dados.pesoReal, pesoCubado);
  const valorFrete = (dados.distancia * dados.tarifaKm) + (pesoTaxado * dados.tarifaKg) + dados.taxasFixas;
  const baseCalculo = pesoTaxado === dados.pesoReal ? 'Peso Real' : 'Peso Cubado';
  const exigeAprovacao = valorFrete > dados.limiteAprovacao;
  const status = exigeAprovacao ? 'Pendente de Aprovação' : dados.status;
  const statusAprovacao = exigeAprovacao ? 'Pendente' : 'Dispensada';

  return {
    ...dados,
    status,
    pesoCubado,
    pesoTaxado,
    valorFrete,
    baseCalculo,
    exigeAprovacao,
    statusAprovacao
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
