(() => {
"use strict";
const SUPABASE_URL="https://cvsvlnrikkocolipunru.supabase.co";
const SUPABASE_KEY="sb_publishable_hlhh8l5Qk9HzubKN0QPVHg_QZHByQ-m";
const supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
window.DARU_SUPABASE=supabaseClient;

document.addEventListener("DOMContentLoaded",async()=>{
  const menu=document.querySelector(".mobile-toggle");
  const links=document.querySelector(".links");
  if(menu&&links){
    menu.addEventListener("click",()=>{
      const open=links.classList.toggle("mobile-show");
      menu.textContent=open?"✕":"☰";
    });
    links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("mobile-show")));
  }
  const {data}=await supabaseClient.auth.getUser();
  document.querySelectorAll("[data-auth-link]").forEach(a=>{
    if(data.user){a.textContent="Dashboard";a.href="dashboard.html"}
  });
  const wa=document.querySelector("#waFloat");
  if(wa) wa.href="https://wa.me/917981977002?text="+encodeURIComponent("Asalaamu calaykum DARU-SHIFA.");
});
})();