(() => {
const supabase=window.DARU_SUPABASE;
(async()=>{
 const {data:{user}}=await supabase.auth.getUser();
 if(!user){location.href="login.html";return}
 const m=user.user_metadata||{};
 document.getElementById("userName").textContent=m.full_name||"Isticmaale";
 document.getElementById("userEmail").textContent=user.email||"";
 document.getElementById("userPhone").textContent=m.phone||"";
 document.getElementById("planDays").textContent=(m.plan_days||7)+" maalmood";
})();
})();