/**
 * Generates sample CSV data with realistic totem media logs
 */
export function generateSampleCSV() {
  const headers = ['Data_Hora', 'Cliente', 'Campanha', 'Totem', 'Duracao_Segundos'];
  
  const clientsData = [
    { client: 'Coca-Cola', campaigns: ['Campanha Verão Refrescante 15s', 'Campanha Zero Açúcar'] },
    { client: 'Nubank', campaigns: ['Cartão Ultravioleta Benefícios', 'Conta PJ Sem Tarifas'] },
    { client: 'McDonalds', campaigns: ['McOferta do Dia', 'Novos Sobremesas de Verão'] },
    { client: 'Localiza', campaigns: ['Aluguel de Carros Facilitado', 'Assinatura Meoo'] },
    { client: 'Unimed', campaigns: ['Cuidar de Você é Nosso Plano', 'Campanha Vacinação'] },
    { client: 'Samsung', campaigns: ['Galaxy S24 Ultra AI', 'Smart TV Neo QLED'] },
  ];

  const totens = [
    'Totem Shopping Barra - Piso L1',
    'Totem Shopping Barra - Praça de Alimentação',
    'Totem Shopping Bela Vista - Entrada Principal',
    'Totem Aeroporto Internacional - Embarque',
    'Totem Centro Médico Empresarial - Hall',
    'Totem Metrô Estação Central - Acesso A',
  ];

  const rows = [];
  const baseDate = new Date(2025, 4, 1); // 01 de Maio de 2025

  // Generate ~1200 rows spanning 14 days
  for (let day = 0; day < 14; day++) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + day);
    const dayOfWeek = currentDate.getDay(); // 0 = Domingo

    // Inserções válidas (durante o dia)
    const validHours = dayOfWeek === 0
      ? [12, 13, 14, 15, 16, 17, 18, 19, 20, 21] // Domingo
      : [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]; // Seg-Sáb

    // Gera 60 a 90 exibições no horário permitido
    const validCount = 60 + Math.floor(Math.random() * 30);
    for (let i = 0; i < validCount; i++) {
      const h = validHours[Math.floor(Math.random() * validHours.length)];
      const m = Math.floor(Math.random() * 60);
      const s = Math.floor(Math.random() * 60);

      const clientObj = clientsData[Math.floor(Math.random() * clientsData.length)];
      const campaign = clientObj.campaigns[Math.floor(Math.random() * clientObj.campaigns.length)];
      const totem = totens[Math.floor(Math.random() * totens.length)];

      const dateStr = formatDate(currentDate, h, m, s);
      rows.push([dateStr, clientObj.client, campaign, totem, '15']);
    }

    // Inserções FORA do horário comercial (para auditar os descartes)
    // Manhã cedo (antes das 10h em seg-sab ou antes das 12h em dom)
    const earlyHours = dayOfWeek === 0 ? [8, 9, 10, 11] : [7, 8, 9];
    const earlyCount = 8 + Math.floor(Math.random() * 8);
    for (let i = 0; i < earlyCount; i++) {
      const h = earlyHours[Math.floor(Math.random() * earlyHours.length)];
      const m = Math.floor(Math.random() * 60);
      const s = Math.floor(Math.random() * 60);

      const clientObj = clientsData[Math.floor(Math.random() * clientsData.length)];
      const campaign = clientObj.campaigns[Math.floor(Math.random() * clientObj.campaigns.length)];
      const totem = totens[Math.floor(Math.random() * totens.length)];

      const dateStr = formatDate(currentDate, h, m, s);
      rows.push([dateStr, clientObj.client, campaign, totem, '15']);
    }

    // Noite tarde (após as 22h)
    const lateHours = [22, 23]; // 22h10, 23h30 etc.
    const lateCount = 5 + Math.floor(Math.random() * 6);
    for (let i = 0; i < lateCount; i++) {
      const h = lateHours[Math.floor(Math.random() * lateHours.length)];
      const m = h === 22 ? 5 + Math.floor(Math.random() * 50) : Math.floor(Math.random() * 60);
      const s = Math.floor(Math.random() * 60);

      const clientObj = clientsData[Math.floor(Math.random() * clientsData.length)];
      const campaign = clientObj.campaigns[Math.floor(Math.random() * clientObj.campaigns.length)];
      const totem = totens[Math.floor(Math.random() * totens.length)];

      const dateStr = formatDate(currentDate, h, m, s);
      rows.push([dateStr, clientObj.client, campaign, totem, '15']);
    }
  }

  // Embaralha levemente para simular log real
  rows.sort(() => Math.random() - 0.5);

  const csvLines = [
    headers.join(';'),
    ...rows.map(r => r.join(';')),
  ];

  return csvLines.join('\r\n');
}

function formatDate(date, h, m, s) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');

  return `${day}/${month}/${year} ${hh}:${mm}:${ss}`;
}

export function downloadCSV(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
