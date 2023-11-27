const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");

//api를 호출하고 응답을 받으면 각자 선언된 콜백 함수를 호출한다. 

function saveText(text, key, listId) {
    chrome.storage.local.get([key], function(result) {
        let texts;
        if (result[key]) {
            texts = result[key];
        } else {
            texts = [];
        }
        texts.push(text);
        const saveObject = {};
        saveObject[key] = texts;
        chrome.storage.local.set(saveObject, function() {
            displayText(text, key, listId);
        });
    });
}

function loadTexts(key, listId) {
    chrome.storage.local.get([key], function(result) {
        let texts;
        if (result[key]) {
            texts = result[key];
        } else {
            texts = [];
        }
        texts.forEach(function(text) {
            displayText(text, key, listId);
        });
    });
}

function createListItem(text) {
    const div = document.createElement('div');
    div.classList.add('textBox');

    const li = document.createElement('li');
    li.textContent = text;

    const deleteButton = createDeleteButton();
    div.appendChild(li);
    div.appendChild(deleteButton);

    return div;
}

function createDeleteButton() {
    const button = document.createElement('button');
    button.textContent = '❌';
    button.classList.add('deleteBtn');
    return button;
}

function addDeleteEventHandler(button, key, text, div) {
    button.onclick = function() {
        chrome.storage.local.get([key], function(result) {
            const texts = result[key] ? result[key] : [];
            const updatedTexts = texts.filter(t => t !== text);
            const saveObject = {[key]: updatedTexts};
            chrome.storage.local.set(saveObject, function() {
                div.remove();
            });
        });
    };
}

function displayText(text, key, listId) {
    const listElement = document.getElementById(listId);
    const listItem = createListItem(text);
    const deleteButton = listItem.querySelector('.deleteBtn');

    addDeleteEventHandler(deleteButton, key, text, listItem);
    listElement.appendChild(listItem);
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

startBtn.addEventListener("click", () => {
    chrome.storage.local.get(["texts", "texts2"], function(result) {
        let texts, times;
        if (result["texts"]) {
            texts = result["texts"];
        } else {
            texts = [];
        }
        if (result["texts2"]) {
            times = result["texts2"];
        } else {
            times = [];
        }
        
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
        chrome.runtime.sendMessage({ 
            notiTexts : texts,
            alarmTimes : sortedTimes
        });
    });
});

stopBtn.addEventListener("click", () => {
    chrome.alarms.clearAll();
});

// 페이지 로드 시 저장된 문장들을 가져와 리스트에 추가
window.addEventListener('load', () => {
    loadTexts('texts', 'savedTextList');
    loadTexts('texts2', 'savedTextList2');
});

