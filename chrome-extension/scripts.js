function saveText(text, key, listId) {
    // 현재 저장된 문장들을 가져옴
    const texts = JSON.parse(localStorage.getItem(key) || '[]');
    texts.push(text);
    localStorage.setItem(key, JSON.stringify(texts));

    // 리스트에 추가
    displayText(text, key,listId);
}

function loadTexts(key, listId) {
    const texts = JSON.parse(localStorage.getItem(key) || '[]');
    texts.forEach(text => {
        displayText(text, key, listId);
    });
}

function displayText(text, key, listId) {
    const list = document.getElementById(listId);
    const div = document.createElement('div');
    const li = document.createElement('li');
    const btn = document.createElement('button');
    div.classList.add('textBox');
    li.textContent = text;
    btn.textContent = '❌';
    btn.classList.add('deleteBtn');
    div.appendChild(li);
    div.appendChild(btn);
    list.appendChild(div);

    btn.onclick = function() {
        // 로컬 스토리지에서 값 삭제
        const texts = JSON.parse(localStorage.getItem(key)) || [];
        const newTexts = texts.filter(t => t !== text);
        localStorage.setItem(key, JSON.stringify(newTexts));

        // div 요소 삭제
        div.remove();
    };
}

function handleNotification() {
    const texts = JSON.parse(localStorage.getItem("texts") || '[]');
    const times = JSON.parse(localStorage.getItem("texts2") || '[]');
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const filtedDays = times.filter((item) => item.includes(dayOfWeek))
    const extractTimes = filtedDays.map((item) => item.slice(-5));
    let filtedTimes = [];
    extractTimes.forEach((item) => {
        const userScheduledTime = new Date();
        userScheduledTime.setHours(Number(item.slice(0, 2)), Number(item.slice(-2)), 0, 0);
        if(userScheduledTime > today) {
            let timeDiff = userScheduledTime - today;
            filtedTimes.push(timeDiff);
        }
    });
    const sortedTimes = filtedTimes.sort((a, b) => a - b);
    console.log(sortedTimes);
    console.log(Notification.permission);

    for (let time of sortedTimes) {
        setTimeout(function() {
            if(Notification.permission === "granted") {
                const notification = new Notification(texts[0]);
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission(function (permission) {
                    if (permission === "granted") {
                        const notification = new Notification(texts[0]);
                    }
                });
            }
        }, time);
    }
}

document.getElementById('saveButton1').addEventListener('click', () => {
    const inputSentence = document.getElementById('inputSentence');
    const text = inputSentence.value.trim();
    if (text) {
        saveText(text, 'texts', 'savedTextList');
        inputSentence.value = '';  // 입력창 초기화
    }
});

document.getElementById('saveButton2').addEventListener('click', () => {
    const dayPicker = document.getElementById('dayPicker');
    const timePicker = document.getElementById('timePicker');
    const days = Array.from(dayPicker.querySelectorAll('input:checked'))
                      .map(input => input.nextElementSibling.textContent);
    const time = timePicker.value.trim();
    if (days.length && time) {
        const text = `${days.join(', ')} ${time}`;
        saveText(text, 'texts2', 'savedTextList2');
    }
});

document.getElementById('nextButton1').addEventListener('click', () => {
    document.getElementById('page1').style.display = 'none';
    document.getElementById('page2').style.display = 'block';
});

document.getElementById('nextButton2').addEventListener('click', () => {
    document.getElementById('page1').style.display = 'block';
    document.getElementById('page2').style.display = 'none';
});

// 페이지 로드 시 저장된 문장들을 가져와 리스트에 추가
window.addEventListener('load', () => {
    loadTexts('texts', 'savedTextList');
    loadTexts('texts2', 'savedTextList2');
    handleNotification();
});

