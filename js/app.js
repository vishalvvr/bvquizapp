
const questionNumber = document.querySelector(".question-number");
const questionText = document.querySelector(".question-text");
// const questionContiner = document.querySelector(".question-container");
const optionContainer = document.querySelector(".option-container");
const answersIndicatorContainer = document.querySelector(".answers-indicator");
const homeBox = document.querySelector('.home-box');
const quizBox = document.querySelector('.quiz-box');
const resultBox = document.querySelector('.result-box');

let questionCounter = 0;
let currentQuestion;
let availableQuestions=[];
let availableOptions=[];
let correctAnswers = 0;
let attempt = 0;

//push the questions into availableQuestions array
function setAvailableQuestions(){
    const totalQuestion = quiz.length;
    for(let i=0; i<totalQuestion;i++){
        availableQuestions.push(quiz[i])
    }
}

// set question number and question and option
function getNewQuestion(){
    // set question number
    questionNumber.innerHTML = "Question "+(questionCounter+1)+" of "+ quiz.length;

    //set question text
    // get random question
    const questionIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
    currentQuestion = questionIndex;
    questionText.innerHTML = currentQuestion.q;
    // get the position of "questionIndex" from the availableQuestions array
    const index1 = availableQuestions.indexOf(questionIndex);
    // remove the questionIndex from availableQuestion Array, so that question not repeate
    availableQuestions.splice(index1,1);
    
    // show Question img if 'img' property exist
    if(currentQuestion.hasOwnProperty('img')){
        const img = document.createElement('img');
        img.src = currentQuestion.img;
        questionText.appendChild(img);
    }

    // set options
    // get the length of options
    const optionLen = currentQuestion.options.length
    
    // push options into availableOptions array
    for(let i=0; i<optionLen; i++){
        availableOptions.push(i)
    }   
    
    let animationDelay = 0.15
    
    // delete/empty if any options are present inside 'optionContainer' from previous question 
    optionContainer.innerHTML = "";

    // create options in html
    for(let i=0; i<optionLen; i++){
        // random option
        const optionIndex = availableOptions[Math.floor(Math.random() * availableOptions.length)];
        // get the position of 'optionIndex' from the availableOptions
        const index2 = availableOptions.indexOf(optionIndex);
        // remove the 'optionIndex' from the availableOptions, so that the option does not repeat
        availableOptions.splice(index2,1);
        
        console.log(availableOptions);

        const option = document.createElement("div");
        // console.log(currentQuestion.options[i]);
        option.innerHTML = currentQuestion.options[optionIndex];
        option.id = optionIndex;
        option.style.animationDelay = animationDelay + 's';
        animationDelay = animationDelay + 0.15;
        option.className="option";
        optionContainer.appendChild(option);
        option.setAttribute('onclick','getResult(this)');
    }

    questionCounter++
}

// get result of current attempt question
function getResult(element){
    const id = parseInt(element.id);
    // get the answer by comparing the id of clicked option
    if(id === currentQuestion.answer){
        // set the green color to the correct option
        element.classList.add("correct");
        // add the indicator to correct mark
        updateAnswerIndicator('correct');
        correctAnswers++;

    }else{
        // set the red color to the wrong option
        element.classList.add("wrong");
        
        // add the indicator to wrong mark
        updateAnswerIndicator('wrong');

        // if the answer is incorrect then show the correct option by adding green color the correct option
        const optionLen = optionContainer.children.length;
        for(let i=0; i<optionLen;i++){
            if(parseInt(optionContainer.children[i].id) === currentQuestion.answer){
                optionContainer.children[i].classList.add("correct");
            }
        }  
    }
    attempt++;
    unclickableOptions();
}

// make all the options unclickable once the user select a option
// (RESTRICT USER FROM CHANGING OPTION)
function unclickableOptions(){
    const optionLen = optionContainer.children.length;
    for(let i=0; i<optionLen; i++){
        optionContainer.children[i].classList.add('already-answered');
    }
}

function answersIndicator(){
    answersIndicatorContainer.innerHTML = "";
    const totalQuestion = quiz.length;
    for(let i=0; i<totalQuestion; i++){
        const indicator = document.createElement('div');
        answersIndicatorContainer.appendChild(indicator)

    }
}

function updateAnswerIndicator(markType){
    answersIndicatorContainer.children[questionCounter-1].classList.add(markType);
}

function next(){
    if(questionCounter == quiz.length){
        console.log("quiz over");
        quizOver();
    }else{
        getNewQuestion();
    }
}

function quizOver(){
    // hide quiz box
    quizBox.classList.add('hide');
    // show results box
    resultBox.classList.remove('hide');
    quizResult();
}

// get the quiz result
function quizResult(){
    resultBox.querySelector(".total-question").innerHTML = quiz.length;
    resultBox.querySelector(".total-attempt").innerHTML = attempt;
    resultBox.querySelector(".total-correct").innerHTML = correctAnswers;
    resultBox.querySelector(".total-wrong").innerHTML = attempt - correctAnswers;
    const percentage = (correctAnswers/quiz.length)*100;
    resultBox.querySelector(".percentage").innerHTML = percentage.toFixed(2) + "%";
    resultBox.querySelector(".total-score").innerHTML = correctAnswers + " / " + quiz.length;
}

function resetQuiz(){
    questionCounter = 0;
    correctAnswers = 0;
    attempt = 0;
}

function tryAgainQuiz(){
    // hide the resultBox
    resultBox.classList.add("hide");
    // show quizBox
    quizBox.classList.remove("hide");
    resetQuiz();
    startQuiz();
}


function goToHome(){
    // hide the resultBox
    resultBox.classList.add("hide");
    // show homeBox
    homeBox.classList.remove("hide");
    resetQuiz();
}


function startQuiz(){
    
    // hide home box
    homeBox.classList.add("hide");
    // show quiz box
    quizBox.classList.remove("hide");

    // first we will set all questions in availableQuestion Array
    setAvailableQuestions();
    // second we will call getNewQuestion function
    getNewQuestion();
    // to create indicator of answer
    answersIndicator();
}

var quiz;

// upload quiz file from browse button and start quiz
document.getElementById("quizFileInput").addEventListener("change",function(){
    var fr=new FileReader();
    fr.onload=function(){
        quiz = JSON.parse(fr.result);
        startQuiz();
        // console.log(quiz);
    }         
    fr.readAsText(this.files[0]);
});

// window.onload = function(){
//     uploadQuizFile("/js/question.json");
//     // homeBox.querySelector(".total-question").innerHTML = quiz.length;
// }