var quizContainer = document.getElementsByClassName('quizcontainer')[0];
var startbutton = document.getElementById('startButton');
var nextbutton = document.getElementById('next');
var tryButton = document.getElementById('try');
var dashboard = document.getElementsByClassName('dashboard')[0];
let questionList =  document.getElementById('questionList');
let OptionsList =  document.getElementById('OptionsList')
var timerbutton = document.getElementById('timer');
let result = document.getElementById('result');

let currentIndex = 0;
let questionsListArray = [];
let score = 0;
let wrongAttempt =0;
let timer = 30;
let setIntervalId;

quizContainer.style.display = 'none';
tryButton.style.display = 'none';


/* 
this methiod will callwhenver u will click on start button
*/
startbutton.addEventListener('click', function(e){

    dashboard.style.display = 'none';
    quizContainer.style.display = 'block';
    quizContainer.style.width = 820+ 'px';
    quizContainer.style.textAlign = 'center';
    OptionsList.style.display = 'grid';
    nextbutton.innerText = "next";
    tryButton.style.display = "none"
    nextbutton.style.display = 'block';
    timerbutton.style.display ='block';
    timerbutton.style.width = 0 + 'px';
    result.innerHTML ='';
    currentIndex = 0;
    questionsListArray = [];
    score = 0;
    timer = 30;
    clearInterval(setIntervalId)

    getQuestionsList()
})


// get data from api question
async function getQuestionsList(){
    
    try {
        let questionsList = await fetch('https://mocki.io/v1/330d1d17-148e-483b-b3b1-b26a28d48878');
        var questionListData =  await questionsList.json();
        questionListData.questions.length = 2;
        questionsListArray.push( ...questionListData.questions);
        getQuestion()
   
    } catch(err){
        console.log(err);
    }
}


// get current question
function getQuestion(){
    const currentQuestionNode = questionsListArray[currentIndex];
    let currentQuestion = currentQuestionNode?.question;
    questionList.textContent = `Q ${ currentIndex+1} . ${currentQuestion}`;

    OptionsList.innerHTML ='';
    let correctAnswer = currentQuestionNode.answers[currentQuestionNode.correctIndex];
    currentQuestionNode.answers.forEach(data =>{
        console.log("data",data)
        var div = document.createElement('div');
        div.innerHTML = data;
        div.style.cursor = 'pointer';
        div.classList = 'button';
        div.addEventListener('click',function(e){
            e.target.classList.toggle('selected');
            if(e.target.innerHTML == correctAnswer){
                score++
            } else {
                wrongAttempt++
            }

        })
        OptionsList.appendChild(div);
    })

        checkLastButton();
         startTimer()

}

function checkLastButton(){
    if(currentIndex == questionsListArray.length-1){
        nextbutton.innerText = "submit"
    }
}


nextbutton.addEventListener('click', function(e){
    if(currentIndex < questionsListArray.length-1){
        timerbutton.style.width = 0 + 'px';
        currentIndex++;
        getQuestion()
    } else if(currentIndex == questionsListArray.length-1){
            showResult()
    }
});


//resetting the states
tryButton.addEventListener('click', function(){
    currentIndex = 0;
    questionsListArray = [];
    score = 0;
    quizContainer.style.display = 'none';
   tryButton.style.display = 'none';
   dashboard.style.display = 'flex';
   wrongAttempt = 0;

})


function startTimer(){
    let perSecondWidth = parseInt(820/30);
    let progressbarWidth = 0;
    function progressBar(){
        console.log("timer",timer)
        if(timer>0){
            timer --;
            timerbutton.classList = 'progessbar';
            progressbarWidth += perSecondWidth;
            timerbutton.style.width = progressbarWidth + 'px';
        } else {
         clearInterval(setIntervalId);
         console.log("currentIndex",currentIndex)
         console.log("questionsListArray.length-1",questionsListArray.length-1)

         
         if(currentIndex < questionsListArray.length-1){
            console.log("hi");
            timer = 30;
            timerbutton.style.width = 0;
            currentIndex++;
            getQuestion();
        } else {
            showResult();
        }

        }
     
    }
    clearInterval(setIntervalId);
    setIntervalId = setInterval(progressBar,1000)
}



function calculatePercentage(){
  return eval(score/questionsListArray.length)*100

}

function getResult(){
    const div = `<div>
    <div class = ${calculatePercentage() > 33 ? 'success' :'failed'}> ${getStatus()}</div>
    <div class = ${calculatePercentage() > 33 ? 'success' :'failed'}>Your Percentage Score is  ${calculatePercentage()} %</div>
   <div class ="score"> your Number score is ${score} out of ${questionsListArray.length} </div>

    
         <div>
             <span>Total No of Question: </span>
             <span>${questionsListArray.length}</span>
         </div>
         <div>
         <span>No Of Correct Answer: </span>
         <span>${score}</span>
     </div>
     <div>
         <span>No Of Wrong Answer: </span>
         <span>${wrongAttempt}</span>
    </div>
    <div>
     <span>No Of question skkiped: </span>
     <span>${eval(questionsListArray.length - (score + wrongAttempt))}</span>
     </div>
     </div>`
    return div;
}


function getStatus(){
    let Percentage = calculatePercentage();
    if(Percentage < 33){
     return 'Sorry failed, You could have done it better';
    } else if(Percentage > 33 && Percentage <66){
        return " Congratulations ... Passed !!, but You can do better";
    } else if(Percentage > 66 && Percentage <75){
        return "Congratulations ...Passed !!, Well done";
    } else {
        return "Congratulations ...Passed !!, Great , You have Made it ";
    }

}


function showResult(){
    clearInterval(setIntervalId);
    questionList.textContent = '';
    result.innerHTML = getResult();
    OptionsList.style.display ='none'
    nextbutton.style.display = 'none'
    tryButton.style.display = 'block';
    timerbutton.style.display ='none';
}
