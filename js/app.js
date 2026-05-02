let fretes = carregarFretes();
let calculoAtual = null;

function getFormData() {
  return {
    origem: el('origem').value.trim(),
    destino: el('destino').value.trim(),
    pesoReal: parseFloat(el('pesoReal').value),
    comprimento: parseFloat(el('comprimento').value),
    largura: parseFloat(el('largura').value),
    altura: parseFloat(el('altura').value),
    distancia: parseFloat(el('distancia').value),
    tarifaKm: parseFloat(el('tarifaKm').value),
    tarifaKg: parseFloat(el('tarifaKg').value),
    taxasFixas: parseFloat(el('taxasFixas').value),
    fatorCubagem: parseFloat(el('fatorCubagem').value),
    status: el('statusFrete').value
  };
}

function validarDados(dados) {
  return Object.values(dados).every(value => value !== '' && value !== null && !Number.isNaN(value));
}

function preencherFormulario(frete) {
  el('origem').value = frete.origem ?? '';
  el('destino').value = frete.destino ?? '';
  el('pesoReal').value = frete.pesoReal ?? '';
  el('comprimento').value = frete.comprimento ?? '';
  el('largura').value = frete.largura ?? '';
  el('altura').value = frete.altura ?? '';
  el('distancia').value = frete.distancia ?? '';
  el('tarifaKm').value = frete.tarifaKm ?? '';
  el('tarifaKg').value = frete.tarifaKg ?? '';
  el('taxasFixas').value = frete.taxasFixas ?? '';
  el('fatorCubagem').value = frete.fatorCubagem ?? '';
  el('statusFrete').value = frete.status;
}

function filtrarFretes() {
  const termo = el('buscaFrete').value.toLowerCase().trim();
  const status = el('filtroStatus').value;

  const filtrados = fretes.filter(frete => {
    const matchTexto = [frete.codigo, frete.origem, frete.destino]
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
  calculoAtual = frete;
  openTab('calculo');
};

window.excluirFrete = function(codigo) {
  const confirmar = confirm(`Deseja realmente excluir o frete ${codigo}?`);
  if (!confirmar) return;

  fretes = fretes.filter(f => f.codigo !== codigo);
  salvarLocalStorage(fretes);
  renderTabela(fretes, fretes);
};

function atualizarStatus(codigo, novoStatus) {
  const indice = fretes.findIndex(f => f.codigo === codigo);
  if (indice === -1) return;

  fretes[indice].status = novoStatus;
  salvarLocalStorage(fretes);
  renderTabela(fretes, fretes);
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => openTab(btn.dataset.tab));
});

el('btnCalcular').addEventListener('click', () => {
  const dados = getFormData();

  if (!validarDados(dados)) {
    alert('Preencha todos os campos corretamente antes de calcular.');
    return;
  }

  if (calculoAtual && calculoAtual.codigo) {
    dados.codigo = calculoAtual.codigo;
  }

  calculoAtual = calcularFrete(dados);
  preencherTelaCalculo(calculoAtual);
  openTab('calculo');
});

el('btnLimpar').addEventListener('click', () => {
  el('freteForm').reset();
  el('tarifaKg').value = '0.80';
  el('taxasFixas').value = '150.00';
  el('fatorCubagem').value = '300'; //o fator de cubagem padrão para transporte rodoviário é 300 kg/m3.
  calculoAtual = null;
});

el('btnVoltar').addEventListener('click', () => {
  if (calculoAtual && calculoAtual.codigo) {
    preencherFormulario(calculoAtual);
  }
  openTab('cadastro');
});
el('btnCancelarCalculo').addEventListener('click', () => openTab('cadastro'));

el('btnConfirmarFrete').addEventListener('click', () => {
  if (!calculoAtual) {
    alert('Nenhum cálculo disponível para confirmar.');
    return;
  }

  const novoFrete = {
    codigo: calculoAtual.codigo || gerarCodigoFrete(),
    ...calculoAtual
  };

  const indiceExistente = fretes.findIndex(f => f.codigo === novoFrete.codigo);

  if (indiceExistente >= 0) {
    fretes[indiceExistente] = novoFrete;
  } else {
    fretes.unshift(novoFrete);
  }

  salvarLocalStorage(fretes);
  renderTabela(fretes, fretes);

  alert(`Frete ${novoFrete.codigo} confirmado e salvo com sucesso.`);
  openTab('acompanhamento');
});

el('btnFiltrar').addEventListener('click', filtrarFretes);
el('buscaFrete').addEventListener('input', filtrarFretes);
el('filtroStatus').addEventListener('change', filtrarFretes);

el('btnLimparHistorico').addEventListener('click', () => {
  const confirmar = confirm('Deseja apagar todo o histórico de fretes?');
  if (!confirmar) return;

  fretes = [];
  salvarLocalStorage(fretes);
  renderTabela(fretes, fretes);

  alert('Histórico reiniciado com sucesso.');
});

renderTabela(fretes, fretes);

// Inicialização dos valores padrão
el('tarifaKg').value = '0.80';
el('taxasFixas').value = '150';
el('fatorCubagem').value = '300';