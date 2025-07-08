const socket=io();
const statusEl=document.getElementById("status");
const shapeEl=document.getElementById("shape");
const scoreEl=document.getElementById("score");
const leaderboardEl=document.getElementById("leaderboard");
let localClicks=0;
const username=window.prompt("Enter a username:")||"Guest";
let scaleFactor=1;
socket.emit("join_game",{username});
if(statusEl) socket.on("joined",({id,username:serverName})=>{statusEl.textContent=`You are ${serverName} (id: ${id})`;});
const words=["anger","stress","anxiety","doubt","fear","guilt","sadness","envy","regret","loneliness"];
const customWordInput=document.getElementById("custom-word-input");
const addWordBtn=document.getElementById("add-word-btn");
const colors=["#ee6c4d","#e9ac4d","#d4a373","#a7c957","#57c6a1","#6da9e4","#c29def","#f28585"];
const container=document.getElementById("bubble-app")||document.body;
function spawnWordBox(word,x,y,dx=0,dy=0){const span=document.createElement("span");span.className="word-box floating";span.textContent=word;span.contentEditable="true";span.style.left=`${x}px`;span.style.top=`${y}px`;span.style.setProperty("--dx",`${dx}px`);span.style.setProperty("--dy",`${dy}px`);const floatX=(Math.random()-0.5)*80;const floatY=(Math.random()-0.5)*80;span.style.setProperty("--floatX",`${floatX}px`);span.style.setProperty("--floatY",`${floatY}px`);span.style.background=colors[Math.floor(Math.random()*colors.length)];span.addEventListener("click",()=>{span.classList.remove("floating");span.classList.add("fade-out");span.addEventListener("animationend",()=>span.remove(),{once:true});});container.appendChild(span);}
function createWordExplosion(x,y,count=16){for(let i=0;i<count;i++){const emoji=emojis[Math.floor(Math.random()*emojis.length)];const span=document.createElement("span");span.className="emoji";span.textContent=emoji;span.style.left=`${x}px`;span.style.top=`${y}px`;const dx=(Math.random()-0.5)*400;const dy=(Math.random()-0.5)*400;span.style.setProperty("--dx",`${dx}px`);span.style.setProperty("--dy",`${dy}px`);container.appendChild(span);span.addEventListener("click",()=>{span.classList.add("fade-out");span.addEventListener("animationend",()=>span.remove(),{once:true});});span.addEventListener("animationend",()=>span.remove(),{once:true});}}
if(shapeEl){shapeEl.addEventListener("click",()=>{localClicks+=1;scaleFactor=1+localClicks*0.05;shapeEl.style.setProperty("--scale",scaleFactor);shapeEl.classList.add("shake");socket.emit("click_shape");const rect=shapeEl.getBoundingClientRect();createWordExplosion(rect.left+rect.width/2,rect.top+rect.height/2);if(localClicks>=10){socket.emit("explode_shape");shapeEl.classList.remove("shake");shapeEl.classList.add("burst");shapeEl.addEventListener("animationend",()=>shapeEl.classList.remove("burst"),{once:true});localClicks=0;scaleFactor=1;shapeEl.style.setProperty("--scale",scaleFactor);}scoreEl.textContent=localClicks;});}
socket.on("shape_clicked",({totalClicks})=>{console.log("Total clicks: ",totalClicks);});
socket.on("shape_exploded",({id,totalExplosions})=>{console.log(`Boom by ${id}! Total explosions: ${totalExplosions}`);});
socket.on("leaderboard_update",leaderboard=>{if(!leaderboardEl) return;leaderboardEl.innerHTML="";leaderboard.forEach(player=>{const li=document.createElement("li");li.textContent=`${player.username}: ${player.score}`;leaderboardEl.appendChild(li);});});
addWordBtn?.addEventListener("click",()=>{const val=customWordInput.value.trim();if(val){words.push(val);customWordInput.value="";const appRect=container.getBoundingClientRect();spawnWordBox(val,appRect.left+Math.random()*appRect.width,appRect.top+Math.random()*appRect.height);}});
const emojis=["🔥","💥","🎉","✨","🌟","💫","🧨","🎊","💖","⚡"]; // used for bursts