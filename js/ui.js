const el = (id) => document.getElementById(id);

function openTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  el(tabName).classList.add('active');
  document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
}

function gerarCodigoFrete() {
  const now = new Date();
  const ano = now.getFullYear();
  const seq = String(Date.now()).slice(-4);
  return `FR-${ano}-${seq}`;
}

function getStatusClass(status) {
  if (status === 'Pendente de Aprovação') return 'bg-red';
  if (status === 'Em Trânsito') return 'bg-yellow';
  if (status === 'Em Aberto') return 'bg-blue';
  if (status === 'Finalizado') return 'bg-green';
  return 'bg-gray';
}

function formatDateTime(value) {
  if (!value) return '-';
  return value;
}

function preencherTelaCalculo(resultado) {
  el('resumoRota').textContent = `Rota: ${resultado.origem} -> ${resultado.destino}`;
  el('resumoMercadoria').textContent = `Mercadoria: ${resultado.descricaoMercadoria || '-'} | ${resultado.tipoMercadoria || '-'}`;
  el('resumoCarga').textContent = `Carga: ${formatNumber(resultado.pesoReal)}kg | ${formatNumber(resultado.comprimento)}x${formatNumber(resultado.largura)}x${formatNumber(resultado.altura)}m`;
  el('resumoAgendamento').textContent = resultado.janelaAgendamento
    ? `Agendamento: ${formatDateTime(resultado.janelaAgendamento)}`
    : 'Sem agendamento';

  el('pesoRealResult').textContent = `${formatNumber(resultado.pesoReal)} kg`;
  el('pesoCubadoResult').textContent = `${formatNumber(resultado.pesoCubado)} kg`;
  el('pesoTaxadoResult').textContent = `${formatNumber(resultado.pesoTaxado)} kg`;
  el('distanciaResult').textContent = `${formatNumber(resultado.distancia, 1)} km`;
  el('tarifaKmResult').textContent = formatCurrency(resultado.tarifaKm);
  el('tarifaResult').textContent = formatCurrency(resultado.tarifaKg);
  el('valorFreteResult').textContent = formatCurrency(resultado.valorFrete);
  el('aprovacaoResult').textContent = resultado.statusAprovacao || (resultado.exigeAprovacao ? 'Pendente' : 'Dispensada');

  const comparativo = resultado.baseCalculo === 'Peso Real'
    ? `O valor foi calculado com base no Peso Real (${formatNumber(resultado.pesoReal)} kg), pois ele superou o Peso Cubado (${formatNumber(resultado.pesoCubado)} kg).`
    : `O valor foi calculado com base no Peso Cubado (${formatNumber(resultado.pesoCubado)} kg), pois ele superou o Peso Real (${formatNumber(resultado.pesoReal)} kg).`;
  const regraAprovacao = resultado.exigeAprovacao
    ? `O valor supera o limite de ${formatCurrency(resultado.limiteAprovacao)} e exige aprovação do gestor.`
    : `O valor está dentro do limite de ${formatCurrency(resultado.limiteAprovacao)} e não exige aprovação.`;
  const regraAgendamento = resultado.janelaAgendamento
    ? `Agendamento informado para ${formatDateTime(resultado.janelaAgendamento)}. A confirmação valida a janela de horário cadastrada em Regras.`
    : 'Nenhum agendamento informado.';

  el('regraCubagemText').innerHTML = `
    <strong>Regra de Cubagem:</strong> ${comparativo}<br><br>
    <strong>Regra de Aprovação:</strong> ${regraAprovacao}<br>
    <strong>Regra de Horário:</strong> ${regraAgendamento}<br><br>
    <strong>Fórmula:</strong> (${formatNumber(resultado.distancia, 1)} × ${formatCurrency(resultado.tarifaKm)}) + (${formatNumber(resultado.pesoTaxado)} × ${formatCurrency(resultado.tarifaKg)}) + ${formatCurrency(resultado.taxasFixas)} = <strong>${formatCurrency(resultado.valorFrete)}</strong>
  `;

  renderHistorico(resultado);
}

function limparTelaCalculo() {
  el('resumoRota').textContent = 'Rota: -';
  el('resumoMercadoria').textContent = 'Mercadoria: -';
  el('resumoCarga').textContent = 'Carga: -';
  el('resumoAgendamento').textContent = 'Agendamento: -';
  el('pesoRealResult').textContent = '0,00 kg';
  el('pesoCubadoResult').textContent = '0,00 kg';
  el('pesoTaxadoResult').textContent = '0,00 kg';
  el('distanciaResult').textContent = '0,0 km';
  el('tarifaKmResult').textContent = 'R$ 0,00';
  el('tarifaResult').textContent = 'R$ 0,00';
  el('valorFreteResult').textContent = 'R$ 0,00';
  el('aprovacaoResult').textContent = '-';
  el('regraCubagemText').textContent = 'Informe os dados e clique em CALCULAR.';
  el('historicoEntrega').innerHTML = '';
}

