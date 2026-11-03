import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config();

const dnsOverHttps = async (name, type) => {
  const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`);
  if (!response.ok) {
    throw new Error(`DNS lookup failed for ${type}`);
  }
  const data = await response.json();
  if (data.Status !== 0) {
    throw new Error(`DNS lookup failed for ${type}`);
  }
  return data.Answer || [];
};

const directMongoUri = async (uri) => {
  if (!uri?.startsWith('mongodb+srv://')) return uri;

  const match = uri.match(/^mongodb\+srv:\/\/([^@]+)@([^/?]+)(\/[^?]*)?/);
  if (!match) return uri;

  const srv = await dnsOverHttps(`_mongodb._tcp.${match[2]}`, 'SRV');
  const txt = await dnsOverHttps(match[2], 'TXT');
  const hosts = srv.map((record) => {
    const [, , port, target] = record.data.split(' ');
    return `${target.replace(/\.$/, '')}:${port}`;
  });
  if (!hosts.length) {
    throw new Error('Could not resolve the MongoDB hosts');
  }

  const params = new URLSearchParams(txt.map((record) => record.data.replace(/^"|"$/g, '')).join('&'));
  params.set('ssl', 'true');
  const dbPath = match[3] || '';
  return `mongodb://${match[1]}@${hosts.join(',')}${dbPath}?${params.toString()}`;
};

const uri = await directMongoUri(process.env.MONGODB_URI || '');
const child = spawn(process.execPath, ['server.js'], {
  env: { ...process.env, MONGODB_URI: uri },
  stdio: 'inherit'
});

child.on('exit', (code) => process.exit(code ?? 0));
