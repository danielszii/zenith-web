import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });
const baseUrl = process.env.API_URL || 'http://localhost:3000';
const token = jwt.sign({ id: '00000000-0000-0000-0000-000000000000', role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret_key_local', { expiresIn: '2m' });
const request = async (path: string) => {
  const response = await fetch(`${baseUrl}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status} ${await response.text()}`);
  return response.json();
};
const matches = await request('/mobile/partidas') as Array<{ id_partida: string }>;
if (matches[0]) await request(`/mobile/partidas/${matches[0].id_partida}/pacote`);
console.log(`Smoke mobile aprovado: ${matches.length} partida(s) acessível(is).`);
