# Prototipo de Sistema de Gestão de Fretes e Entregas
    Sistema meramente ilustrativo, apenas com intuito de apresentar protótipos de baixa fidelidade (wireframes) para os principais cenários operacionais do módulo de 'Gestão de Fretes e Entregas', do meu TCC

## Funcionalidades
- Cadastro de frete com campos: Origem, Destino, Peso Real, Dimensões (Comprimento, Largura, Altura), Distância, Tarifa por km, Tarifa por kg, Taxas Fixas, Fator de Cubagem e Status
- Cálculo de cubagem
- Peso taxado automático
- Cálculo do valor do frete com base em distância e peso
- Listagem de fretes
- Busca e filtro por status
- Persistência local com LocalStorage
- Confirmação de frete salva diretamente

## Fórmulas
- Cálculo do Peso Cubado (cubagem)
    Peso Cubado (kg)=Comprimento (m)×Largura (m)×Altura (m)×Fator de Cubagem
    Observação: o fator de cubagem padrão para transporte rodoviário é 300 kg/m3.

- Determinação do Peso Taxado
    Peso Taxado (kg)=max(Peso Real (kg), Peso Cubado (kg))

- Cálculo do Valor do Frete
    Valor do Frete (R$)= (Distância (km) × Tarifa por km (R$/km)) + (Peso Taxado (kg) × Tarifa por kg (R$/kg)) + Taxas Fixas e Pedágios (R$)

### Peso Cubado
Peso Cubado = Comprimento × Largura × Altura × Fator de Cubagem

### Peso Taxado
Peso Taxado = max(Peso Real, Peso Cubado)

### Valor do Frete
Valor do Frete = (Distância × Tarifa por km) + (Peso Taxado × Tarifa por kg) + Taxas Fixas

## Como executar
1. Baixe os arquivos
2. Mantenha a estrutura de pastas
3. Abra o arquivo `index.html` no navegador