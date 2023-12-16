const href = window.location.href;
const currentURL = href.substring(0, href.lastIndexOf("/")) + "/viewall.html";
const fetchURL = href.substring(0, href.lastIndexOf("/")) + "/vocabulary.csv";
const isModeInURL = href.lastIndexOf('mode=') != -1;
const mode = isModeInURL ? href.match(/mode=([a-zA-Z]+)/)[1] : 'all';
const isLineInURL = /#wordDiv[0-9]+/.test(href);
const lineStr = isLineInURL ? href.match(/#wordDiv[0-9]+/)[0] : -1;
window.onload = onLoad;

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
 *   <div class="word" onclick="javascript:alert('뜻or단어');">단어or뜻</div>
 * </div>
 * 
 * or
 * 
 * <div id="wordDiv줄수">
 *   <div class="number">줄수</div>
 *   <div class="word">단어</div>
 *   <div class="meaning">뜻</div>
 * </div>
 */
function getWordDiv(tuple) {
    const resultDiv = document.createElement("div");
    resultDiv.id = "wordDiv" + tuple.index;

    const numberDiv = document.createElement("div");
    numberDiv.classList.add("number");
    numberDiv.innerText = tuple.index;
    resultDiv.appendChild(numberDiv);

    if (mode == 'all') {
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

    let content = tuple.word, alertMsg = tuple.meaning;
    if (mode == 'meanings') {
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

    for (let i = 0; i < tuples.length; i++) {
        let wordDiv = getWordDiv(tuples[i], mode);
        wordsDiv.appendChild(wordDiv);
    }

    const oldWordsDiv = document.getElementById(wordsDiv);
    if (oldWordsDiv != null) {
        oldWordsDiv.remove();
    }

    document.body.appendChild(wordsDiv);
}

function onLoad() {
    document.getElementById("searchLine").onkeydown = (e) => {
        if (e.key == "Enter") e.preventDefault();
    }

    function searchByUrl() {
        if (isLineInURL) {
            document.querySelector(lineStr).scrollIntoView();
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
    const line = document.searchForm.line.value;
    if (line) {
        const lineStr = "#wordDiv" + line;
        document.querySelector(lineStr).scrollIntoView();
    }
    else {
        window.location.href = currentURL;
    }
}

function changeMode(modeNum) {
    const modeStr = "?mode=" + ['all', 'words', 'meanings'][modeNum];
    if (!isLineInURL) {
        window.location.href = currentURL + modeStr;
        return;
    }

    window.location.href = currentURL + modeStr + lineStr;
}