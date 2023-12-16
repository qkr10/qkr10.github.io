const href = window.location.href;
const currentURL = href.substring(0, href.lastIndexOf("/")) + "/viewall.html";
const fetchURL = href.substring(0, href.lastIndexOf("/")) + "/vocabulary.csv";
let viewMode = "all";

/*
 * 단어, "뜻" -> {index:줄수, word:단어, meaning:뜻}
 */
function line2tuple(line, index) {
    const values = line.split(",");

    return {
        index: index + 1,
        word: values[0].trim(),
        meaning: values[1].trim()
    }
}

/*
 * <div id="wordDiv줄수">
 *   <div class="number">줄수</div>
 *   <div class="word">단어</div>
 *   <div class="meaning">뜻</div>
 * </div>
 */
function tuple2wordDiv(tuple) {
    const resultDiv = document.createElement("div");
    resultDiv.id = "wordDiv" + tuple.index;

    const numberDiv = document.createElement("div");
    numberDiv.classList.add("number");
    numberDiv.innerText = tuple.index;
    resultDiv.appendChild(numberDiv);

    const wordDiv = document.createElement("div");
    wordDiv.classList.add("word");
    wordDiv.innerText = tuple.word;
    resultDiv.appendChild(wordDiv);

    const meaningDiv = document.createElement("div");
    meaningDiv.classList.add("meaning");
    meaningDiv.innerText = tuple.meaning;
    resultDiv.appendChild(meaningDiv);

    return resultDiv;
}

/*
 * <div id="wordDiv줄수">
 *   <div class="number">줄수</div>
 *   <div class="word" onclick="javascript:alert('뜻or단어');">단어or뜻</div>
 * </div>
 */
function tuple2wordDivByViewMode(tuple) {
    const resultDiv = document.createElement("div");
    resultDiv.id = "wordDiv" + tuple.index;

    const numberDiv = document.createElement("div");
    numberDiv.classList.add("number");
    numberDiv.innerText = tuple.index;
    resultDiv.appendChild(numberDiv);

    let content = tuple.word, alertMsg = tuple.meaning;
    if (viewMode == 'meanings') {
        content = tuple.meaning; alertMsg = tuple.word;
    }

    const wordDiv = document.createElement("div");
    wordDiv.classList.add("word");
    wordDiv.innerText = content;
    wordDiv.onclick = () => { alert(alertMsg) };
    resultDiv.appendChild(wordDiv);

    return resultDiv;
}

/*
 * <div id="wordsDiv">
 *   wordDiv1 wordDiv2 ...
 * </div>
 */
function printTuples(tuples) {
    const wordsDiv = document.createElement("div");
    wordsDiv.id = "wordsDiv";

    let getWordDiv = viewMode == 'all' ? tuple2wordDiv : tuple2wordDivByViewMode;

    for (let i = 0; i < tuples.length; i++) {
        let wordDiv = getWordDiv(tuples[i]);
        wordsDiv.appendChild(wordDiv);
    }

    const oldWordsDiv = document.getElementById(wordsDiv);
    if (oldWordsDiv != null) {
        oldWordsDiv.remove();
    }

    document.body.appendChild(wordsDiv);
}

window.onload = view;

function view() {
    if (href.lastIndexOf('viewMode=') != -1) {
        viewMode = href.match(/viewMode=([a-Z])+/g)[1];
    }

    function searchByUrl() {
        const searchIdIndex = href.lastIndexOf("#");
        if (searchIdIndex != -1) {
            const searchId = href.substring(searchIdIndex);
            window.location.href = currentURL + searchId;
        }
    }

    fetch(fetchURL)
        .then(response => response.text())
        .then(text => text.split("\n"))
        .then(lines => lines.map(line2tuple))
        .then(printTuples)
        .then(searchByUrl);
}

function search() {
    const lineNumber = document.searchForm.line.value;
    const lineNumberStr = "#wordDiv" + lineNumber;
    const viewModeStr = "?viewMode=" + viewMode;
    window.location.href = currentURL + viewModeStr + lineNumberStr;
}

function changeMode(modeNum) {
    viewMode = 'meanings';
    if (modeNum == 1) {
        viewMode = 'words';
    }
    const viewModeStr = "?viewMode=" + viewMode;
    window.location.href = currentURL + viewModeStr;
}