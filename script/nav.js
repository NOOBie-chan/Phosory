window.addEventListener("scroll", function(){
let header = this.document.getElementById("header");
if(this.window.scrollY > 10){
    header.classList.add("scrolled");
}
else{
    header.classList.remove("scrolled");
}
});