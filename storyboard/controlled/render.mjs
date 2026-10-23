import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import {once} from 'node:events';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let page;
for(let i=0;i<30;i++){try{page=(await(await fetch('http://127.0.0.1:9223/json')).json()).find(x=>x.type==='page');if(page)break}catch{}await wait(500)}
if(!page)throw Error('Renderer unavailable');
const ws=new WebSocket(page.webSocketDebuggerUrl);await once(ws,'open');let seq=0;const pending=new Map();
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result)}});
const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
await call('Page.navigate',{url:'http://127.0.0.1:4173/storyboard/controlled/render.html?export=1'});
for(let i=0;i<30;i++){const r=await call('Runtime.evaluate',{expression:'window.ready===true',returnByValue:true});if(r.result.value)break;await wait(250)}
const out=spawn('/opt/homebrew/bin/ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-g','6','-keyint_min','6','-sc_threshold','0','-movflags','+faststart','storyboard/controlled/rigid-assembly.mp4'],{stdio:['pipe','inherit','inherit']});
for(let i=0;i<360;i++){
 const r=await call('Runtime.evaluate',{expression:`draw(${i/30})`,returnByValue:true});
 if(!r.result.value)throw Error('Missing rendered frame');
 const bytes=Buffer.from(r.result.value,'base64');if(!out.stdin.write(bytes))await once(out.stdin,'drain');
 if(i===359)await writeFile('storyboard/controlled/assembled-frame.png',bytes);
 if(i%60===0)console.log(`Rendered ${i}/360 frames`);
}
out.stdin.end();const [code]=await once(out,'exit');ws.close();if(code!==0)throw Error('Encode failed');console.log('Controlled assembly rendered.');