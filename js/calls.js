(() => {
"use strict";
const supabase=window.DARU_SUPABASE;
const $=id=>document.getElementById(id);
let room=null;

function err(t){$("joinError").textContent=t;$("joinError").hidden=false}
function count(){if(room)$("participantCount").textContent=(room.remoteParticipants.size+1)+" qof"}
function tile(p){
 const id="p-"+String(p.identity).replace(/[^a-zA-Z0-9_-]/g,"_");
 let el=document.getElementById(id);
 if(!el){el=document.createElement("div");el.id=id;el.className="participant-tile";el.innerHTML='<div class="participant-media"></div><div class="participant-name"></div>';el.querySelector(".participant-name").textContent=p.name||"Qof";$("videoGrid").appendChild(el)}
 return el;
}
function attach(track,p){const box=tile(p).querySelector(".participant-media");const media=track.attach();media.autoplay=true;media.playsInline=true;box.appendChild(media)}
async function token(name){
 const {data,error}=await supabase.auth.getSession();
 if(error||!data.session)throw Error("Fadlan marka hore gal DARU-SHIFA.");
 const r=await fetch("/api/token",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+data.session.access_token},body:JSON.stringify({participant_name:name})});
 const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||"Call lama diyaarin karin.");return d;
}
async function join(video){
 $("joinError").hidden=true;const name=$("displayName").value.trim();if(!name){err("Fadlan geli magacaaga.");return}
 try{
  $("connectionText").textContent="La xiriiraya...";
  const c=await token(name);
  room=new LivekitClient.Room({adaptiveStream:true,dynacast:true});
  room.on(LivekitClient.RoomEvent.TrackSubscribed,(track,pub,p)=>{attach(track,p);count()})
   .on(LivekitClient.RoomEvent.ParticipantConnected,p=>{tile(p);count()})
   .on(LivekitClient.RoomEvent.ParticipantDisconnected,p=>{const x=document.getElementById("p-"+String(p.identity).replace(/[^a-zA-Z0-9_-]/g,"_"));if(x)x.remove();count()})
   .on(LivekitClient.RoomEvent.Disconnected,()=>cleanup());
  await room.connect(c.serverUrl,c.participantToken);
  if(video) await room.localParticipant.enableCameraAndMicrophone(); else await room.localParticipant.setMicrophoneEnabled(true);
  tile(room.localParticipant);
  $("joinCard").hidden=true;$("roomPanel").hidden=false;$("connectionText").textContent="Waa lagu jiraa";count();
 }catch(e){$("connectionText").textContent="Diyaar";err(e.message)}
}
function cleanup(){$("videoGrid").innerHTML="";$("roomPanel").hidden=true;$("joinCard").hidden=false;$("connectionText").textContent="Diyaar"}
$("joinVideo").onclick=()=>join(true);$("joinAudio").onclick=()=>join(false);
$("leaveBtn").onclick=async()=>{if(room)await room.disconnect();room=null;cleanup()};
$("leaveBtnBottom").onclick=async()=>{if(room)await room.disconnect();room=null;cleanup()};
$("micBtn").onclick=async()=>{if(room)await room.localParticipant.setMicrophoneEnabled(!room.localParticipant.isMicrophoneEnabled)};
$("cameraBtn").onclick=async()=>{if(room)await room.localParticipant.setCameraEnabled(!room.localParticipant.isCameraEnabled)};
})();