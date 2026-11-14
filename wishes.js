import {open,seal} from './core.js';
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
export async function applyWishes(state,input){
  const token=input.trim().split('#wishes.').pop();
  const update=await open(token);
  if(update.type!=='wishes'||!state.roundId||update.roundId!==state.roundId)throw new Error('Esta lista é de outro sorteio. Peça o link de atualização da brincadeira atual.');
  const family=state.links.find(l=>l.familyId===update.familyId);
  if(!family)throw new Error('Família não encontrada neste sorteio.');
  const own=await open(family.token),allowed=new Set(own.results.map(r=>r.name));
  if(update.entries.length!==allowed.size||new Set(update.entries.map(e=>e.name)).size!==allowed.size||update.entries.some(e=>!allowed.has(e.name)))throw new Error('Participantes da atualização não conferem.');
  const wishes=new Map(update.entries.map(e=>[e.name,e.wishes]));
  const people=state.people.map(p=>wishes.has(p.name)?{...p,wishes:wishes.get(p.name)}:p);
  const byName=new Map(people.map(p=>[p.name,p.wishes||'']));
  const links=[];
  for(const link of state.links){const data=await open(link.token);data.results=data.results.map(r=>({...r,wishes:byName.get(r.name)||'',targetWishes:byName.get(r.target)||''}));links.push({...link,token:await seal(data)});}
  return {...state,people,links};
}
export function wishesForm(data,container,notify,base){
  if(!data.roundId||!data.familyId){container.append(el('p','Para cadastrar desejos, peça ao organizador um novo link desta brincadeira.','recipient-note'));return;}
  const section=el('section',undefined,'card wishes');section.append(el('h2','O que vocês gostariam de ganhar?'),el('p','Preencha os desejos de cada participante. Depois copie a atualização e envie ao organizador pelo WhatsApp.','muted'));
  const draftKey=`wishes:${data.roundId}:${data.familyId}`;let draft={};try{draft=JSON.parse(localStorage.getItem(draftKey)||'{}');}catch{}
  const fields=data.results.map(r=>{const label=el('label',`Lista de desejos de ${r.name}`),field=el('textarea');field.rows=3;field.maxLength=500;field.placeholder='Ex.: livro, chocolate, camiseta tamanho M…';field.value=typeof draft[r.name]==='string'?draft[r.name]:(r.wishes||'');label.append(field);section.append(label);return {name:r.name,field};});
  const save=el('button','Copiar atualização para o organizador','primary');const output=el('textarea');output.readOnly=true;output.rows=3;output.hidden=true;output.setAttribute('aria-label','Link de atualização dos desejos');
  save.onclick=async()=>{save.disabled=true;try{const entries=fields.map(({name,field})=>({name,wishes:field.value.trim()}));try{localStorage.setItem(draftKey,JSON.stringify(Object.fromEntries(entries.map(e=>[e.name,e.wishes]))));}catch{}
    const token=await seal({type:'wishes',roundId:data.roundId,familyId:data.familyId,entries});const url=base()+'#wishes.'+token;output.value=url;output.hidden=false;try{await navigator.clipboard.writeText(url);notify('Atualização copiada! Envie ao organizador para ele incorporar os desejos e reenviar os links.');}catch{output.select();notify('Copie o link de atualização abaixo e envie ao organizador.');}
  }catch{notify('Não foi possível gerar a atualização. Tente novamente.');}finally{save.disabled=false;}};
  section.append(save,output,el('p','Os desejos só chegam às outras famílias depois que o organizador incorpora a atualização e reenvia os links.','muted'));container.append(section);
}
