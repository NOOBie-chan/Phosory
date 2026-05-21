import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";

emailjs.init("hzYpGwbtgq7-kUZMg");

function showToast(message){

let toast=document.createElement("div");

toast.innerText=message;

Object.assign(toast.style,{
position:"fixed",
top:"30px",
right:"30px",
background:"#111827",
color:"#fff",
padding:"18px 22px",
borderRadius:"16px",
zIndex:"999999",
border:"1px solid rgba(255,255,255,0.1)",
boxShadow:"0 10px 40px rgba(0,0,0,0.4)"
});

document.body.appendChild(toast);

setTimeout(()=>{
toast.remove();
},3000);

}

function showSuccessAnimation(){

const overlay=document.createElement("div");

Object.assign(overlay.style,{
position:"fixed",
inset:"0",
background:"rgba(0,0,0,0.7)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:"999999"
});

overlay.innerHTML=`
<div style="
width:130px;
height:130px;
border-radius:50%;
background:linear-gradient(
135deg,
#00ffff,
#6c63ff
);
display:flex;
justify-content:center;
align-items:center;
">
<i class="fas fa-check"
style="
font-size:3rem;
color:white;
"></i>
</div>
`;

document.body.appendChild(
overlay
);

setTimeout(()=>{
overlay.remove();
},1600);

}

async function uploadToCloudinary(file){

const cloudName="du19nhphj";

const uploadPreset="Phosory";

const formData=new FormData();

formData.append(
"file",
file
);

formData.append(
"upload_preset",
uploadPreset
);

formData.append(
"resource_type",
"raw"
);

const res=await fetch(
`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
{
method:"POST",
body:formData
}
);

const data=await res.json();

const fileUrl=
data.secure_url ||
data.url;

if(!fileUrl){

throw new Error(
"Upload failed"
);

}

return fileUrl;

}

async function verifyTurnstile(token){

const verify=
await fetch(
"/.netlify/functions/verify-turnstile",
{
method:"POST",
headers:{
"Content-Type":
"application/json"
},
body:JSON.stringify({
token
})
}
);

return await verify.json();

}


document.addEventListener(
"DOMContentLoaded",
()=>{

const clientForm=
document.getElementById(
"clientForm"
);

const devForm=
document.getElementById(
"devForm"
);




// CLIENT FORM

if(clientForm){

let submitting=false;

const button=
clientForm.querySelector(
".submit-btn"
);

clientForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

if(submitting)
return;

submitting=true;

const original=
button.innerHTML;

button.innerHTML=
"Sending...";

button.disabled=true;

try{

const token=
turnstile.getResponse(
document.getElementById(
"clientTurnstile"
)
);

if(!token){

showToast(
"Complete captcha"
);

throw new Error(
"No captcha"
);

}

const result=
await verifyTurnstile(
token
);

if(!result.success){

showToast(
"Captcha failed"
);

throw new Error(
"Invalid captcha"
);

}

const data=
Object.fromEntries(
new FormData(
clientForm
)
);

await emailjs.send(
"service_8sgugr4",
"template_3g1hxrs",
data
);

showSuccessAnimation();

clientForm.reset();

button.innerHTML=
"Sent ✓";

turnstile.reset(
document.getElementById(
"clientTurnstile"
)
);

}

catch(err){

console.error(err);

button.innerHTML=
"Failed ✕";

showToast(
"Failed to send"
);

}

setTimeout(()=>{

button.innerHTML=
original;

button.disabled=false;

submitting=false;

},2000);

});

}




// DEV FORM

if(devForm){

let submitting=false;

const button=
devForm.querySelector(
".submit-btn"
);

devForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

if(submitting)
return;

submitting=true;

const original=
button.innerHTML;

button.innerHTML=
"Preparing...";

button.disabled=true;

try{

const token=
turnstile.getResponse(
document.getElementById(
"devTurnstile"
)
);

if(!token){

showToast(
"Complete captcha"
);

throw new Error(
"No captcha"
);

}

const result=
await verifyTurnstile(
token
);

if(!result.success){

showToast(
"Captcha failed"
);

throw new Error(
"Invalid captcha"
);

}

const file=
document.getElementById(
"resumeInput"
).files[0];

if(!file){

showToast(
"Upload resume"
);

throw new Error(
"No file"
);

}

button.innerHTML=
"Uploading...";

const link=
await uploadToCloudinary(
file
);

document.getElementById(
"resumeLink"
).value=link;

const data=
Object.fromEntries(
new FormData(
devForm
)
);

button.innerHTML=
"Sending...";

await emailjs.send(
"service_8sgugr4",
"template_nf0gf2k",
data
);

showSuccessAnimation();

devForm.reset();

button.innerHTML=
"Sent ✓";

turnstile.reset(
document.getElementById(
"devTurnstile"
)
);

}

catch(err){

console.error(err);

button.innerHTML=
"Failed ✕";

showToast(
"Application failed"
);

}

setTimeout(()=>{

button.innerHTML=
original;

button.disabled=false;

submitting=false;

},2000);

});

}

});