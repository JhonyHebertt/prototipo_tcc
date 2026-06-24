let fretes = carregarFretes();
let regrasNegocio = carregarRegras();
let calculoAtual = null;
let visualizandoDetalhes = false;

function getFormData() {
  const dataAgendamento = el('dataAgendamento').value;
  const horaAgendamento = el('horaAgendamento').value;

  return {
    cepOrigem: limparCep(el('cepOrigem').value),
    cepDestino: limparCep(el('cepDestino').value),
    origem: el('origem').value.trim(),
    destino: el('destino').value.trim(),
    descricaoMercadoria: el('descricaoMercadoria').value.trim(),
    tipoMercadoria: el('tipoMercadoria').value,
    pesoReal: parseFloat(el('pesoReal').value),
    comprimento: parseFloat(el('comprimento').value),
    largura: parseFloat(el('largura').value),
    altura: parseFloat(el('altura').value),
    distancia: parseFloat(el('distancia').value),
    tarifaKm: parseFloat(el('tarifaKm').value),
    tarifaKg: parseFloat(el('tarifaKg').value),
    taxasFixas: parseFloat(el('taxasFixas').value),
    limiteAprovacao: regrasNegocio.limiteAprovacao,
    fatorCubagem: parseFloat(el('fatorCubagem').value),
    status: el('statusFrete').value,
    dataAgendamento,
    horaAgendamento,
    janelaAgendamento: formatarAgendamento(dataAgendamento, horaAgendamento),
    localizacaoAtual: el('localizacaoAtual').value.trim()
  };
}

function validarDados(dados) {
  const camposObrigatorios = [
    'cepOrigem',
    'cepDestino',
    'origem',
    'destino',
    'descricaoMercadoria',
    'tipoMercadoria',
    'pesoReal',
    'comprimento',
    'largura',
    'altura',
    'distancia',
    'tarifaKm',
    'tarifaKg',
    'taxasFixas',
    'fatorCubagem'
  ];

  const camposNumericos = [
    'pesoReal',
    'comprimento',
    'largura',
    'altura',
    'distancia',
    'tarifaKm',
    'tarifaKg',
    'taxasFixas',
    'fatorCubagem'
  ];

  const camposValidos = camposObrigatorios.every(campo => {
    const value = dados[campo];
    return value !== '' && value !== null && !Number.isNaN(value);
  });

  const valoresPositivos = camposNumericos.every(campo => {
    const value = dados[campo];
    return typeof value === 'number' && !Number.isNaN(value) && value >= 0;
  });

  if (!camposValidos) return { valido: false, erro: 'Preencha todos os campos obrigatórios antes de calcular.' };
  if (!valoresPositivos) return { valido: false, erro: 'Os campos de medidas, peso e tarifas não podem ser negativos.' };
  
  return { valido: true };
}

function horarioAgendamentoValido(frete) {
  if (!frete.horaAgendamento) return true;
  return horaDentroDaJanela(frete.horaAgendamento);
}

function horaDentroDaJanela(hora) {
  return hora >= regrasNegocio.horaInicial && hora <= regrasNegocio.horaFinal;
}

