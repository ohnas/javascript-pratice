const inputSentence = document.getElementById("inputSentence");
const saveButton = document.getElementById("saveButton");
const savedTextList = document.getElementById("savedTextList");
const clearBtn = document.getElementById("clearBtn");

// 페이지 로드 시 저장된 문장 목록을 로드
loadSavedTexts();

function saveText(text) {
    // 현재 저장된 문장들을 가져옴
    let texts = JSON.parse(localStorage.getItem('texts') || '[]');
    texts.push(text);
    localStorage.setItem('texts', JSON.stringify(texts));
}

function loadSavedTexts() {
    let texts = JSON.parse(localStorage.getItem('texts') || '[]');
    texts.forEach(text => {
        displayText(text);
    });
}

function deleteText(event) {
    const curretTextBox = event.target.parentElement;
    curretTextBox.remove();
}

function displayText(text) {
    const div = document.createElement("div");
    const li = document.createElement("li");
    const btn = document.createElement("button");
    div.classList.add("textBox");
    li.textContent = text;
    btn.textContent = "❌";
    btn.classList.add("deleteBtn");
    btn.addEventListener("click", deleteText);
    div.appendChild(li);
    div.appendChild(btn);
    savedTextList.appendChild(div);
}
function clearLocalStorage() {
    localStorage.clear();
}
  
clearBtn.addEventListener("click", clearLocalStorage);
saveButton.addEventListener("click", function() {
    const text = inputSentence.value;
    if (text) {
        saveText(text);
        displayText(text);
        inputSentence.value = "";
    }
});
