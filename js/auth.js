(() => {
const supabase=window.DARU_SUPABASE;
const signup=document.getElementById("signupForm");
const login=document.getElementById("loginForm");
const msg=(t,ok=false)=>{const e=document.getElementById("msg");if(e){e.textContent=t;e.style.color=ok?"#0b6b47":"#a22525"}};

if(signup) signup.addEventListener("submit",async e=>{
 e.preventDefault();
 const fd=new FormData(signup);
 const full_name=String(fd.get("full_name")||"").trim();
 const phone=String(fd.get("phone")||"").trim();
 const email=String(fd.get("email")||"").trim();
 const password=String(fd.get("password")||"");
 const plan_days=Number(fd.get("plan_days")||7);
 if(password.length<6){msg("Password-ku ugu yaraan 6 xaraf ha noqdo.");return}
 const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name,phone,plan_days}}});
 if(error){msg(error.message);return}
 if(data.session){
   location.href="dashboard.html";
 }else{
   msg("Akoonka waa la sameeyay. Haddii email confirmation uu ON yahay, xaqiiji email-kaaga kadibna gal.",true);
 }
});

if(login) login.addEventListener("submit",async e=>{
 e.preventDefault();
 const fd=new FormData(login);
 const {error}=await supabase.auth.signInWithPassword({email:fd.get("email"),password:fd.get("password")});
 if(error){msg("Email ama password-ka ayaa khaldan.");return}
 location.href="dashboard.html";
});
})();