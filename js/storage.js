const STORAGE_KEY = 'fretes_dinamicos';

function salvarLocalStorage(fretes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fretes));
}

function carregarFretes() {
  const dados = localStorage.getItem(STORAGE_KEY);

  if (dados) {
    return JSON.parse(dados);
  }

  const fretesIniciais = [
    {
      codigo: 'FR-2026-1001',
      origem: 'São Paulo, SP',
      destino: 'Curitiba, PR',
      status: 'Em Trânsito',
      pesoReal: 500,
      comprimento: 2,
      largura: 1,
      altura: 1,
      tarifaKg: 2.20,
      taxasFixas: 130,
      fatorCubagem: 300,
      pesoCubado: 600,
      pesoTaxado: 600,
      valorFrete: 1450,
      baseCalculo: 'Peso Cubado'
    },
    {
      codigo: 'FR-2026-1002',
      origem: 'Campinas, SP',
      destino: 'Rio de Janeiro, RJ',
      status: 'Em Aberto',
      pesoReal: 1800,
      comprimento: 2.2,
      largura: 1.4,
      altura: 1.1,
      tarifaKg: 1.05,
      taxasFixas: 210,
      fatorCubagem: 300,
      pesoCubado: 1016.4,
      pesoTaxado: 1800,
      valorFrete: 2100,
      baseCalculo: 'Peso Real'
    },
    {
      codigo: 'FR-2026-1003',
      origem: 'Goiânia, GO',
      destino: 'Belo Horizonte, MG',
      status: 'Finalizado',
      pesoReal: 700,
      comprimento: 1.5,
      largura: 1,
      altura: 1.2,
      tarifaKg: 1,
      taxasFixas: 190,
      fatorCubagem: 300,
      pesoCubado: 540,
      pesoTaxado: 700,
      valorFrete: 890,
      baseCalculo: 'Peso Real'
    }
  ];

  salvarLocalStorage(fretesIniciais);
  return fretesIniciais;
}