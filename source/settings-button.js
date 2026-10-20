// Attach only inside Marinara's external-extension import section.
export function attachSettingsButton(open) {
 const button=document.createElement('button');
 button.type='button';button.id='marinara-github-settings-button';
 button.setAttribute('aria-label','GitHub 확장 관리');
 button.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-4.3 1.3-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.2-1.5 6.2-6.9a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.8s-1.2-.4-4 1.5a13.3 13.3 0 0 0-7.2 0C4.7.5 3.5.9 3.5.9a5 5 0 0 0-.1 3.8A5.4 5.4 0 0 0 2 8.5c0 5.4 3.2 6.6 6.2 6.9a3.4 3.4 0 0 0-.9 2.7V22" transform="translate(2 0) scale(.85)"/></svg><span>GitHub 확장 관리</span>';
 button.onclick=open;
 function sync(){
  const section=document.getElementById('settings-section-external-extensions');
  const folder=section?.querySelector('svg.lucide-folder-open')?.closest('button') || (section && [...section.querySelectorAll('button')].find(b=>/확장 폴더 가져오기|Import (?:Extension )?Folder/i.test(b.textContent)));
  if(!folder){if(button.isConnected)button.remove();return;}
  if(button.className!==folder.className)button.className=folder.className;
  if(button.parentElement!==folder.parentElement||folder.nextElementSibling!==button)folder.after(button);
 }
 const observer=new MutationObserver(sync);
 observer.observe(document.body,{childList:true,subtree:true});sync();
 return {focus:()=>button.isConnected&&button.focus(),destroy:()=>{observer.disconnect();button.remove();}};
}
