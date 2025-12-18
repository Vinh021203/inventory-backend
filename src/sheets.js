import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

console.log('ENV APPS_SCRIPT_URL =', process.env.APPS_SCRIPT_URL);

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
console.log('CONST APPS_SCRIPT_URL =', APPS_SCRIPT_URL);

export async function updateRow(rowIndex, data) {
  const payload = { rowIndex, data };

  const res = await axios.post(APPS_SCRIPT_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
  });

  if (!res.data || !res.data.success) {
    throw new Error(res.data?.error || 'Apps Script error');
  }

  return res.data;
}
