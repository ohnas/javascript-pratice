chrome.runtime.onMessage.addListener(
    function(request) {
        const texts = request.notiTexts;
        const times = request.alarmTimes;
        console.log('onmessage', texts);
        console.log('onmessage', times);
        createAlarm(times, texts);
    }
);

chrome.alarms.onAlarm.addListener(
    function(alarm) {
        chrome.notifications.create(
            {
                type: "basic",
                iconUrl: "hello_extensions.png",
                title: "Hello",
                message: alarm.name,
                silent: false
            },
            () => { console.log("알림 전송 되었습니다."); }
        );
    }
);

function createAlarm(times, texts) {
    if (texts.length !== 0 && times.length !== 0) {
        times.forEach((time) => {
            let randomIndex = Math.floor(Math.random() * texts.length);
            let randomElement = texts[randomIndex];
            chrome.alarms.create(`${randomElement}`, {
                when: Date.now() + time
            });
        });
    }
}
