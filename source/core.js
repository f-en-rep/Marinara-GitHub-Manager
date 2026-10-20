import { unzipSync, strFromU8 } from 'fflate';
export const CAPS = ['read_active_characters','read_active_persona','full_page_access'];
const LIMIT = 8 * 1024 * 1024;
export function parseRepo(value) {
  const u = new URL(value.trim());
  if(u.protocol !== 'https:' || u.hostname !== 'github.com' || u.port || u.username || u.password || u.search || u.hash) throw Error('https://github.com/소유자/저장소 형식으로 입력하세요.');
  const parts = u.pathname.replace(/\/$/,'').split('/').filter(Boolean);
  if(parts.length !== 2 || parts.some(x=>! /^[\w.-]+$/.test(x))) throw Error('저장소의 기본 주소를 입력하세요.');
  return parts[0]+'/'+parts[1].replace(/\.git$/,'');
}
export async function remote(url, binary=false) {
  const u = new URL(url);
  if(!['api.github.com','github.com','raw.githubusercontent.com','release-assets.githubusercontent.com','objects.githubusercontent.com'].includes(u.hostname) || u.protocol!=='https:' || u.username || u.password || u.port) throw Error('허용되지 않은 다운로드 주소입니다.');
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(),25000);
  try {
    const r = await fetch(url,{credentials:'omit',referrerPolicy:'no-referrer',headers:{Accept:binary?'application/octet-stream':'application/vnd.github+json'},signal:controller.signal});
    if([401,404].includes(r.status)) throw Error('접근 불가: 비공개·삭제된 저장소 또는 파일입니다. 확인을 건너뜁니다.');
    if(r.status===403 || r.status===429) throw Error('접근 제한 또는 GitHub 조회 한도 초과입니다. 나중에 다시 확인하세요.');
    if(!r.ok) throw Error('GitHub 응답 오류 ('+r.status+')');
    const reader=r.body.getReader(); let size=0; const chunks=[];
    while(true) {const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>LIMIT){await reader.cancel();throw Error('다운로드가 8MB 제한을 넘습니다.');}chunks.push(value);}
    const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
    return binary?bytes:JSON.parse(new TextDecoder().decode(bytes));
  } catch(e) { if(e.name==='AbortError')throw Error('GitHub 요청 시간이 초과되었습니다.'); if(e instanceof TypeError)throw Error('GitHub 연결이 차단되었거나 브라우저에서 다운로드를 허용하지 않습니다.'); throw e; }
  finally {clearTimeout(timer);}
}
export function safePath(path) {
 if(typeof path!=='string' || !path || path.startsWith('/') || /[\\\x00-\x1f:]/.test(path) || path.split('/').some(p=>p==='..'||p==='.'||!p)) throw Error('잘못된 패키지 경로입니다.');return path;
}
export function unzip(bytes) {
 let total=0,count=0;
 const result=unzipSync(bytes,{filter:file=>{if(file.name.endsWith('/'))return false;safePath(file.name);total+=file.originalSize;if(total>LIMIT||++count>200)throw Error('압축 해제 크기 또는 파일 수 제한 초과');return true;}});
 return new Map(Object.entries(result).map(([p,b])=>[p,strFromU8(b)]));
}
export async function normalize(raw, read) {
 const envelope=raw.manifest||raw;const c=envelope.config||envelope;
 if(!['marinara.personal-extension','marinara.personal-server-extension','marinara.extension','marinara.server-extension'].includes(envelope.kind))throw Error('마리나라 확장 매니페스트가 아닙니다.');
 if(typeof c.name!=='string'||!c.name.trim()||c.name.length>200)throw Error('확장 이름이 올바르지 않습니다.');
 const runtime=c.runtime==='server'||envelope.kind.includes('server')?'server':'client';
 let capabilities=c.capabilities??(envelope.kind==='marinara.extension'?['full_page_access']:[]);
 if(!Array.isArray(capabilities)||capabilities.some(x=>!CAPS.includes(x)))throw Error('지원하지 않는 확장 권한입니다.');
 capabilities=CAPS.filter(x=>capabilities.includes(x));
 if(runtime==='server'&&capabilities.length)throw Error('서버 확장에는 브라우저 권한을 사용할 수 없습니다.');
 async function code(paths,inline) {if(paths!==undefined){const list=Array.isArray(paths)?paths:[paths];if(!list.length||list.length>40)throw Error('파일 목록 오류');return (await Promise.all(list.map(p=>read(safePath(p))))).join('\n\n');} if(inline!=null&&typeof inline!=='string')throw Error('코드는 문자열이어야 합니다.');return inline||null;}
 const js=runtime==='client'?await code(c.jsPath??c.jsPaths,c.js):null;
 const css=runtime==='client'?await code(c.cssPath??c.cssPaths,c.css):null;
 const serverJs=runtime==='server'?await code(c.serverJsPath??c.serverJsPaths??c.jsPath??c.jsPaths,c.serverJs??c.js):null;
 if(runtime==='client'?!js?.trim()&&!css?.trim():!serverJs?.trim())throw Error('실행 파일이 없습니다.');
 const out={name:c.name.trim(),version:c.version==null?null:String(c.version),description:typeof c.description==='string'?c.description:'',runtime,capabilities,js,css,serverJs};
 if(out.version?.length>64||out.description.length>2000||new TextEncoder().encode(JSON.stringify(out)).length>LIMIT)throw Error('패키지 크기 또는 메타데이터 제한 초과');return out;
}
export async function fingerprint(p) {
 const arr=p.runtime==='server'?['server','','',p.serverJs??'']:['client',p.css??'',p.js??'',''];const caps=CAPS.filter(x=>(p.capabilities||[]).includes(x));if(caps.length)arr.push(caps);
 const bytes=new TextEncoder().encode(JSON.stringify(arr));
 // Pure JS digest also works on HTTP LAN/Termux origins (no crypto.subtle).
 const { sha256 }=await import('@noble/hashes/sha2.js');
 return 'sha256:'+Array.from(sha256(bytes),b=>b.toString(16).padStart(2,'0')).join('');
}
export async function discover(repo) {
 const info=await remote('https://api.github.com/repos/'+repo);
 if(info.private)throw Error('비공개 저장소는 지원하지 않습니다.');
 const commit=await remote('https://api.github.com/repos/'+repo+'/commits/'+encodeURIComponent(info.default_branch));
 const tree=await remote('https://api.github.com/repos/'+repo+'/git/trees/'+commit.sha+'?recursive=1');
 if(tree.truncated)throw Error('저장소가 너무 큽니다. 확장 전용 저장소를 사용하세요.');
 const files=tree.tree.filter(x=>x.type==='blob');
 const choices=files.filter(x=>/(^|\/)manifest\.json$/i.test(x.path)&&!/(^|\/)(node_modules|\.git)\//.test(x.path)).map(x=>({mode:'manifest',path:x.path,label:x.path}));
 choices.push(...files.filter(x=>/\.personal-extension\.zip$/i.test(x.path)).map(x=>({mode:'zip',path:x.path,label:x.path})));
 // Release assets are optional; source packages remain selectable if no release exists.
 try {const releases=await remote('https://api.github.com/repos/'+repo+'/releases?per_page=5');for(const r of releases.filter(x=>!x.draft&&!x.prerelease).slice(0,1))for(const a of r.assets.filter(x=>/\.zip$/i.test(x.name)))choices.unshift({mode:'release',path:a.name,assetId:a.id,tag:r.tag_name,label:r.tag_name+' / '+a.name,notes:r.body||''});}catch(e){if(!String(e.message).includes('접근 불가'))throw e;}
 if(!choices.length)throw Error('manifest.json 또는 설치 가능한 ZIP을 찾지 못했습니다.');
 return {repo,sha:commit.sha,files,choices};
}
export async function loadPackage(snapshot,choice) {
 const {repo,files}=snapshot;let total=0;
 async function blob(path,binary=false){const item=files.find(x=>x.path===safePath(path));if(!item||item.mode==='120000')throw Error('패키지 파일을 찾을 수 없습니다: '+path);total+=item.size||0;if(total>LIMIT)throw Error('패키지가 8MB를 넘습니다.');const b=await remote('https://api.github.com/repos/'+repo+'/git/blobs/'+item.sha);if(b.encoding!=='base64')throw Error('지원하지 않는 GitHub 파일 인코딩');const bytes=Uint8Array.from(atob(b.content.replace(/\s/g,'')),c=>c.charCodeAt(0));return binary?bytes:new TextDecoder().decode(bytes);}
 let payload;
 if(choice.mode==='manifest'){const base=choice.path.slice(0,choice.path.lastIndexOf('/')+1);payload=await normalize(JSON.parse(await blob(choice.path)),p=>blob(base+p));}
 else {const bytes=choice.mode==='release'?await remote('https://api.github.com/repos/'+repo+'/releases/assets/'+choice.assetId,true):await blob(choice.path,true);const map=unzip(bytes);const manifests=[...map.keys()].filter(p=>/(^|\/)manifest\.json$/i.test(p));if(manifests.length!==1)throw Error('ZIP에는 manifest.json이 하나 있어야 합니다.');const path=manifests[0],base=path.slice(0,path.lastIndexOf('/')+1);payload=await normalize(JSON.parse(map.get(path)),async p=>{if(!map.has(base+p))throw Error('ZIP 파일 누락: '+p);return map.get(base+p);});}
 return {payload,hash:await fingerprint(payload),repo,choice,sha:snapshot.sha};
}
