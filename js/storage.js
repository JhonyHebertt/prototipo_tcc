const STORAGE_KEY = 'fretes_dinamicos';
const REGRAS_KEY = 'regras_negocio_fretes';

function salvarLocalStorage(fretes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fretes));
}

function carregarFretes() {
  const dados = localStorage.getItem(STORAGE_KEY);

  if (dados) {
    const fretesSalvos = JSON.parse(dados).map(normalizarFrete);
    salvarLocalStorage(fretesSalvos);
    return fretesSalvos;
  }

  const fretesIniciais = [
    {
      codigo: 'FR-2026-1001',
      cepOrigem: '01001000',
      cepDestino: '80010000',
      origem: 'São Paulo, SP',
      destino: 'Curitiba, PR',
      descricaoMercadoria: 'Equipamentos eletrônicos',
      tipoMercadoria: 'Frágil',
      status: 'Em Trânsito',
      pesoReal: 500,
      comprimento: 2,
      largura: 1,
      altura: 1,
      distancia: 408,
      tarifaKm: 0.00,
      tarifaKg: 2.20,
      taxasFixas: 130,
      fatorCubagem: 300,
      limiteAprovacao: 2500,
      dataAgendamento: '',
      horaAgendamento: '',
      janelaAgendamento: '',
      localizacaoAtual: 'Em rota - Registro, SP',
      pesoCubado: 600,
      pesoTaxado: 600,
      valorFrete: 1450,
      baseCalculo: 'Peso Cubado',
      exigeAprovacao: false,
      statusAprovacao: 'Dispensada',
      eventos: [
        'Frete cadastrado e confirmado.',
        'Carga coletada em São Paulo, SP.',
        'Atualização de localização: Em rota - Registro, SP.'
      ]
    },
    {
      codigo: 'FR-2026-1002',
      cepOrigem: '13010000',
      cepDestino: '20040002',
      origem: 'Campinas, SP',
      destino: 'Rio de Janeiro, RJ',
      descricaoMercadoria: 'Máquinas industriais',
      tipoMercadoria: 'Alto Valor',
      status: 'Pendente de Aprovação',
      pesoReal: 1800,
      comprimento: 2.2,
      largura: 1.4,
      altura: 1.1,
      distancia: 511,
      tarifaKm: 0.00,
      tarifaKg: 1.05,
      taxasFixas: 210,
      fatorCubagem: 300,
      limiteAprovacao: 2000,
      dataAgendamento: '2026-05-13',
      horaAgendamento: '09:00',
      janelaAgendamento: '13/05/2026 às 09:00',
      localizacaoAtual: 'Aguardando liberação',
      pesoCubado: 1016.4,
      pesoTaxado: 1800,
      valorFrete: 2100,
      baseCalculo: 'Peso Real',
      exigeAprovacao: true,
      statusAprovacao: 'Pendente',
      eventos: [
        'Frete cadastrado e confirmado.',
        'Frete agendado para 13/05/2026 às 09:00.',
        'Valor acima do limite: aguardando aprovação do gestor.'
      ]
    },
    {
      codigo: 'FR-2026-1003',
      cepOrigem: '74003010',
      cepDestino: '30140071',
      origem: 'Goiânia, GO',
      destino: 'Belo Horizonte, MG',
      descricaoMercadoria: 'Carga geral paletizada',
      tipoMercadoria: 'Carga Geral',
      status: 'Finalizado',
      pesoReal: 700,
      comprimento: 1.5,
      largura: 1,
      altura: 1.2,
      distancia: 906,
      tarifaKm: 0.00,
      tarifaKg: 1,
      taxasFixas: 190,
      fatorCubagem: 300,
      limiteAprovacao: 2500,
      dataAgendamento: '',
      horaAgendamento: '',
      janelaAgendamento: '',
      localizacaoAtual: 'Entregue em Belo Horizonte, MG',
      pesoCubado: 540,
      pesoTaxado: 700,
      valorFrete: 890,
      baseCalculo: 'Peso Real',
      exigeAprovacao: false,
      statusAprovacao: 'Dispensada',
      eventos: [
        'Frete cadastrado e confirmado.',
        'Carga em trânsito para Belo Horizonte, MG.',
        'Entrega finalizada.'
      ]
    }
  ];

  salvarLocalStorage(fretesIniciais);
  return fretesIniciais;
}

function salvarRegras(regras) {
  localStorage.setItem(REGRAS_KEY, JSON.stringify(regras));
}

function carregarRegras() {
  const dados = localStorage.getItem(REGRAS_KEY);
  const regrasPadrao = {
    limiteAprovacao: 2500,
    horaInicial: '08:00',
    horaFinal: '18:00',
    maxPesoReal: 5000,
    maxComprimento: 2.5,
    maxLargura: 2.5,
    maxAltura: 2.5
  };

  if (!dados) {
    salvarRegras(regrasPadrao);
    return regrasPadrao;
  }

  return {
    ...regrasPadrao,
    ...JSON.parse(dados)
  };
}

function normalizarFrete(frete) {
  const dataHoraLegada = extrairDataHoraAgendamento(frete.janelaAgendamento);

  return {
    descricaoMercadoria: 'Mercadoria não informada',
    cepOrigem: '',
    cepDestino: '',
    tipoMercadoria: 'Carga Geral',
    distancia: 0,
    tarifaKm: 0,
    limiteAprovacao: 2500,
    dataAgendamento: dataHoraLegada.data,
    horaAgendamento: dataHoraLegada.hora,
    janelaAgendamento: '',
    localizacaoAtual: 'Sem localização informada',
    exigeAprovacao: false,
    statusAprovacao: 'Dispensada',
    eventos: ['Registro migrado para o modelo atual do protótipo.'],
    ...frete
  };
}

function extrairDataHoraAgendamento(texto) {
  if (!texto) return { data: '', hora: '' };

  const dataMatch = texto.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  const horaMatch = texto.match(/(\d{2})h|(\d{2}:\d{2})/);

  return {
    data: dataMatch ? `${dataMatch[3]}-${dataMatch[2]}-${dataMatch[1]}` : '',
    hora: horaMatch ? (horaMatch[2] || `${horaMatch[1]}:00`) : ''
  };
}
