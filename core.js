export const normalize = name => name.trim().normalize('NFC').toLocaleLowerCase('pt-BR');
export function drawNames(people, random = max => {const a = new Uint32Array(1);const limit = Math.floor(2 ** 32 / max) * max;do {crypto.getRandomValues(a);} while(a[0] >= limit);return a[0] % max;}) {
  if(people.length < 2 || people.length > 100) throw new Error('Adicione entre 2 e 100 participantes.');
  for(let attempt = 0; attempt < 1000; attempt++) {
    const shuffled = people.map((_,i) => i);
    for(let i = shuffled.length - 1; i > 0; i--) {const j = random(i+1);[shuffled[i],shuffled[j]] = [shuffled[j],shuffled[i]];}
    if(shuffled.every((v,i) => v !== i)) return people.map((p,i) => ({name:p.name,guardian:p.guardian,target:people[shuffled[i]].name}));
  }
  throw new Error('Não foi possível sortear. Tente novamente.');
}
const b64 = bytes => btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
function unb64(text){if(!/^[\w-]+$/.test(text)) throw new Error('Link inválido.');return Uint8Array.from(atob(text.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));}
export async function seal(payload) {
  const key = await crypto.subtle.generateKey({name:'AES-GCM',length:256},true,['encrypt','decrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(payload)));
  return `v1.${b64(new Uint8Array(await crypto.subtle.exportKey('raw',key)))}.${b64(iv)}.${b64(new Uint8Array(encrypted))}`;
}
export async function open(token) {
  if(token.length > 50000) throw new Error('Link inválido.');
  const parts = token.split('.');if(parts.length !== 4 || parts[0] !== 'v1') throw new Error('Link inválido.');
  const key = await crypto.subtle.importKey('raw',unb64(parts[1]),'AES-GCM',false,['decrypt']);
  const raw = await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(parts[2])},key,unb64(parts[3]));
  const data = JSON.parse(new TextDecoder().decode(raw));
  if(typeof data.title !== 'string' || typeof data.guardian !== 'string' || !Array.isArray(data.results) || data.results.length < 1 || data.results.length > 100 || data.results.some(r=>typeof r.name !== 'string'||typeof r.target !== 'string')) throw new Error('Link inválido.');
  return data;
}
