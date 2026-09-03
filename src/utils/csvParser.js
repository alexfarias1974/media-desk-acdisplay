import Papa from 'papaparse';

/**
 * Normalizes text for matching column names
 */
function normalizeHeader(header) {
  if (!header) return '';
  return header
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_');
}

/**
 * Finds the best matching column name from a list of possible candidates
 */
function findColumn(headers, candidates) {
  const normMap = {};
  headers.forEach(h => {
    normMap[normalizeHeader(h)] = h;
  });

  for (const candidate of candidates) {
    const normCand = normalizeHeader(candidate);
    // Exact match
    if (normMap[normCand]) return normMap[normCand];
    
    // Substring match
    const found = headers.find(h => {
      const normH = normalizeHeader(h);
      return normH.includes(normCand) || normCand.includes(normH);
    });
    if (found) return found;
  }
  return null;
}

/**
 * Parses date string or Date object into { date, dayOfWeek, hour, minute, second, isValid }
 * Supports formats:
 * - DD/MM/YYYY HH:mm:ss or DD/MM/YYYY HH:mm
 * - YYYY-MM-DD HH:mm:ss or YYYY-MM-DDTHH:mm:ss
 * - MM/DD/YYYY HH:mm:ss
 */
export function parseDateTime(rawDate, rawTime) {
  if (!rawDate) return { isValid: false, error: 'Data vazia' };

  let dateStr = String(rawDate).trim();
  let timeStr = rawTime ? String(rawTime).trim() : '';

  // If time is embedded in date (e.g. "2024-05-10 14:30:00" or "10/05/2024 14:30")
  if (!timeStr && (dateStr.includes(' ') || dateStr.includes('T'))) {
    const parts = dateStr.split(/[ T]+/);
    dateStr = parts[0];
    timeStr = parts[1] || '00:00:00';
  }

  // Parse Date Part
  let year, month, day;
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY/MM/DD
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2], 10);
      } else {
        // DD/MM/YYYY
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        year = parseInt(parts[2], 10);
      }
    }
  } else if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2], 10);
      } else {
        // DD-MM-YYYY
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        year = parseInt(parts[2], 10);
      }
    }
  }

  // Parse Time Part
  let hour = 0, minute = 0, second = 0;
  if (timeStr) {
    const timeClean = timeStr.replace(/[^0-9:]/g, '');
    const timeParts = timeClean.split(':');
    if (timeParts.length >= 2) {
      hour = parseInt(timeParts[0], 10);
      minute = parseInt(timeParts[1], 10);
      second = timeParts[2] ? parseInt(timeParts[2], 10) : 0;
    }
  }

  if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) {
    // Fallback to native Date
    const nativeD = new Date(rawDate);
    if (!isNaN(nativeD.getTime())) {
      const d = nativeD;
      return {
        isValid: true,
        dateObj: d,
        dayOfWeek: d.getDay(), // 0 = Dom, 1 = Seg, ..., 6 = Sab
        hour: d.getHours(),
        minute: d.getMinutes(),
        second: d.getSeconds(),
        formattedDate: d.toLocaleDateString('pt-BR'),
        formattedTime: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`,
        isoString: d.toISOString(),
      };
    }
    return { isValid: false, error: 'Formato de data/hora não reconhecido' };
  }

  const d = new Date(year, month, day, hour, minute, second);
  if (isNaN(d.getTime())) {
    return { isValid: false, error: 'Data inválida' };
  }

  const dayOfWeek = d.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

  return {
    isValid: true,
    dateObj: d,
    dayOfWeek,
    hour,
    minute,
    second,
    formattedDate: `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`,
    formattedTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`,
    isoString: d.toISOString(),
    rawDateFormatted: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
}

/**
 * Evaluates business rule:
 * - Segunda a Sábado (1-6): 10:00:00 <= time <= 22:00:00
 * - Domingo (0): 12:00:00 <= time <= 22:00:00
 *
 * All others must be discarded.
 */
export function validatePlaySchedule(parsedDate) {
  if (!parsedDate.isValid) {
    return {
      isValid: false,
      reason: 'Data/Hora Inválida',
      detail: parsedDate.error || 'Não foi possível ler o timestamp',
    };
  }

  const { dayOfWeek, hour, minute, second } = parsedDate;
  // Convert current time to total seconds from start of day for precise comparison
  const totalSeconds = hour * 3600 + minute * 60 + second;

  const SECONDS_10H = 10 * 3600; // 36000
  const SECONDS_12H = 12 * 3600; // 43200
  const SECONDS_22H = 22 * 3600; // 79200

  // Domingo = 0
  if (dayOfWeek === 0) {
    if (totalSeconds < SECONDS_12H) {
      return {
        isValid: false,
        reason: 'Domingo antes das 12:00h',
        detail: `Exibição às ${parsedDate.formattedTime} no Domingo (janela permitida: 12h às 22h)`,
      };
    }
    if (totalSeconds > SECONDS_22H) {
      return {
        isValid: false,
        reason: 'Domingo após as 22:00h',
        detail: `Exibição às ${parsedDate.formattedTime} no Domingo (janela permitida: 12h às 22h)`,
      };
    }
    return { isValid: true, reason: 'Horário comercial válido (Domingo)' };
  }

  // Segunda a Sábado = 1 a 6
  if (totalSeconds < SECONDS_10H) {
    return {
      isValid: false,
      reason: 'Segunda a Sábado antes das 10:00h',
      detail: `Exibição às ${parsedDate.formattedTime} (janela permitida: 10h às 22h)`,
    };
  }
  if (totalSeconds > SECONDS_22H) {
    return {
      isValid: false,
      reason: 'Segunda a Sábado após as 22:00h',
      detail: `Exibição às ${parsedDate.formattedTime} (janela permitida: 10h às 22h)`,
    };
  }

  return { isValid: true, reason: 'Horário comercial válido (Segunda a Sábado)' };
}

/**
 * Parses CSV raw text or File and processes the data
 */
export function processCSVContent(fileContent) {
  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: h => h.trim(),
      complete: (results) => {
        try {
          const rows = results.data;
          const headers = results.meta.fields || [];

          if (rows.length === 0) {
            return reject(new Error('O arquivo CSV está vazio.'));
          }

          // Automatically detect columns
          const colDate = findColumn(headers, [
            'data_hora', 'datahora', 'datetime', 'timestamp', 'data', 'data_exibicao', 'horario', 'created_at', 'data_e_hora', 'exibido_em'
          ]);
          const colTime = findColumn(headers, [
            'hora', 'time', 'horario', 'hora_exibicao'
          ]);
          const colMedia = findColumn(headers, [
            'midia', 'campanha', 'arquivo', 'video', 'nome_midia', 'nome_arquivo', 'conteudo', 'anuncio', 'titulo', 'item'
          ]);
          const colClient = findColumn(headers, [
            'cliente', 'anunciante', 'empresa', 'marca', 'client', 'advertiser', 'conta'
          ]);
          const colTotem = findColumn(headers, [
            'totem', 'ponto', 'player', 'local', 'dispositivo', 'display', 'tela', 'localizacao', 'terminal'
          ]);
          const colDuration = findColumn(headers, [
            'duracao', 'duration', 'tempo', 'tempo_segundos', 'segundos', 'sec'
          ]);

          const validPlays = [];
          const discardedPlays = [];
          const discardReasons = {};

          rows.forEach((row, index) => {
            const rawDateVal = colDate ? row[colDate] : (row['data'] || row['Data'] || row['DATE']);
            const rawTimeVal = colTime && colTime !== colDate ? row[colTime] : null;

            const parsedDate = parseDateTime(rawDateVal, rawTimeVal);
            const validation = validatePlaySchedule(parsedDate);

            const mediaName = (colMedia && row[colMedia]) 
              ? String(row[colMedia]).trim() 
              : 'Mídia Padrão';
            
            const clientName = (colClient && row[colClient]) 
              ? String(row[colClient]).trim() 
              : mediaName.split(/[-–|]/)[0]?.trim() || 'Cliente Geral';

            const totemName = (colTotem && row[colTotem]) 
              ? String(row[colTotem]).trim() 
              : 'Totem Geral';

            let duration = 15; // default 15s per totem slot
            if (colDuration && row[colDuration]) {
              const parsedDur = parseFloat(String(row[colDuration]).replace(/[^0-9.]/g, ''));
              if (!isNaN(parsedDur) && parsedDur > 0) duration = parsedDur;
            }

            const record = {
              id: index + 1,
              originalIndex: index + 2, // Excel row numbering (accounting for header)
              rawRow: row,
              media: mediaName,
              client: clientName,
              totem: totemName,
              duration,
              dateObj: parsedDate.isValid ? parsedDate.dateObj : null,
              dateStr: parsedDate.isValid ? parsedDate.formattedDate : 'Inválida',
              timeStr: parsedDate.isValid ? parsedDate.formattedTime : 'Inválida',
              dayOfWeek: parsedDate.isValid ? parsedDate.dayOfWeek : -1,
              hour: parsedDate.isValid ? parsedDate.hour : -1,
              rawDateFormatted: parsedDate.rawDateFormatted || '',
              isValid: validation.isValid,
              reason: validation.reason,
              detail: validation.detail,
            };

            if (validation.isValid) {
              validPlays.push(record);
            } else {
              discardedPlays.push(record);
              discardReasons[validation.reason] = (discardReasons[validation.reason] || 0) + 1;
            }
          });

          // Metrics summary
          const totalRaw = rows.length;
          const totalValid = validPlays.length;
          const totalDiscarded = discardedPlays.length;
          const complianceRate = totalRaw > 0 ? ((totalValid / totalRaw) * 100).toFixed(1) : 0;
          const totalDurationSeconds = validPlays.reduce((acc, curr) => acc + curr.duration, 0);

          // Group by Media
          const mediaMap = {};
          validPlays.forEach(p => {
            if (!mediaMap[p.media]) {
              mediaMap[p.media] = {
                media: p.media,
                client: p.client,
                plays: 0,
                durationSeconds: 0,
                totems: new Set(),
                dates: new Set(),
              };
            }
            mediaMap[p.media].plays += 1;
            mediaMap[p.media].durationSeconds += p.duration;
            mediaMap[p.media].totems.add(p.totem);
            mediaMap[p.media].dates.add(p.dateStr);
          });

          const mediaStats = Object.values(mediaMap).map(m => ({
            media: m.media,
            client: m.client,
            plays: m.plays,
            durationSeconds: m.durationSeconds,
            durationFormatted: formatDuration(m.durationSeconds),
            totemCount: m.totems.size,
            activeDays: m.dates.size,
            avgPlaysPerDay: m.dates.size > 0 ? Math.round(m.plays / m.dates.size) : m.plays,
          })).sort((a, b) => b.plays - a.plays);

          // Group by Client
          const clientMap = {};
          validPlays.forEach(p => {
            if (!clientMap[p.client]) {
              clientMap[p.client] = {
                client: p.client,
                plays: 0,
                medias: new Set(),
                durationSeconds: 0,
              };
            }
            clientMap[p.client].plays += 1;
            clientMap[p.client].medias.add(p.media);
            clientMap[p.client].durationSeconds += p.duration;
          });

          const clientStats = Object.values(clientMap).map(c => ({
            client: c.client,
            plays: c.plays,
            mediaCount: c.medias.size,
            durationSeconds: c.durationSeconds,
            durationFormatted: formatDuration(c.durationSeconds),
          })).sort((a, b) => b.plays - a.plays);

          // Group by Day (Timeline)
          const dayMap = {};
          validPlays.forEach(p => {
            if (!p.rawDateFormatted) return;
            if (!dayMap[p.rawDateFormatted]) {
              dayMap[p.rawDateFormatted] = {
                dateKey: p.rawDateFormatted,
                displayDate: p.dateStr,
                plays: 0,
                durationSeconds: 0,
              };
            }
            dayMap[p.rawDateFormatted].plays += 1;
            dayMap[p.rawDateFormatted].durationSeconds += p.duration;
          });

          const timelineStats = Object.keys(dayMap).sort().map(k => dayMap[k]);

          // Group by Hour of Day (All 24 hours to show the filtering contrast)
          const hourStats = Array.from({ length: 24 }, (_, h) => {
            const hStr = `${String(h).padStart(2, '0')}:00`;
            return {
              hour: h,
              label: hStr,
              validPlays: 0,
              discardedPlays: 0,
              isCommercialWindow: h >= 10 && h <= 22,
            };
          });

          validPlays.forEach(p => {
            if (p.hour >= 0 && p.hour <= 23) {
              hourStats[p.hour].validPlays += 1;
            }
          });

          discardedPlays.forEach(p => {
            if (p.hour >= 0 && p.hour <= 23) {
              hourStats[p.hour].discardedPlays += 1;
            }
          });

          // Group by Day of Week
          const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
          const dayOfWeekStats = dayNames.map((name, index) => ({
            index,
            day: name,
            plays: 0,
            discarded: 0,
          }));

          validPlays.forEach(p => {
            if (p.dayOfWeek >= 0 && p.dayOfWeek <= 6) {
              dayOfWeekStats[p.dayOfWeek].plays += 1;
            }
          });

          discardedPlays.forEach(p => {
            if (p.dayOfWeek >= 0 && p.dayOfWeek <= 6) {
              dayOfWeekStats[p.dayOfWeek].discarded += 1;
            }
          });

          // Group by Totem
          const totemMap = {};
          validPlays.forEach(p => {
            totemMap[p.totem] = (totemMap[p.totem] || 0) + 1;
          });
          const totemStats = Object.entries(totemMap).map(([totem, plays]) => ({
            totem,
            plays,
          })).sort((a, b) => b.plays - a.plays);

          // Detailed Frequency & Averages: Media by Media and Separated by Totem
          // Map: mediaName -> { totalPlays, activeDays, totems: { totemName: { plays, dates: Set } } }
          const mediaFrequencyMap = {};
          // Map: totemName -> { totalPlays, activeDays, medias: { mediaName: { plays, dates: Set } } }
          const totemFrequencyMap = {};

          validPlays.forEach(p => {
            // Media map
            if (!mediaFrequencyMap[p.media]) {
              mediaFrequencyMap[p.media] = {
                media: p.media,
                client: p.client,
                totalPlays: 0,
                dates: new Set(),
                totems: {},
              };
            }
            mediaFrequencyMap[p.media].totalPlays += 1;
            mediaFrequencyMap[p.media].dates.add(p.dateStr);

            if (!mediaFrequencyMap[p.media].totems[p.totem]) {
              mediaFrequencyMap[p.media].totems[p.totem] = {
                totem: p.totem,
                plays: 0,
                dates: new Set(),
              };
            }
            mediaFrequencyMap[p.media].totems[p.totem].plays += 1;
            mediaFrequencyMap[p.media].totems[p.totem].dates.add(p.dateStr);

            // Totem map
            if (!totemFrequencyMap[p.totem]) {
              totemFrequencyMap[p.totem] = {
                totem: p.totem,
                totalPlays: 0,
                dates: new Set(),
                medias: {},
              };
            }
            totemFrequencyMap[p.totem].totalPlays += 1;
            totemFrequencyMap[p.totem].dates.add(p.dateStr);

            if (!totemFrequencyMap[p.totem].medias[p.media]) {
              totemFrequencyMap[p.totem].medias[p.media] = {
                media: p.media,
                client: p.client,
                plays: 0,
                dates: new Set(),
              };
            }
            totemFrequencyMap[p.totem].medias[p.media].plays += 1;
            totemFrequencyMap[p.totem].medias[p.media].dates.add(p.dateStr);
          });

          // Format media frequency stats
          const mediaFrequencyStats = Object.values(mediaFrequencyMap).map(m => {
            const activeDays = Math.max(1, m.dates.size);
            const avgPerDay = Number((m.totalPlays / activeDays).toFixed(1));
            const avgPerWeek = Number((avgPerDay * 7).toFixed(1));
            const monthTotal = Math.round(avgPerDay * 30);

            const totemBreakdown = Object.values(m.totems).map(t => {
              const tActiveDays = Math.max(1, t.dates.size);
              const tAvgDay = Number((t.plays / tActiveDays).toFixed(1));
              const tAvgWeek = Number((tAvgDay * 7).toFixed(1));
              const tMonthTotal = Math.round(tAvgDay * 30);
              const share = Number(((t.plays / m.totalPlays) * 100).toFixed(1));

              return {
                totem: t.totem,
                plays: t.plays,
                activeDays: tActiveDays,
                avgPerDay: tAvgDay,
                avgPerWeek: tAvgWeek,
                monthTotal: tMonthTotal,
                share,
              };
            }).sort((a, b) => b.plays - a.plays);

            return {
              media: m.media,
              client: m.client,
              totalPlays: m.totalPlays,
              activeDays,
              avgPerDay,
              avgPerWeek,
              monthTotal,
              totemCount: totemBreakdown.length,
              totemBreakdown,
            };
          }).sort((a, b) => b.totalPlays - a.totalPlays);

          // Format totem frequency stats
          const totemFrequencyStats = Object.values(totemFrequencyMap).map(t => {
            const activeDays = Math.max(1, t.dates.size);
            const avgPerDay = Number((t.totalPlays / activeDays).toFixed(1));
            const avgPerWeek = Number((avgPerDay * 7).toFixed(1));
            const monthTotal = Math.round(avgPerDay * 30);

            const mediaBreakdown = Object.values(t.medias).map(med => {
              const mActiveDays = Math.max(1, med.dates.size);
              const mAvgDay = Number((med.plays / mActiveDays).toFixed(1));
              const mAvgWeek = Number((mAvgDay * 7).toFixed(1));
              const mMonthTotal = Math.round(mAvgDay * 30);
              const share = Number(((med.plays / t.totalPlays) * 100).toFixed(1));

              return {
                media: med.media,
                client: med.client,
                plays: med.plays,
                activeDays: mActiveDays,
                avgPerDay: mAvgDay,
                avgPerWeek: mAvgWeek,
                monthTotal: mMonthTotal,
                share,
              };
            }).sort((a, b) => b.plays - a.plays);

            return {
              totem: t.totem,
              totalPlays: t.totalPlays,
              activeDays,
              avgPerDay,
              avgPerWeek,
              monthTotal,
              mediaCount: mediaBreakdown.length,
              mediaBreakdown,
            };
          }).sort((a, b) => b.totalPlays - a.totalPlays);

          resolve({
            summary: {
              totalRaw,
              totalValid,
              totalDiscarded,
              complianceRate: Number(complianceRate),
              totalDurationSeconds,
              totalDurationFormatted: formatDuration(totalDurationSeconds),
              uniqueMedias: mediaStats.length,
              uniqueClients: clientStats.length,
              uniqueTotems: totemStats.length,
              periodStart: timelineStats[0]?.displayDate || 'N/A',
              periodEnd: timelineStats[timelineStats.length - 1]?.displayDate || 'N/A',
            },
            detectedColumns: {
              date: colDate,
              time: colTime,
              media: colMedia,
              client: colClient,
              totem: colTotem,
              duration: colDuration,
              allHeaders: headers,
            },
            discardReasons: Object.entries(discardReasons).map(([reason, count]) => ({
              reason,
              count,
              percentage: totalRaw > 0 ? ((count / totalRaw) * 100).toFixed(1) : 0,
            })),
            mediaStats,
            clientStats,
            timelineStats,
            hourStats,
            dayOfWeekStats,
            totemStats,
            mediaFrequencyStats,
            totemFrequencyStats,
            validPlays,
            discardedPlays,
          });
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => {
        reject(new Error(`Erro ao ler CSV: ${err.message}`));
      },
    });
  });
}

/**
 * Formats duration in seconds to "Xh Ym Zs" or "Xm Zs"
 */
export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0s';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  const parts = [];
  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0 || hrs > 0) parts.push(`${mins}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}