function renderHistorico(frete) {
  const historico = el('historicoEntrega');
  const eventos = frete.eventos || [
    `Cadastro em elaboração. Localização atual: ${frete.localizacaoAtual || '-'}`
  ];

  historico.innerHTML = eventos.map(evento => `<li>${evento}</li>`).join('');
}

function renderTabela(lista, fretes) {
  const tbody = el('tabelaFretes');
  const empty = el('emptyState');
  tbody.innerHTML = '';

  if (!lista.length) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  lista.forEach(frete => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${frete.codigo}</td>
      <td>${frete.origem}</td>
      <td>${frete.destino}</td>
      <td>
        <select class="status-select" onchange="atualizarStatus('${frete.codigo}', this.value)">
          <option value="Em Aberto" ${frete.status === 'Em Aberto' ? 'selected' : ''}>Em Aberto</option>
          <option value="Pendente de Aprovação" ${frete.status === 'Pendente de Aprovação' ? 'selected' : ''}>Pendente de Aprovação</option>
          <option value="Em Trânsito" ${frete.status === 'Em Trânsito' ? 'selected' : ''}>Em Trânsito</option>
          <option value="Finalizado" ${frete.status === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
          <option value="Reprovado" ${frete.status === 'Reprovado' ? 'selected' : ''}>Reprovado</option>
        </select>
      </td>
      <td>
        <input class="location-input" value="${frete.localizacaoAtual || ''}" onchange="atualizarLocalizacao('${frete.codigo}', this.value)" placeholder="Localização">
      </td>
      <td>${frete.janelaAgendamento ? formatDateTime(frete.janelaAgendamento) : '-'}</td>
      <td>${formatNumber(frete.pesoTaxado)} kg</td>
      <td>${formatCurrency(frete.valorFrete)}</td>
      <td>
        <div class="action-group">
          <button class="action-link" onclick="verDetalhes('${frete.codigo}')">Detalhes</button>
          <button class="action-link" onclick="excluirFrete('${frete.codigo}')">Excluir</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderRelatorios(fretes) {
  const totalFretes = fretes.length;
  const valorTotal = fretes.reduce((total, frete) => total + (frete.valorFrete || 0), 0);
  const pesoTotal = fretes.reduce((total, frete) => total + (frete.pesoTaxado || 0), 0);
  const pendentes = fretes.filter(frete => frete.status === 'Pendente de Aprovação').length;
  const agendados = fretes.filter(frete => frete.janelaAgendamento).length;

  el('relTotalFretes').textContent = totalFretes;
  el('relValorTotal').textContent = formatCurrency(valorTotal);
  el('relTicketMedio').textContent = formatCurrency(totalFretes ? valorTotal / totalFretes : 0);
  el('relPesoTotal').textContent = `${formatNumber(pesoTotal)} kg`;
  el('relPendentes').textContent = pendentes;
  el('relAgendados').textContent = agendados;

  const statusResumo = fretes.reduce((acc, frete) => {
    const status = frete.status || 'Sem status';
    acc[status] = acc[status] || { quantidade: 0, valor: 0, peso: 0 };
    acc[status].quantidade += 1;
    acc[status].valor += frete.valorFrete || 0;
    acc[status].peso += frete.pesoTaxado || 0;
    return acc;
  }, {});

  const tbody = el('tabelaRelatorioStatus');
  tbody.innerHTML = Object.entries(statusResumo).map(([status, resumo]) => `
    <tr>
      <td><span class="status-badge ${getStatusClass(status)}">${status}</span></td>
      <td>${resumo.quantidade}</td>
      <td>${formatCurrency(resumo.valor)}</td>
      <td>${formatNumber(resumo.peso)} kg</td>
    </tr>
  `).join('');
}

function renderPendentes(fretes) {
  const pendentes = fretes.filter(frete => frete.status === 'Pendente de Aprovação');
  const tbody = el('tabelaPendentes');
  const empty = el('emptyPendentes');
  tbody.innerHTML = '';

  if (!pendentes.length) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  pendentes.forEach(frete => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${frete.codigo}</td>
      <td>${frete.origem}</td>
      <td>${frete.destino}</td>
      <td>${frete.descricaoMercadoria || '-'}</td>
      <td>${formatCurrency(frete.limiteAprovacao)}</td>
      <td>${formatCurrency(frete.valorFrete)}</td>
      <td>
        <div class="action-group">
          <button class="btn btn-success btn-small" onclick="aprovarFrete('${frete.codigo}')">Aprovar</button>
          <button class="btn btn-danger btn-small" onclick="reprovarFrete('${frete.codigo}')">Reprovar</button>
          <button class="action-link" onclick="verDetalhes('${frete.codigo}')">Detalhes</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
