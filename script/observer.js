document.addEventListener("DOMContentLoaded",()=>{const fade=document.querySelectorAll(".fade-in");
    const fadeObserver=new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){entry.target.classList.add("show")}
            else{entry.target.classList.remove("show")}
        }
    )},
    {threshold:0.1});fade.forEach(item=>{fadeObserver.observe(item)})
})