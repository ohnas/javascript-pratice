const notiBtn = document.getElementById("noti-button");
const saveButton = document.getElementById("saveButton");
const progressBar = document.getElementById("storage");

function notiInterval() {
    // // 1초 간격으로 console.log
    // let seconds = 1;
    // let logTimer = setInterval(() => {
    //     console.log(`${seconds}초`);
    //     seconds++;
    // }, 1000);

    // // 5초 간격으로 메시지를 보여줌
    // let notiTimer = setInterval(() => {
    //     const notification = new Notification("Hello world");
    // }, 5000);

    // // 20초 후에 정지
    // setTimeout(() => {
    //     clearInterval(logTimer);
    //     clearInterval(notiTimer); 
    //     console.log("Stop noti"); 
    // }, 20000);

    // 사용자가 설정한 시간을 배열로 정의합니다.
    const scheduledTimes = [
        { hours: 15, minutes: 7 },
        { hours: 15, minutes: 8 },
    ];

    // 현재 시간을 얻습니다.
    const currentTime = new Date();
    console.log(currentTime);

    // 각 설정된 시간에 대해 알림을 예약합니다.
    for (const time of scheduledTimes) {
        const userScheduledTime = new Date();
        userScheduledTime.setHours(time.hours, time.minutes, 0, 0);
        console.log(userScheduledTime);

        // 설정한 시간과 현재 시간의 차이를 계산합니다.
        let timeDiff = userScheduledTime - currentTime;
        console.log(timeDiff);

        setTimeout(function() {
            const notification = new Notification("Hello world");
          }, timeDiff);      
    }
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
