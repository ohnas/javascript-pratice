function saveText(text, key, listId) {
    // 현재 저장된 문장들을 가져옴
    const texts = JSON.parse(localStorage.getItem(key) || '[]');
    texts.push(text);
    localStorage.setItem(key, JSON.stringify(texts));

    // 리스트에 추가
    displayText(text, listId);
}

function loadTexts(key, listId) {
    const texts = JSON.parse(localStorage.getItem(key) || '[]');
    texts.forEach(text => {
        displayText(text, listId);
    });
}

function displayText(text, listId) {
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
        const texts = JSON.parse(localStorage.getItem('texts')) || [];
        const newTexts = texts.filter(t => t !== text);
        localStorage.setItem('texts', JSON.stringify(newTexts));

        // div 요소 삭제
        div.remove();
    };
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
});

