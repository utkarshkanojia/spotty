try{let e,a,t,i,s,r,o=document.querySelector(".footer"),l=document.querySelectorAll(".songRow"),n=o.querySelector(".play-pause"),c=document.querySelector("audio"),u=o.querySelector(".song_volume"),d=o.querySelector(".clearQueue"),y=o.querySelector(".forward"),p=o.querySelector(".backward"),m=o.querySelector(".repeat"),g=o.querySelector(".shuffle"),f=document.querySelector(".body__shuffle");const w=async(e,a={})=>{try{const t=await fetch(e,a);return await t.json()}catch(e){console.log(e)}},v=async()=>{try{const l=(await w("/queue")).data;({Tracks:e,currentTrack:a,playbarVisible:t,volume:i,isPlaying:s,loop:r}=l),A(e[a]),c.src=e[a].url,c.volume=i,c.currentTime=e[a].currentTime,u.value=100*i,e[a].duration=c.duration,t&&s?(await q(e[a]),n.classList.remove("fa-circle-pause"),n.classList.add("fa-circle-play")):t&&!s&&(o.click(),await P(e[a]),n.classList.remove("fa-circle-play"),n.classList.add("fa-circle-pause")),o.click(),await P(e[a]),n.classList.remove("fa-circle-play"),n.classList.add("fa-circle-pause"),console.log("Tracks: ",e),console.log("currentTrack: ",a),console.log("playbarVisible: ",t),console.log("volume: ",i),console.log("isPlaying: ",s)}catch(e){}},T=async()=>{for(let o of l)o.addEventListener("click",(async l=>{l.stopPropagation(),l.preventDefault();const u=o.getAttribute("data-song-name"),d=o.getAttribute("data-song-artist"),y=o.getAttribute("data-song-url"),p=o.getAttribute("data-song-thumbnail"),m=u.trim().toLowerCase(),g=e[a]?.name.trim().toLowerCase();if(m===g)return s?(await q(e[a]),n.classList.remove("fa-circle-pause"),void n.classList.add("fa-circle-play")):(await P(e[a]),n.classList.remove("fa-circle-play"),void n.classList.add("fa-circle-pause"));const f={name:u,artist:d,url:y,thumbnail:p,duration:0,currentTime:0,ended:!1,isPlaying:!0};if(e.filter((e=>e.name.trim().toLowerCase()===f.name.trim().toLowerCase())).length>0){if(a=e.findIndex((e=>e.name.trim().toLowerCase()===f.name.trim().toLowerCase())),-1===a)return;return c.src=e[a].url,c.volume=i,await P(e[a]),await A(e[a]),void(e[a].isPlaying&&(n.classList.remove("fa-circle-play"),n.classList.add("fa-circle-pause")))}const v=(await w("/queue/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({Track:f,currentTrack:a,playbarVisible:t,volume:i,isPlaying:s,loop:r})})).data;({Tracks:e,currentTrack:a,playbarVisible:t,volume:i,isPlaying:s,loop:r}=v),c.src=e[a].url,c.volume=i,await P(e[a]),await A(e[a]),e[a].isPlaying&&(n.classList.remove("fa-circle-play"),n.classList.add("fa-circle-pause"))}));f.addEventListener("click",(async e=>{await L()})),u.addEventListener("input",(async e=>{await O(e)})),u.addEventListener("wheel",(async e=>{await N(e)})),n.addEventListener("click",(async t=>{await j(e[a],t)})),y.addEventListener("click",(async e=>{await C()})),p.addEventListener("click",(async e=>{await _()})),d.addEventListener("click",(async e=>{await E()})),m.addEventListener("click",(async e=>{await k(e)})),g.addEventListener("click",(async e=>{await b()})),c.addEventListener("ended",(async t=>{await S(),a===e.length-1&&(r||(await q(e[a]),n.classList.remove("fa-circle-pause"),n.classList.add("fa-circle-play"))),await C()}))},h=async a=>{const t=a.getAttribute("data-song-name"),i=a.getAttribute("data-song-artist"),s=a.getAttribute("data-song-url"),r=a.getAttribute("data-song-thumbnail");e.push({name:t,artist:i,url:s,thumbnail:r,duration:0,currentTime:0,ended:!1,isPlaying:!0})},L=async()=>{await E();for(let e of l)h(e);const o=(await w("/queue/add-songs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({Tracks:e,currentTrack:a,playbarVisible:t,volume:i,isPlaying:s,loop:r})})).data;({Tracks:e,currentTrack:a,playbarVisible:t,volume:i,isPlaying:s,loop:r}=o),c.src=e[a].url,c.volume=i,await P(e[a]),await A(e[a]),e[a].isPlaying&&(n.classList.remove("fa-circle-play"),n.classList.add("fa-circle-pause"))},b=async()=>{(e=>{let t,i=e.length;for(;0!==i;)t=Math.floor(Math.random()*i),i-=1,t!==a&&i!==a&&([e[i],e[t]]=[e[t],e[i]])})(e),new Noty({theme:"metroui",text:"Playlist Shuffled",type:"success",layout:"topRight",timeout:3e3}).show(),await w("/queue/shuffle",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({Tracks:e,currentTrack:a})})},k=async e=>{r=!r,r&&e.target.classList.add("footer__green"),r||e.target.classList.remove("footer__green"),new Noty({theme:"metroui",text:"Loop is now "+(r?"ON":"OFF"),type:"success",layout:"topRight",timeout:3e3}).show();const a=await w("/queue/repeat",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({loop:r})});r=a.data.loop},P=async e=>{await c.play(),s=!0,t=!0,e.duration=c.duration,e.currentTime=c.currentTime,e.isPlaying=!c.paused,e.ended=c.ended,await w("/queue/update",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({Track:e,currentTrack:a,playbarVisible:t,volume:i,isPlaying:s,loop:r})})},q=async e=>{await c.pause(),s=!1,t=!0,e.duration=c.duration,e.currentTime=c.currentTime,e.isPlaying=!c.paused,e.ended=c.ended,await w("/queue/update",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({Track:e,currentTrack:a,playbarVisible:t,volume:i,isPlaying:s,loop:r})})},S=async()=>{c.src&&(await c.pause(),c.currentTime=0)},C=async()=>{(a!==e.length-1||r)&&(await S(),a===e.length-1&&r?a=0:a!==e.length-1&&r?a++:a===e.length-1||r||a++,c.src=e[a].url,c.volume=i,n.classList.remove("fa-circle-play"),n.classList.add("fa-circle-pause"),await A(e[a]),await P(e[a]))},_=async()=>{(0!==a||r)&&(await S(),0===a&&r?a=e.length-1:0!==a&&r?a--:0===a||r||a--,c.src=e[a].url,c.volume=i,n.classList.remove("fa-circle-play"),n.classList.add("fa-circle-pause"),await A(e[a]),await P(e[a]))},E=async()=>{await S(),e=[],a=-1,t=!1,i=.1,s=!1,r=!1,await w("/queue/clear",{method:"DELETE"}),await A()},N=async e=>{e.stopPropagation(),e.deltaY<0?(e.target.valueAsNumber+=1,c.volume=e.target.value/100):(e.target.value-=1,c.volume=e.target.value/100),i=c.volume,u.value=100*i,await w("/queue/volume",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({volume:i})}),e.preventDefault()},O=async e=>{c.volume=e.target.value/100,i=c.volume,u.value=100*i,await w("/queue/volume",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({volume:i})})},j=async(e,a)=>{e.isPlaying?(await q(e),a.target.classList.remove("fa-circle-pause"),a.target.classList.add("fa-circle-play")):(await P(e),a.target.classList.remove("fa-circle-play"),a.target.classList.add("fa-circle-pause"))},A=async(e=[])=>{if(t){o.style.display="flex";const a=o.querySelector(".footer__albumLogo"),t=o.querySelector(".footer__songInfo h4"),i=o.querySelector(".footer__songInfo p");a.src=e.thumbnail,t.textContent=e.name,i.textContent=e.artist,r&&m.classList.add("footer__green"),r||m.classList.remove("footer__green")}else o.style.display="none"};(()=>{window.addEventListener("beforeunload",(async function(o){o.preventDefault();const l=(await w("/queue")).data;({Tracks:e,currentTrack:a,playbarVisible:t,volume:i,isPlaying:s,loop:r}=l),s&&e[a].isPlaying&&(e[a].currentTime=c.currentTime,e[a].isPlaying=!0,e[a].duration=c.duration,await w("/queue/update",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({Track:e[a],currentTrack:a,playbarVisible:t,volume:i,isPlaying:!0,loop:r})}))}))})(),v(),T()}catch(e){console.log(e)}