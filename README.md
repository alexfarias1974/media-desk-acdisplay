# MediaDesk | AC Display

Plataforma inteligente para auditoria, validação de horários comerciais e emissão de relatórios analíticos de veiculação de mídias publicitárias em totens digitais (OOH / Digital Signage).

---

## 🛡️ Regra de Negócio de Horários Comerciais

Para evitar qualquer tipo de contaminação nos relatórios dos clientes anunciantes, a plataforma aplica um filtro estrito em nível de segundo:

- **Segunda-feira a Sábado**: são contabilizadas **apenas** as inserções entre **10:00:00 e 22:00:00**.
- **Domingo**: são contabilizadas **apenas** as inserções entre **12:00:00 e 22:00:00**.
- **Registros fora desses intervalos**: são automaticamente expurgados e mantidos em aba separada com justificativa detalhada para conferência técnica (madrugadas, antes do horário de abertura ou após o fechamento).

---

## 🚀 Funcionalidades

- **Upload Inteligente de CSV**:
  - Arraste e solte (Drag & Drop) com leitura em tempo real via browser.
  - Reconhecimento automático de delimitadores (`,` e `;`) e formatos de data (`DD/MM/YYYY`, `YYYY-MM-DD`, etc.).
  - Processamento 100% no cliente (dados privados, não saem da máquina do usuário).
  - Gerador de dados de demonstração integrado e download de modelo `.csv`.
- **Frequência de Exibição & Médias Auditadas**:
  - Mídia por Mídia: Média diária, semanal e projeção mensal consolidada.
  - Desdobramento por Totem: visualização sanfona de cada ponto com volume e percentual de participação.
  - Visão alternativa agrupada por Totem.
  - Exportação das médias em arquivo CSV.
- **Gestão de Metas e Cotas Contratadas**:
  - Definição de quantidade contratada por campanha.
  - Indicador visual de percentual atingido, saldo excedente ou déficit.
- **Gráficos Executivos (Recharts)**:
  - Ranking de Mídias / Campanhas com share por anunciante.
  - Evolução diária (linha do tempo ao longo do mês).
  - Distribuição 24h comparativa (horário comercial vs horário expurgado).
  - Volume por dia da semana.
  - Desempenho por totem.
- **Página Exclusiva "Detalhamento das Mídias"**:
  - Tabela analítica completa com busca em tempo real, filtros por mídia/totem, paginação e exportação CSV filtrada.
  - Otimizada para impressão e salvamento em PDF (`Ctrl + P`).

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **Vite**
- **Tailwind CSS v3**
- **Recharts**
- **Lucide React**
- **PapaParse**

---

## 📦 Como Rodar o Projeto

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev

# 3. Gerar a versão de produção
npm run build
```

Acesse localmente em: `http://localhost:5173/`

---

Desenvolvido para **AC Display • A Amazoncopy Company**.
