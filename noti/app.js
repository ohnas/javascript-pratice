const notiBtn = document.getElementById("noti-button");
const saveButton = document.getElementById("saveButton");
const progressBar = document.getElementById("storage");

function notiInterval() {
    // 1초 간격으로 console.log
    let seconds = 1;
    let logTimer = setInterval(() => {
        console.log(`${seconds}초`);
        seconds++;
    }, 1000);

    // 5초 간격으로 메시지를 보여줌
    let notiTimer = setInterval(() => {
        const notification = new Notification("Hello world");
    }, 5000);

    // 20초 후에 정지
    setTimeout(() => {
        clearInterval(logTimer);
        clearInterval(notiTimer); 
        console.log("Stop noti"); 
    }, 20000);
}

function handleNotiBtn() {
    if(Notification.permission === "granted") {
        notiInterval();
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                notiInterval();
            }
        });
    }
}

function byteChecking() {
    // const totalByte = 5242880;
    const totalByte = 100;
    const texts = localStorage.getItem('texts')
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(texts);
    const percent = (uint8Array.byteLength / totalByte) * 100;
    console.log(`currentByte : ${uint8Array.byteLength} Byte // totalByte : ${totalByte.toLocaleString("ko-KR")} Byte`);
    console.log(`현재 사용량 : ${percent} %`)
    progressBar.setAttribute("max", totalByte); // To do list : 나중에는 체킹함수때마다 설정하는게 아니라 웹페이지 처음 로드 될때 상수값으로 설정해놓기
    progressBar.setAttribute("value", percent);
}

function saveText(text) {
    let texts = JSON.parse(localStorage.getItem('texts') || '[]');
    texts.push(text);
    localStorage.setItem('texts', JSON.stringify(texts));
}

notiBtn.addEventListener("click", handleNotiBtn);
saveButton.addEventListener("click", function() {
    const text = inputSentence.value;
    if (text) {
        saveText(text);
        byteChecking();
        inputSentence.value = "";
    }
});
