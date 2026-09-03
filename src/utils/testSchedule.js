import { parseDateTime, validatePlaySchedule } from './csvParser.js';

const testCases = [
  // Segundas-feiras (ex: 2024-05-06 é Segunda)
  { date: '2024-05-06 09:59:59', expected: false, desc: 'Segunda 09:59:59 (fora)' },
  { date: '2024-05-06 10:00:00', expected: true, desc: 'Segunda 10:00:00 (início permitido)' },
  { date: '2024-05-06 15:30:00', expected: true, desc: 'Segunda 15:30:00 (permitido)' },
  { date: '2024-05-06 22:00:00', expected: true, desc: 'Segunda 22:00:00 (limite permitido)' },
  { date: '2024-05-06 22:00:01', expected: false, desc: 'Segunda 22:00:01 (após horário)' },
  { date: '2024-05-06 23:45:00', expected: false, desc: 'Segunda 23:45:00 (madrugada/noite fora)' },

  // Sábados (ex: 2024-05-11 é Sábado)
  { date: '2024-05-11 08:30:00', expected: false, desc: 'Sábado 08:30:00 (fora)' },
  { date: '2024-05-11 10:00:00', expected: true, desc: 'Sábado 10:00:00 (permitido)' },
  { date: '2024-05-11 22:00:00', expected: true, desc: 'Sábado 22:00:00 (permitido)' },
  { date: '2024-05-11 22:15:00', expected: false, desc: 'Sábado 22:15:00 (fora)' },

  // Domingos (ex: 2024-05-05 e 2024-05-12 são Domingos)
  { date: '2024-05-12 10:30:00', expected: false, desc: 'Domingo 10:30:00 (antes das 12h - fora)' },
  { date: '2024-05-12 11:59:59', expected: false, desc: 'Domingo 11:59:59 (antes das 12h - fora)' },
  { date: '2024-05-12 12:00:00', expected: true, desc: 'Domingo 12:00:00 (início permitido)' },
  { date: '2024-05-12 17:00:00', expected: true, desc: 'Domingo 17:00:00 (permitido)' },
  { date: '2024-05-12 22:00:00', expected: true, desc: 'Domingo 22:00:00 (limite permitido)' },
  { date: '2024-05-12 22:00:01', expected: false, desc: 'Domingo 22:00:01 (após 22h - fora)' },

  // Formato brasileiro DD/MM/YYYY
  { date: '06/05/2024 14:20:10', expected: true, desc: '06/05/2024 14:20:10 (Segunda - permitido)' },
  { date: '12/05/2024 11:30:00', expected: false, desc: '12/05/2024 11:30:00 (Domingo antes 12h - fora)' },
  { date: '12/05/2024 14:00:00', expected: true, desc: '12/05/2024 14:00:00 (Domingo - permitido)' },
];

let failed = 0;
for (const tc of testCases) {
  const parsed = parseDateTime(tc.date);
  const result = validatePlaySchedule(parsed);
  const pass = result.isValid === tc.expected;
  if (!pass) {
    console.error(`FAIL: ${tc.desc} -> Esperado ${tc.expected}, obtido ${result.isValid}. Razão: ${result.reason}`);
    failed++;
  } else {
    console.log(`PASS: ${tc.desc} -> ${result.isValid ? 'ACEITO' : 'EXPURGADO'} (${result.reason})`);
  }
}

if (failed === 0) {
  console.log(`\nTODOS OS ${testCases.length} TESTES PASSARAM COM SUCESSO!`);
  process.exit(0);
} else {
  console.error(`\n${failed} TESTES FALHARAM!`);
  process.exit(1);
}
