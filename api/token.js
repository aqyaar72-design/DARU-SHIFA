const {AccessToken}=require("livekit-server-sdk");
module.exports=async function handler(req,res){
 res.setHeader("Access-Control-Allow-Origin","https://daru-shifa.com");
 res.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization");
 res.setHeader("Access-Control-Allow-Methods","POST, OPTIONS");
 if(req.method==="OPTIONS")return res.status(204).end();
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 try{
  const auth=req.headers.authorization||"";
  if(!auth.startsWith("Bearer "))return res.status(401).json({error:"Fadlan marka hore gal akoonkaaga."});
  const r=await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`,{headers:{apikey:process.env.SUPABASE_PUBLISHABLE_KEY,Authorization:auth}});
  if(!r.ok)return res.status(401).json({error:"Session-kaaga ma ansaxayo. Fadlan mar kale gal."});
  const user=await r.json();
  const name=String((req.body||{}).participant_name||"Isticmaale").trim().slice(0,40);
  const identity="u_"+String(user.id).replace(/[^a-zA-Z0-9_-]/g,"").slice(0,50);
  const at=new AccessToken(process.env.LIVEKIT_API_KEY,process.env.LIVEKIT_API_SECRET,{identity,name,ttl:"2h"});
  at.addGrant({roomJoin:true,room:"darushifa-main",canPublish:true,canSubscribe:true,canPublishData:true});
  return res.status(200).json({serverUrl:process.env.LIVEKIT_URL,participantToken:await at.toJwt()});
 }catch(e){console.error(e);return res.status(500).json({error:"Server-ka call-ka ayaa cilad galay."})}
};