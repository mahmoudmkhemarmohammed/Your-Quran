let iconPars = document.querySelector("header .container .pars i");
let list = document.querySelector("header .container ul");
let boxReciters = document.querySelector(".home .container .box #reciter");
let boxMoshaf = document.querySelector(".home .container .box #moshaf");
let boxSurah = document.querySelector(".home .container .box #surah");
let apiKey = "https://www.mp3quran.net/api/v3";
let language = "ar";
let soundControls = document.querySelector(".home .container .box .sound");
let close = document.querySelector("header .container .close");
iconPars.onclick = () => {
    list.classList.add("open")
    setTimeout(() => {
        close.classList.add("active")
    },500)
}
close.onclick = () => {
    list.classList.remove("open");
    close.classList.remove("active");
}
async function getReciter () {
    let reciter = '';
    await fetch(`${apiKey}/reciters?language=${language}`).then( result => result.json()).then( data => {
        data.reciters.forEach( res => {
            reciter += `
            <option value="${res.id}">${res.name}</option>
            `
        })
        boxReciters.innerHTML = reciter;
        boxReciters.addEventListener( "change" , function(e) {
            getMoshaf(e.target.value)
        })
    })
}
getReciter()
async function getMoshaf (mos) {
    let moshaf = '';
    fetch(`${apiKey}/reciters?language=${language}&reciter=${mos}`).then( result => result.json())
    .then( data => {
        data.reciters[0].moshaf.forEach( mos => {
            moshaf += `
                <option value="${mos.id}" data-surahlist="${mos.surah_list}" data-server="${mos.server}">${mos.name}</option>
            `
        })
        boxMoshaf.innerHTML = moshaf;
        boxMoshaf.onclick = () => {
            let selectedMoshaf = boxMoshaf[boxMoshaf.selectedIndex];
            let slist = selectedMoshaf.dataset.surahlist;
            let server = selectedMoshaf.dataset.server;
            getSurah(slist,server)
        }
    })
}
async function getSurah (slist , server) {
    let arrSlist = slist.split(",");
    let sura = '';
    await fetch(`${apiKey}/suwar`).then( result => result.json())
    .then( data => {
        arrSlist.forEach( e => {
            data.suwar.forEach( su => {
                if( su.id == e) {
                    sura+=`<option value="${su.id}">${su.name}</option>`
                }
            })
        })
        boxSurah.innerHTML = sura;
        boxSurah.onchange = (e) => {
            soundControls.innerHTML = `<audio controls src="${server}${e.target.value.length === 1? `00${e.target.value}`: e.target.value.length === 2? `0${e.target.value}`: e.target.value}.mp3"></audio>`
        }
    })
}
document.querySelectorAll(".video .container ul li").forEach( el => {
    el.onclick = function () {
        document.querySelectorAll(".video .container ul li").forEach( e => {
            e.classList.remove("active");
        })
        this.classList.add("active");
        playLive(this.dataset.chanal)
    }
})
function playLive (chanal) {
    if(Hls.isSupported()) {
        let video = document.querySelector("video");
        let hls = new Hls();
        hls.loadSource(`${chanal}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function () {
            video.play()
        })
    }
}
async function radio () {
    await fetch("https://mp3quran.net/api/v3/radios?language=ar").then( result => result.json())
    .then( data => {
        data.radios.splice(30)
        data.radios.forEach( ra => {
            let li = document.createElement("li");
            let textNode = document.createTextNode(ra.name);
            li.appendChild(textNode);
            document.querySelector(".radio .container ul").appendChild(li)
            li.dataset.radio = ra.url;
        })
        document.querySelectorAll(".radio .container ul li").forEach( el => {
            el.onclick = function () {
                document.querySelectorAll(".radio .container ul li").forEach( e => {
                    e.classList.remove("active");
                })
                this.classList.add("active");
                document.querySelector(".radio .container audio").src = this.dataset.radio;
            }
        })
    })
}
radio()
async function tafasir () {
    let tafasir = ''
    await fetch("https://www.mp3quran.net/api/v3/tafsir?tafsir=1&language=ar").then( result => result.json())
    .then( data => {
        document.querySelector(".tafasir .container h2").innerHTML = data.tafasir.name;
        data.tafasir.soar.forEach( sor => {
            tafasir += `
            <option value="${sor.url}">${sor.name}</option>
            `
        })
        document.querySelector(".tafasir .container select").innerHTML = tafasir;
        document.querySelector(".tafasir .container select").onchange = function (e) {
            document.querySelector(".tafasir .container audio").src = e.target.value;
        }
    })
}
tafasir()
window.onscroll = () => {
    if( scrollY > 800) {
        document.querySelector("#btn-scroller").style.display = 'block'
    }
    else {
        document.querySelector("#btn-scroller").style.display = 'none'
    }
}
document.querySelector("#btn-scroller").onclick = () => {
    scroll({
        top: 0,
        behavior: "smooth"
    })
}