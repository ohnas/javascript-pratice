chrome.runtime.onMessage.addListener(
    function (request) {
        texts = request.notiTexts;
        console.log('onmessage', texts);
        times = request.alarmTimes;
        console.log('onmessage', times);
        if(texts.length !== 0 && times.length !== 0) {
            times.forEach((time, index) => {
                chrome.alarms.create(`testAlarm_${index}`, {
                    when: Date.now() + time
                });
                chrome.alarms.onAlarm.addListener(
                    () => {
                        const randomIndex = Math.floor(Math.random() * texts.length);
                        const randomElement = texts[randomIndex];
                        chrome.notifications.create(
                            {
                                type: "basic",
                                iconUrl: "hello_extensions.png",
                                title: "Hello",
                                message: randomElement,
                                silent: false
                            },
                            () => {console.log("알림 전송 되었습니다.");}
                        )
                    }
                )
            });
        }
    }
);
