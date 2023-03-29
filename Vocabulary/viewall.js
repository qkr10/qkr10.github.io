const href = window.location.href;
const currentURL = href.substring(0, href.lastIndexOf("/")) + "/viewall.html";
const fetchURL = href.substring(0, href.lastIndexOf("/")) + "/vocabulary.csv";

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
 * <div id="wordsDiv">
 *   wordDiv1 wordDiv2 ...
 * </div>
 */
function printTuples(tuples) {
    const wordsDiv = document.createElement("div");
    wordsDiv.id = "wordsDiv";

    for (let i = 0; i < tuples.length; i++) {
        const wordDiv = tuple2wordDiv(tuples[i]);
        wordsDiv.appendChild(wordDiv);
    }

    document.body.appendChild(wordsDiv);
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

function search() {
    const lineNumber = document.searchForm.line.value;
    window.location.href = currentURL + "#wordDiv" + lineNumber;
}

window.onload = function () {
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