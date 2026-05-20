

document.getElementById("showBottomBtn1")
?.addEventListener("click",showBottom1);

document.getElementById("showBottomBtn2")
?.addEventListener("click",showBottom2);

document.getElementById("showBottomBtn3")
?.addEventListener("click",showBottom3);

document.getElementById("showBottomBtn4")
?.addEventListener("click",showBottom4);

document.getElementById("showBottomBtn5")
?.addEventListener("click",showBottom5);

document.getElementById("showBottomBtn6")
?.addEventListener("click",showBottom6);

document.getElementById("showBottomBtn7")
?.addEventListener("click",showBottom7);

document.getElementById("showBottomBtn8")
?.addEventListener("click",showBottom8);

function showBottom1(){
    document.getElementById("b1").classList.toggle("show");
    document.getElementById("t1").classList.toggle("rotate");
}

function showBottom2(){
    document.getElementById("b2").classList.toggle("show");
    document.getElementById("t2").classList.toggle("rotate");
}

function showBottom3(){
    document.getElementById("b3").classList.toggle("show");
    document.getElementById("t3").classList.toggle("rotate");
}

function showBottom4(){
    document.getElementById("b4").classList.toggle("show");
    document.getElementById("t4").classList.toggle("rotate");
}

function showBottom5(){
    document.getElementById("b5").classList.toggle("show");
    document.getElementById("t5").classList.toggle("rotate");
}

function showBottom6(){
    document.getElementById("b6").classList.toggle("show");
    document.getElementById("t6").classList.toggle("rotate");
}

function showBottom7(){
    document.getElementById("b7").classList.toggle("show");
    document.getElementById("t7").classList.toggle("rotate");
}

function showBottom8(){
    document.getElementById("b8").classList.toggle("show");
    document.getElementById("t8").classList.toggle("rotate");
}



document.querySelectorAll(".nav-link").forEach(link=>{
    link.addEventListener("click",()=>{
        window.location.href = link.dataset.page;
    });
});

function showSidebar(){

const sidebar =
document.querySelector('.sidebar');

const bars =
document.querySelector('.fa-bars');

sidebar.style.transform='translateX(0)';
sidebar.style.display='block';

bars.style.display='none';

}

function hideSidebar(){

const sidebar =
document.querySelector('.sidebar');

const bars =
document.querySelector('.fa-bars');

sidebar.style.transform='translateX(400px)';
sidebar.style.display='none';

bars.style.display='block';

}

document
.getElementById("openSidebarBtn")
?.addEventListener("click",showSidebar);

document
.getElementById("downloadTalentBtn")
?.addEventListener(
"click",
downloadDev
);

document
.getElementById("downloadClientBtn")
?.addEventListener(
"click",
downloadClient
);

document
.getElementById("closeSidebarBtn")
?.addEventListener("click",hideSidebar);

function downloadDev(){

const dev =
document.createElement('a');

dev.href='files/Phosory_Profile.pdf';

dev.download='Phosory-Talent.pdf';

dev.click();

}

function downloadClient(){

const client =
document.createElement('a');

client.href='files/Phosory_Profile.pdf';

client.download='Phosory-Client.pdf';

client.click();

}