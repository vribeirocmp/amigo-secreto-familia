export function setupBackup(getState, notify) {
  const panel = document.querySelector('#backup-panel');
  const text = document.querySelector('#backup-text');
  const download = document.querySelector('#download-backup');
  const share = document.querySelector('#share-backup');
  let file;
  let objectURL;
  document.querySelector('#export').onclick = () => {
    // Read the existing state only. Never redraw or regenerate a link for a backup.
    text.value = JSON.stringify({version: 1, ...getState()}, null, 2);
    const blob = new Blob([text.value], {type: 'application/json'});
    file = typeof File === 'function' ? new File([blob], 'amigo-secreto-backup.json', {type: 'application/json'}) : null;
    if (objectURL) URL.revokeObjectURL(objectURL);
    objectURL = URL.createObjectURL(blob);
    download.href = objectURL;
    share.hidden = !(file && navigator.canShare?.({files: [file]}));
    panel.hidden = false;
    panel.scrollIntoView({behavior: 'smooth', block: 'nearest'});
  };
  download.onclick = () => notify('Download solicitado. Confira a pasta Downloads. Se o navegador não baixar, use Compartilhar arquivo ou Copiar cópia abaixo.');
  share.onclick = async () => {
    try {
      await navigator.share({files: [file], title: 'Cópia de segurança do amigo secreto'});
    } catch (error) {
      if (error.name !== 'AbortError') notify('Não foi possível compartilhar o arquivo. Use Baixar arquivo ou Copiar cópia.');
    }
  };
  document.querySelector('#copy-backup').onclick = async () => {
    try {
      await navigator.clipboard.writeText(text.value);
      notify('Cópia copiada! Cole em uma nota ou mensagem privada para guardar. Ela contém todos os links; não envie ao grupo.');
    } catch {
      text.focus();
      text.select();
      text.setSelectionRange(0, text.value.length);
      notify('Selecione e copie o texto da cópia de segurança abaixo. Guarde em uma nota privada.');
    }
  };
  window.addEventListener('pagehide', () => {if (objectURL) URL.revokeObjectURL(objectURL);});
}
