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
  if (status === 'Em Trânsito') return 'bg-yellow';
  if (status === 'Em Aberto') return 'bg-blue';
  return 'bg-green';
}

function preencherTelaCalculo(resultado) {
  el('resumoRota').textContent = `Rota: ${resultado.origem} -> ${resultado.destino}`;
  el('resumoCarga').textContent = `Carga: ${formatNumber(resultado.pesoReal)}kg | ${formatNumber(resultado.comprimento)}x${formatNumber(resultado.largura)}x${formatNumber(resultado.altura)}m`;

  el('pesoRealResult').textContent = `${formatNumber(resultado.pesoReal)} kg`;
  el('pesoCubadoResult').textContent = `${formatNumber(resultado.pesoCubado)} kg`;
  el('pesoTaxadoResult').textContent = `${formatNumber(resultado.pesoTaxado)} kg`;
  el('tarifaResult').textContent = formatCurrency(resultado.tarifaKg);
  el('valorFreteResult').textContent = formatCurrency(resultado.valorFrete);

  const comparativo = resultado.baseCalculo === 'Peso Real'
    ? `O valor foi calculado com base no Peso Real (${formatNumber(resultado.pesoReal)} kg), pois ele superou o Peso Cubado (${formatNumber(resultado.pesoCubado)} kg).`
    : `O valor foi calculado com base no Peso Cubado (${formatNumber(resultado.pesoCubado)} kg), pois ele superou o Peso Real (${formatNumber(resultado.pesoReal)} kg).`;

  el('regraCubagemText').innerHTML = `
    <strong>Regra de Cubagem:</strong> ${comparativo}<br><br>
    <strong>Fórmula:</strong> (${formatNumber(resultado.pesoTaxado)} × ${formatCurrency(resultado.tarifaKg)}) + ${formatCurrency(resultado.taxasFixas)} = <strong>${formatCurrency(resultado.valorFrete)}</strong>
  `;
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
          <option value="Em Trânsito" ${frete.status === 'Em Trânsito' ? 'selected' : ''}>Em Trânsito</option>
          <option value="Finalizado" ${frete.status === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
        </select>
      </td>
      <td>${formatNumber(frete.pesoTaxado)} kg</td>
      <td>${formatCurrency(frete.valorFrete)}</td>
      <td>
        <button class="action-link" onclick="verDetalhes('${frete.codigo}')">Detalhes</button>
        <button class="action-link" onclick="excluirFrete('${frete.codigo}')">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}