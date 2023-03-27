const href = window.location.href;
const currentURL = href.substring(0, href.lastIndexOf("/")) + "/game.html";
const fetchURL = href.substring(0, href.lastIndexOf("/")) + "/vocabulary.csv";
const viewallURL = href.substring(0, href.lastIndexOf("/")) + "/viewall.html";

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
 * 
    <div id="question"></div>
    <div id="answer"></div>
    <div id="correct-answer"></div>
    <div id="word-num"></div>
    <div id="score"></div>
 * 
 */
function clearBoard() {
    const divLists = [
        "question",
        "answer",
        "correct-answer",
        "word-num",
        "score"
    ];

    divLists.forEach(divId => {
        document.getElementById(divId).replaceChildren();
    });
}

/*
 * 
    ({question: "", correctAnswer: "", num: 0}, answer)
        => {question: "", correctAnswer: "", num: 0, eng2kor: false, score: 0, answer: ""}
 * 
 */
function makeHistory(question, answer) {
    const korRegex = /[가-힣\s]+/;
    const eng2kor = !korRegex.test(question.question);

    let score = (question.correctAnswer == answer ? 1 : 0);
    if (eng2kor) {
        const meaningRegex = /[가-힣\s]+/g;
        const meanings = question.correctAnswer.match(meaningRegex).map(str => str.trim());
        if (meanings.includes(answer)) {
            score = 1;
        }
    }

    question.eng2kor = eng2kor;
    question.score = score;
    question.answer = answer;
    return question;
}

/*
 * 
    <div id="score">
        div#score-sum
        div#history인덱스
            div.num div.question div.correctAnswer div.answer
    </div>
 * 
 */
function printScore(histories) {
    const scoreDiv = document.getElementById("score");

    const scoreSum = histories.reduce((prev, cur) => prev + cur.score, 0);
    const scoreSumDiv = document.createElement('div');
    scoreSumDiv.id = "score-sum";
    scoreSumDiv.innerHTML = `푼 문제 : ${histories.length}개<br/>점수 : ${scoreSum}`;
    scoreDiv.appendChild(scoreSumDiv);

    histories.reverse().forEach((history, index) => {
        const historyDiv = document.createElement("div");
        historyDiv.id = "history" + index;

        const historyContexts = [
            { class: `num`, html: `<br/>단어 번호 : ${history.num} <a href="${viewallURL + '#wordDiv' + history.num}">단어장에서 보기</a>` },
            { class: `question`, html: `문제 : ${history.question}` },
            { class: `correctAnswer`, html: `정답 : ${history.correctAnswer}` },
            { class: `answer`, html: `입력한 답 : ${history.answer}` }
        ];
        if (history.score == 0) {
            historyContexts[3].html = `<del>${historyContexts[3].html}</del>`;
        }

        historyContexts.forEach(context => {
            const div = document.createElement("div");
            div.className = context.class;
            div.innerHTML = `${context.html}`;
            historyDiv.appendChild(div);
        });

        scoreDiv.appendChild(historyDiv);
    });
}

/*
 * 
    (histories, words) => {question: "", correctAnswer: "", num: 0}
 * 
 */
function getQuestion(histories, words) {
    const wordsCount = words.length;
    const historiesCount = histories.length;
    const questionsCount = wordsCount * 2;
    const remainQuestionsCount = questionsCount - historiesCount;
    if (remainQuestionsCount == 0) {
        return { question: "", correctAnswer: "", num: 0 };
    }

    let randomIndex = Math.floor(Math.random() * remainQuestionsCount);

    let i;
    for (i = 0; i < questionsCount; i++) {
        const word = words[parseInt(i / 2)];
        const isEng2Kor = i % 2;

        let j;
        for (j = 0; j < historiesCount; j++) {
            const history = histories[j];
            if (word.index == history.num)
                if (isEng2Kor == history.eng2kor) {
                    break;
                }
        }
        if (j == historiesCount) {
            if (randomIndex == 0) {
                return {
                    question: isEng2Kor ? word.word : word.meaning,
                    correctAnswer: !isEng2Kor ? word.word : word.meaning,
                    num: word.index
                };
            }
            randomIndex--;
        }
    }

    return { question: "", correctAnswer: "", num: 0 };
}

/*
 * 
    <div id="question"> word </div>
    <div id="answer"> form>input#answer-input[type=text] </div>
 * 
 */
function printQuestion(question) {
    document.getElementById("question").textContent = question;

    const answerInput = document.createElement("input");
    answerInput.id = "answer-input";
    answerInput.type = "text";
    answerInput.onsubmit = onSubmit;

    const formEle = document.createElement("form");
    formEle.onsubmit = e => {
        e.preventDefault();
        onSubmit();
    };
    formEle.appendChild(answerInput);
    document.getElementById("answer").appendChild(formEle);

    document.getElementById("answer-input").focus();
}

let gameStatus = {};
function getStatus() {
    gameStatus.answer = document.getElementById("answer-input").value;
    return gameStatus;
}
function setStatus(status) { gameStatus = status; }

function onSubmit() {
    const status = getStatus(); //{histories: [], tuples: [], question: {}, answer: ""}
    clearBoard();

    if (status.answer != "") {
        const history = makeHistory(status.question, status.answer);
        status.histories.push(history);
        printScore(status.histories);
    }

    status.question = getQuestion(status.histories, status.tuples);
    if (status.question.question == "") {
        document.getElementById("question").innerHTML =
            `더이상 풀 문제가 없습니다. <a href='${currentURL}'> 처음부터 다시하기 </a>`
        return;
    }
    printQuestion(status.question.question);

    setStatus(status);
}

function onLoad() {
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

    function tuples2status(tuples) {
        return {
            histories: [],
            tuples: tuples,
            question: {},
            answer: ""
        };
    }

    fetch(fetchURL)
        .then(response => response.text())
        .then(text => text.split("\n"))
        .then(lines => lines.map(line2tuple))
        .then(tuples => tuples2status(tuples))
        .then(status => setStatus(status))
        .then(onSubmit);
}

window.onload = onLoad;

function printCorrectNums() {
    const histories = getStatus().histories;
    const result = histories.reduce((prev, cur) => {
        if (cur.score == 1) {
            if (prev != "") prev += ",";
            return prev + cur.num;
        }
        else {
            return prev;
        }
    }, "");
    document.getElementById("nums").textContent = result;
}

function printWrongNums() {
    const histories = getStatus().histories;
    const result = histories.reduce((prev, cur) => {
        if (cur.score == 0) {
            if (prev != "") prev += ",";
            return prev + cur.num;
        }
        else {
            return prev;
        }
    }, "");
    document.getElementById("nums").textContent = result;
}

function excludeNums() {
    const nums = document.getElementById("nums").textContent.split(",").map(i => parseInt(i));
    const status = getStatus();
    const tuples = [];
    status.tuples.forEach(tuple => {
        if (!nums.includes(tuple.index)) {
            tuples.push(tuple);
        }
    });
    status.tuples = tuples;
    setStatus(status);
}