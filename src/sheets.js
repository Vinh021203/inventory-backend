import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

// update đang dùng
export async function updateRow(rowIndex, data) {
  const payload = { rowIndex, data };
  const res = await axios.post(APPS_SCRIPT_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000
  });
  if (!res.data || !res.data.success) {
    throw new Error(res.data?.error || 'Apps Script error');
  }
  return res.data;
}

// HÀM MỚI: xóa 1 dòng
export async function deleteRow(rowIndex) {
  const payload = { method: 'delete', rowIndex };
  const res = await axios.post(APPS_SCRIPT_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000
  });
  if (!res.data || !res.data.success) {
    throw new Error(res.data?.error || 'Apps Script delete error');
  }
  return res.data;
}
