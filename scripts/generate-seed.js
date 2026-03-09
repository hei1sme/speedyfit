// scripts/generate-seed.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const HUNG_ID = '<HUNG_USER_ID>';
const NGA_ID  = '<NGA_USER_ID>';

const startDate = new Date('2025-12-09');
const rows = [];

let hungWeight = 95.4;
let ngaWeight  = 60.2;

for (let i = 0; i < 90; i++) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + i);
  const dateStr  = d.toISOString().split('T')[0];
  const isSat    = d.getDay() === 6;
  const isGymDay = [1, 2, 3, 4, 6].includes(d.getDay()); // Mon–Fri + Sat

  // Gradual downward trend with realistic daily noise
  hungWeight -= (Math.random() * 0.12 - 0.03); // ~0.5 kg/week
  ngaWeight  -= (Math.random() * 0.08 - 0.02); // ~0.35 kg/week

  // Body measurements every ~14 days (bi-weekly)
  const isMeasureDay = i % 14 === 0;

  const hungRow = {
    user_id:      HUNG_ID,
    user_name:    'Hung',
    date:         dateStr,
    weight_kg:    +hungWeight.toFixed(1),
    gym_checkin:  isGymDay,
    water_liters: +(1.5 + Math.random() * 1.5).toFixed(1),
    cheat_meal:   isSat,
    sleep_score:  Math.floor(5 + Math.random() * 5),
    energy_level: Math.random() > 0.25 ? Math.floor(4 + Math.random() * 6) : null,
    waist_cm:     isMeasureDay ? +(85 - i * 0.08 + Math.random() * 1).toFixed(1) : null,
    belly_cm:     isMeasureDay ? +(92 - i * 0.09 + Math.random() * 1).toFixed(1) : null,
    hip_cm:       isMeasureDay ? +(98 - i * 0.05 + Math.random() * 1).toFixed(1) : null,
    thigh_cm:     isMeasureDay ? +(58 - i * 0.03 + Math.random() * 0.5).toFixed(1) : null,
    notes:        null,
  };

  const ngaRow = {
    user_id:      NGA_ID,
    user_name:    'Nga',
    date:         dateStr,
    weight_kg:    +ngaWeight.toFixed(1),
    gym_checkin:  isGymDay && Math.random() > 0.2, // slightly less consistent
    water_liters: +(1.0 + Math.random() * 2.0).toFixed(1),
    cheat_meal:   isSat && Math.random() > 0.4,
    sleep_score:  Math.floor(6 + Math.random() * 4),
    energy_level: Math.random() > 0.25 ? Math.floor(5 + Math.random() * 5) : null,
    waist_cm:     isMeasureDay ? +(68 - i * 0.04 + Math.random() * 0.8).toFixed(1) : null,
    belly_cm:     isMeasureDay ? +(72 - i * 0.05 + Math.random() * 0.8).toFixed(1) : null,
    hip_cm:       isMeasureDay ? +(90 - i * 0.03 + Math.random() * 0.8).toFixed(1) : null,
    thigh_cm:     isMeasureDay ? +(50 - i * 0.02 + Math.random() * 0.5).toFixed(1) : null,
    notes:        null,
  };

  rows.push(hungRow, ngaRow);
}

// Print as SQL INSERT
const cols = 'user_id,user_name,date,weight_kg,gym_checkin,water_liters,cheat_meal,sleep_score,energy_level,waist_cm,belly_cm,hip_cm,thigh_cm,notes';
const sqlVal = v => v === null ? 'NULL' : typeof v === 'string' ? `'${v}'` : v;
const values = rows.map(r =>
  `  ('${r.user_id}','${r.user_name}','${r.date}',${r.weight_kg},${r.gym_checkin},${r.water_liters},${r.cheat_meal},${r.sleep_score},${sqlVal(r.energy_level)},${sqlVal(r.waist_cm)},${sqlVal(r.belly_cm)},${sqlVal(r.hip_cm)},${sqlVal(r.thigh_cm)},${sqlVal(r.notes)})`
);

const sql = `INSERT INTO daily_logs (${cols}) VALUES\n${values.join(',\n')};\n`;

const outPath = path.join(__dirname, 'seed.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.error(`✓ seed.sql written to ${outPath} (${rows.length} rows)`);
