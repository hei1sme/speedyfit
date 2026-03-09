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

  const hungRow = {
    user_id:      HUNG_ID,
    user_name:    'Hung',
    date:         dateStr,
    weight_kg:    +hungWeight.toFixed(1),
    gym_checkin:  isGymDay,
    water_liters: +(1.5 + Math.random() * 1.5).toFixed(1),
    cheat_meal:   isSat,
    sleep_score:  Math.floor(5 + Math.random() * 5),
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
    notes:        null,
  };

  rows.push(hungRow, ngaRow);
}

// Print as SQL INSERT
const cols = 'user_id,user_name,date,weight_kg,gym_checkin,water_liters,cheat_meal,sleep_score,notes';
const values = rows.map(r =>
  `  ('${r.user_id}','${r.user_name}','${r.date}',${r.weight_kg},${r.gym_checkin},${r.water_liters},${r.cheat_meal},${r.sleep_score},${r.notes === null ? 'NULL' : `'${r.notes}'`})`
);

const sql = `INSERT INTO daily_logs (${cols}) VALUES\n${values.join(',\n')};\n`;

const outPath = path.join(__dirname, 'seed.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.error(`✓ seed.sql written to ${outPath} (${rows.length} rows)`);
