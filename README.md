# Protótipo de Sistema de Gestão de Fretes e Entregas
Sistema meramente ilustrativo, criado para apresentar protótipos de baixa fidelidade (wireframes) e cenários operacionais do módulo de "Gestão de Fretes e Entregas" do TCC.

## Funcionalidades
- Cadastro de frete com campos:
  - CEP de origem e destino com preenchimento automático de cidade/UF via ViaCEP
  - Origem, destino, descrição da mercadoria, tipo de carga, volumes
  - Peso real, dimensões (comprimento, largura, altura), distância
  - Tarifas por km e por kg, taxas fixas / pedágios, fator de cubagem
  - Data e hora de agendamento e localização atual
  - Status do frete e controle de aprovação
- Cálculo automático de:
  - Peso cubado
  - Peso taxado (maior entre peso real e peso cubado)
  - Valor do frete com base em distância, peso taxado e taxas fixas
- Validação de horário de agendamento com janela configurável
- Regra de aprovação automática quando o valor do frete ultrapassa o limite cadastrado
- Histórico de eventos de frete e atualização de localização
- Listagem, busca e filtro por status
- Painel de acompanhamento com relatórios e fretes pendentes
- Persistência local usando LocalStorage
- Confirmação de frete salva diretamente no histórico

## Fórmulas
- Cálculo do Peso Cubado (cubagem)
  Peso Cubado (kg) = Comprimento (m) × Largura (m) × Altura (m) × Fator de Cubagem
  Observação: o fator de cubagem padrão usado no protótipo é 300 kg/m³.

- Determinação do Peso Taxado
  Peso Taxado (kg) = max(Peso Real (kg), Peso Cubado (kg))

- Cálculo do Valor do Frete
  Valor do Frete (R$) = (Distância (km) × Tarifa por km (R$/km)) + (Peso Taxado (kg) × Tarifa por kg (R$/kg)) + Taxas Fixas

### Exemplo de cálculo
- Peso Cubado = Comprimento × Largura × Altura × Fator de Cubagem
- Peso Taxado = max(Peso Real, Peso Cubado)
- Valor do Frete = (Distância × Tarifa por km) + (Peso Taxado × Tarifa por kg) + Taxas Fixas

## Como executar
1. Baixe os arquivos mantendo a estrutura de pastas.
2. Abra o arquivo `index.html` no navegador.
3. Para usar o preenchimento automático de CEP, é necessária conexão com a internet.