function formatarAgendamento(data, hora) {
  if (!data || !hora) return '';

  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano} às ${hora}`;
}

function limparCep(cep) {
  return cep.replace(/\D/g, '');
}

function formatarCep(cep) {
  const cepLimpo = limparCep(cep);
  if (cepLimpo.length !== 8) return cep;
  return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
}

function cidadeUf(dadosCep) {
  return `${dadosCep.localidade}, ${dadosCep.uf}`;
}

async function buscarCep(campoCep, campoResultado, rotulo) {
  const cep = limparCep(el(campoCep).value);

  if (!cep) {
    el(campoResultado).value = '';
    return;
  }

  if (cep.length !== 8) {
    el(campoResultado).value = '';
    alert(`Informe um CEP de ${rotulo} válido com 8 dígitos.`);
    return;
  }

  el(campoCep).value = formatarCep(cep);
  el(campoResultado).value = 'Buscando...';

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dadosCep = await resposta.json();

    if (dadosCep.erro) {
      el(campoResultado).value = '';
      alert(`CEP de ${rotulo} não encontrado.`);
      return;
    }

    el(campoResultado).value = cidadeUf(dadosCep);
  } catch (error) {
    el(campoResultado).value = '';
    alert(`Não foi possível consultar o CEP de ${rotulo}. Verifique a conexão e tente novamente.`);
  }
}

function preencherFormularioTemporario(frete) {
  el('cepOrigem').value = frete.cepOrigem ? formatarCep(frete.cepOrigem) : '';
  el('cepDestino').value = frete.cepDestino ? formatarCep(frete.cepDestino) : '';
  el('origem').value = frete.origem ?? '';
  el('destino').value = frete.destino ?? '';
  el('descricaoMercadoria').value = frete.descricaoMercadoria ?? '';
  el('tipoMercadoria').value = frete.tipoMercadoria ?? '';
  el('pesoReal').value = frete.pesoReal ?? '';
  el('comprimento').value = frete.comprimento ?? '';
  el('largura').value = frete.largura ?? '';
  el('altura').value = frete.altura ?? '';
  el('distancia').value = frete.distancia ?? '';
  el('tarifaKm').value = frete.tarifaKm ?? '';
  el('tarifaKg').value = frete.tarifaKg ?? '';
  el('taxasFixas').value = frete.taxasFixas ?? '';
  el('fatorCubagem').value = frete.fatorCubagem ?? '';
  el('statusFrete').value = frete.status ?? 'Em Aberto';
  el('dataAgendamento').value = frete.dataAgendamento ?? '';
  el('horaAgendamento').value = frete.horaAgendamento ?? '';
  el('localizacaoAtual').value = frete.localizacaoAtual ?? '';
}

function filtrarFretes() {
  const termo = el('buscaFrete').value.toLowerCase().trim();
  const status = el('filtroStatus').value;

  const filtrados = fretes.filter(frete => {
    const matchTexto = [frete.codigo, frete.origem, frete.destino, frete.descricaoMercadoria, frete.localizacaoAtual]
      .join(' ')
      .toLowerCase()
      .includes(termo);

    const matchStatus = status === 'Todos' || frete.status === status;
    return matchTexto && matchStatus;
  });

  renderTabela(filtrados, fretes);
}

window.verDetalhes = function(codigo) {
  const frete = fretes.find(f => f.codigo === codigo);
  if (!frete) return;

  preencherTelaCalculo(frete);
  calculoAtual = null;
  visualizandoDetalhes = true;
  openTab('calculo');
};

window.excluirFrete = function(codigo) {
  const confirmar = confirm(`Deseja realmente excluir o frete ${codigo}?`);
  if (!confirmar) return;

  fretes = fretes.filter(f => f.codigo !== codigo);
  salvarLocalStorage(fretes);
  atualizarPainel();
};

function atualizarStatus(codigo, novoStatus) {
  const indice = fretes.findIndex(f => f.codigo === codigo);
  if (indice === -1) return;

  fretes[indice].status = novoStatus;
  if (novoStatus === 'Pendente de Aprovação') {
    fretes[indice].statusAprovacao = 'Pendente';
  }
  if (novoStatus === 'Reprovado') {
    fretes[indice].statusAprovacao = 'Reprovada';
  }
  if (novoStatus !== 'Pendente de Aprovação' && novoStatus !== 'Reprovado') {
    fretes[indice].statusAprovacao = fretes[indice].exigeAprovacao ? 'Aprovada' : 'Dispensada';
  }
  adicionarEvento(fretes[indice], `Status atualizado para ${novoStatus}.`);
  salvarLocalStorage(fretes);
  atualizarPainel();
}

function atualizarLocalizacao(codigo, novaLocalizacao) {
  const indice = fretes.findIndex(f => f.codigo === codigo);
  if (indice === -1) return;

  fretes[indice].localizacaoAtual = novaLocalizacao.trim();
  adicionarEvento(fretes[indice], `Atualização de localização: ${fretes[indice].localizacaoAtual || '-'}.`);
  salvarLocalStorage(fretes);
  atualizarPainel();
}

function adicionarEvento(frete, texto) {
  frete.eventos = frete.eventos || [];
  frete.eventos.push(texto);
}

function resetarFormulario() {
  el('freteForm').reset();
  el('cepOrigem').value = '';
  el('cepDestino').value = '';
  el('origem').value = '';
  el('destino').value = '';
  el('descricaoMercadoria').value = '';
  el('tipoMercadoria').value = '';
  el('pesoReal').value = '';
  el('comprimento').value = '';
  el('largura').value = '';
  el('altura').value = '';
  el('distancia').value = '';
  el('tarifaKm').value = '';
  el('tarifaKg').value = '0.80';
  el('taxasFixas').value = '150.00';
  el('fatorCubagem').value = '300';
  el('statusFrete').value = 'Em Aberto';
  el('dataAgendamento').value = '';
  el('horaAgendamento').value = '';
  el('localizacaoAtual').value = '';
}

function preencherFormularioRegras() {
  el('regraLimiteAprovacao').value = Number(regrasNegocio.limiteAprovacao).toFixed(2);
  el('regraHoraInicial').value = regrasNegocio.horaInicial;
  el('regraHoraFinal').value = regrasNegocio.horaFinal;
}

function atualizarPainel() {
  filtrarFretes();
  renderRelatorios(fretes);
  renderPendentes(fretes);
}

window.atualizarStatus = atualizarStatus;
window.atualizarLocalizacao = atualizarLocalizacao;

window.aprovarFrete = function(codigo) {
  const frete = fretes.find(f => f.codigo === codigo);
  if (!frete) return;

  frete.status = 'Em Aberto';
  frete.statusAprovacao = 'Aprovada';
  adicionarEvento(frete, 'Frete aprovado pelo gestor.');
  salvarLocalStorage(fretes);
  atualizarPainel();
};

window.reprovarFrete = function(codigo) {
  const frete = fretes.find(f => f.codigo === codigo);
  if (!frete) return;

  frete.status = 'Reprovado';
  frete.statusAprovacao = 'Reprovada';
  adicionarEvento(frete, 'Frete reprovado pelo gestor.');
  salvarLocalStorage(fretes);
  atualizarPainel();
};

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.tab === 'cadastro') {
      calculoAtual = null;
      visualizandoDetalhes = false;
      resetarFormulario();
      openTab('cadastro');
      return;
    }

    if (btn.dataset.tab === 'calculo') {
      calculoAtual = null;
      visualizandoDetalhes = false;
      limparTelaCalculo();
      openTab('calculo');
      return;
    }

    if (btn.dataset.tab === 'relatorios' || btn.dataset.tab === 'pendentes') {
      renderRelatorios(fretes);
      renderPendentes(fretes);
    }
    if (btn.dataset.tab === 'regras') {
      preencherFormularioRegras();
    }
    openTab(btn.dataset.tab);
  });
});

el('btnCalcular').addEventListener('click', () => {
  const dados = getFormData();

  const validacao = validarDados(dados);

  if (!validacao.valido) {
    alert(validacao.erro);
    return;
  }

  visualizandoDetalhes = false;
  calculoAtual = calcularFrete(dados);
  preencherTelaCalculo(calculoAtual);
  openTab('calculo');
});

el('btnLimpar').addEventListener('click', () => {
  resetarFormulario();
  calculoAtual = null;
  visualizandoDetalhes = false;
});

el('btnVoltar').addEventListener('click', () => {
  visualizandoDetalhes = false;
  openTab('cadastro');
  if (calculoAtual) {
    preencherFormularioTemporario(calculoAtual);
  } else {
    resetarFormulario();
  }
});
el('btnCancelarCalculo').addEventListener('click', () => {
  calculoAtual = null;
  visualizandoDetalhes = false;
  limparTelaCalculo();
  resetarFormulario();
  openTab('cadastro');
});

el('btnConfirmarFrete').addEventListener('click', () => {
  if (visualizandoDetalhes) {
    alert('Esta tela está apenas exibindo os detalhes do frete. Para cadastrar um novo frete, volte ao cadastro.');
    return;
  }

  if (!calculoAtual) {
    alert('Nenhum cálculo disponível para confirmar.');
    return;
  }

  if (!horarioAgendamentoValido(calculoAtual)) {
    alert(`Horário indevido. O agendamento deve ficar entre ${regrasNegocio.horaInicial} e ${regrasNegocio.horaFinal}.`);
    return;
  }

  const novoFrete = {
    codigo: calculoAtual.codigo || gerarCodigoFrete(),
    ...calculoAtual
  };
  const freteExistente = fretes.find(f => f.codigo === novoFrete.codigo);
  novoFrete.eventos = freteExistente?.eventos || novoFrete.eventos || [];

  if (!novoFrete.eventos.length) {
    adicionarEvento(novoFrete, 'Frete cadastrado e confirmado.');
  } else {
    adicionarEvento(novoFrete, 'Dados do frete atualizados.');
  }

  if (novoFrete.janelaAgendamento) {
    adicionarEvento(novoFrete, `Frete agendado para ${novoFrete.janelaAgendamento}.`);
  }

  if (novoFrete.exigeAprovacao && novoFrete.statusAprovacao === 'Pendente') {
    adicionarEvento(novoFrete, 'Valor acima do limite: aguardando aprovação do gestor.');
  }

  const indiceExistente = fretes.findIndex(f => f.codigo === novoFrete.codigo);

  if (indiceExistente >= 0) {
    fretes[indiceExistente] = novoFrete;
  } else {
    fretes.unshift(novoFrete);
  }

  salvarLocalStorage(fretes);
  atualizarPainel();

  alert(`Frete ${novoFrete.codigo} confirmado e salvo com sucesso.`);
  calculoAtual = null;
  visualizandoDetalhes = false;
  openTab('acompanhamento');
});

function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

el('btnFiltrar').addEventListener('click', filtrarFretes);
el('buscaFrete').addEventListener('input', debounce(filtrarFretes, 300));
el('filtroStatus').addEventListener('change', filtrarFretes);
el('cepOrigem').addEventListener('blur', () => buscarCep('cepOrigem', 'origem', 'origem'));
el('cepDestino').addEventListener('blur', () => buscarCep('cepDestino', 'destino', 'destino'));

el('btnSalvarRegras').addEventListener('click', () => {
  const limiteAprovacao = parseFloat(el('regraLimiteAprovacao').value);
  const horaInicial = el('regraHoraInicial').value;
  const horaFinal = el('regraHoraFinal').value;

  if (Number.isNaN(limiteAprovacao) || !horaInicial || !horaFinal || horaInicial >= horaFinal) {
    alert('Informe limite, hora inicial e hora final válidos.');
    return;
  }

  regrasNegocio = { limiteAprovacao, horaInicial, horaFinal };
  salvarRegras(regrasNegocio);
  alert('Regras salvas com sucesso.');
});

el('btnLimparHistorico').addEventListener('click', () => {
  const confirmar = confirm('Deseja apagar todo o histórico de fretes?');
  if (!confirmar) return;

  fretes = [];
  salvarLocalStorage(fretes);
  atualizarPainel();

  alert('Histórico reiniciado com sucesso.');
});

atualizarPainel();

// Inicialização dos valores padrão
resetarFormulario();
preencherFormularioRegras();
