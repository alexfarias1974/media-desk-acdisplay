/**
 * Generates sample CSV data with realistic totem media logs and varied campaign date intervals
 */
export function generateSampleCSV() {
  const headers = ['Data_Hora', 'Cliente', 'Campanha', 'Totem', 'Duracao_Segundos'];
  
  // Each campaign has active days [startDay, endDay] (0-indexed where 0 = May 1st)
  const campaignsSchedule = [
    { client: 'Coca-Cola', campaign: 'Campanha Verão Refrescante 15s', startDay: 0, endDay: 13 }, // 01/05 a 14/05 (14 dias)
    { client: 'Coca-Cola', campaign: 'Campanha Zero Açúcar', startDay: 2, endDay: 11 }, // 03/05 a 12/05 (10 dias)
    { client: 'Nubank', campaign: 'Cartão Ultravioleta Benefícios', startDay: 9, endDay: 13 }, // 10/05 a 14/05 (5 dias - exemplo do cliente!)
    { client: 'Nubank', campaign: 'Conta PJ Sem Tarifas', startDay: 0, endDay: 7 }, // 01/05 a 08/05 (8 dias)
    { client: 'McDonalds', campaign: 'McOferta do Dia', startDay: 4, endDay: 13 }, // 05/05 a 14/05 (10 dias)
    { client: 'Localiza', campaign: 'Aluguel de Carros Facilitado', startDay: 0, endDay: 9 }, // 01/05 a 10/05 (10 dias)
    { client: 'Localiza', campaign: 'Assinatura Meoo', startDay: 6, endDay: 13 }, // 07/05 a 14/05 (8 dias)
    { client: 'Unimed', campaign: 'Cuidar de Você é Nosso Plano', startDay: 0, endDay: 13 }, // 01/05 a 14/05 (14 dias)
    { client: 'Samsung', campaign: 'Galaxy S24 Ultra AI', startDay: 3, endDay: 11 }, // 04/05 a 12/05 (9 dias)
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

    // Filter which campaigns are active on this specific day
    const activeCampaigns = campaignsSchedule.filter(c => day >= c.startDay && day <= c.endDay);

    // Inserções válidas (durante o dia)
    const validHours = dayOfWeek === 0
      ? [12, 13, 14, 15, 16, 17, 18, 19, 20, 21] // Domingo (12h-22h)
      : [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]; // Seg-Sáb (10h-22h)

    // Gera 60 a 90 exibições no horário permitido
    const validCount = 65 + Math.floor(Math.random() * 25);
    for (let i = 0; i < validCount; i++) {
      const h = validHours[Math.floor(Math.random() * validHours.length)];
      const m = Math.floor(Math.random() * 60);
      const s = Math.floor(Math.random() * 60);

      const campaignObj = activeCampaigns[Math.floor(Math.random() * activeCampaigns.length)];
      const totem = totens[Math.floor(Math.random() * totens.length)];

      const dateStr = formatDate(currentDate, h, m, s);
      rows.push([dateStr, campaignObj.client, campaignObj.campaign, totem, '15']);
    }

    // Inserções FORA do horário comercial (para auditar os descartes)
    // Manhã cedo (antes das 10h em seg-sab ou antes das 12h em dom)
    const earlyHours = dayOfWeek === 0 ? [8, 9, 10, 11] : [7, 8, 9];
    const earlyCount = 8 + Math.floor(Math.random() * 8);
    for (let i = 0; i < earlyCount; i++) {
      const h = earlyHours[Math.floor(Math.random() * earlyHours.length)];
      const m = Math.floor(Math.random() * 60);
      const s = Math.floor(Math.random() * 60);

      const campaignObj = activeCampaigns[Math.floor(Math.random() * activeCampaigns.length)];
      const totem = totens[Math.floor(Math.random() * totens.length)];

      const dateStr = formatDate(currentDate, h, m, s);
      rows.push([dateStr, campaignObj.client, campaignObj.campaign, totem, '15']);
    }

    // Noite tarde (após as 22h)
    const lateHours = [22, 23];
    const lateCount = 5 + Math.floor(Math.random() * 6);
    for (let i = 0; i < lateCount; i++) {
      const h = lateHours[Math.floor(Math.random() * lateHours.length)];
      const m = h === 22 ? 5 + Math.floor(Math.random() * 50) : Math.floor(Math.random() * 60);
      const s = Math.floor(Math.random() * 60);

      const campaignObj = activeCampaigns[Math.floor(Math.random() * activeCampaigns.length)];
      const totem = totens[Math.floor(Math.random() * totens.length)];

      const dateStr = formatDate(currentDate, h, m, s);
      rows.push([dateStr, campaignObj.client, campaignObj.campaign, totem, '15']);
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
