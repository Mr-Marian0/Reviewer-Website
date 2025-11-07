
// BUTTON CLASSES AND ID
const CreateRevBtn = document.querySelector('.createRev_btn');
const ReviewBtn = document.querySelector('.review_btn');
const CloseInputRevBtn = document.querySelector('.closeInputRev_btn');
const ClipBtn = document.querySelector('.clip_btn');
const ClipArea = document.querySelector('.clip_area');
const TextInput = document.querySelector('.textInput');
const SaveBtn = document.querySelector(".save_btn");
const QuestionArea = document.querySelector('.question_area');
const NextQuestion = document.querySelector('.next_question');
const SkipQuestion = document.querySelector('.skip_question');

// REVIEW SECTION-
const StartReview = document.querySelector('.start_review');
const CloseStartReviewBtn = document.querySelector('.closeStartReview_btn');
const ProgressInfo = document.querySelector('.progress-info');
let shuffledQuestions = []
let currentQuestionIndex = 0;
let userAnswers = []; // Store user's answers with question info
let answeredQuestions = new Set(); // Track which questions have been answered

// const WordBtn = document.querySelector('word_btn');

const TextInputId = document.getElementById('createRev_Id');
const FaddingCreateBtns = document.querySelectorAll('.AllcreateRev_btns');

let selectedWords = [];
let experimentOnly = null;
let savePreviousPar;
let inputText // Used to store the paragraph/notes/sentences

buttonEventFunctions()


function processText(){
    const text = TextInput.value.trim();
    savePreviousPar = TextInput.value;

    if(!text) {
        ClipArea.innerHTML = '';
        selectedWords = null;
        return false;
    } else {
        const words = text.split(/\s+/).filter(word => word.length > 0);
        ClipArea.innerHTML = ''; //Clear clip area

        const paragraph = document.createElement('p');
        paragraph.className = 'clip_paragraph';

        words.forEach((word, index) => {
            const wordButton = document.createElement('button');

            wordButton.textContent = word;
            wordButton.className = 'word-btn';
            wordButton.dataset.originalWord = word;
            
            wordButton.addEventListener('click', function() {
                
                this.classList.add('selected');
                experimentOnly = this.dataset.originalWord;
                
                console.log('Selected word: ', experimentOnly);
            })
            paragraph.appendChild(wordButton);

            if (index < words.length - 1) {
                    paragraph.appendChild(document.createTextNode(' '));
                }
        })
        ClipArea.appendChild(paragraph);
        
        return true;
    }
}

function buttonEventFunctions(){
    CreateRevBtn.addEventListener('click', () => {
        TextInputId.style.display = 'flex';
        TextInputId.classList.toggle('inputRevFade');

        FaddingCreateBtns.forEach(button => {
            button.classList.toggle('clipButtonFade')
        })
    })

    ClipBtn.addEventListener('click', () => {

        ClipArea.innerHTML = ""
        inputText = TextInput.value;

        if(processText()){
            TextInput.classList.toggle('textInputToggleClose')
            ClipArea.classList.toggle('clipAreaToggle');

            ClipBtn.innerHTML = "Unclip"

            SaveBtn.style.opacity = '1'
            SaveBtn.style.height = '30px'
            SaveBtn.style.display = 'inline-block'

            // FOR UNDO PURPOSE----------------------
            if(ClipBtn.classList.contains('cliped')){

                TextInput.value = savePreviousPar;
                TextInput.classList.toggle('textInputToggle');
                
                ClipArea.classList.toggle('clipAreaToggleOff');
                if (ClipArea.classList.contains('clipAreaToggleOff')) ClipArea.classList.toggle('clipAreaToggleOff');
                ClipArea.removeChild(document.querySelector('.clip_paragraph'));
                ClipBtn.innerHTML = "Clip"

                SaveBtn.style.opacity = '0'
                SaveBtn.style.height = '0px'
                SaveBtn.style.display = 'none'

                selectedWords = []; //Used to reset or erase saved array words
                inputText = "";
            }

            
            ClipBtn.classList.toggle('cliped');
        } else {
            alert('Please put your note first.')
        }
        
    })

    CloseInputRevBtn.addEventListener('click', ()=>{
        ClipArea.innerHTML = ""
        TextInput.value = ""
        TextInputId.classList.toggle('inputRevFade');
        if(ClipBtn.classList.contains('cliped')) ClipBtn.classList.toggle('cliped');
        if(TextInput.classList.contains('textInputToggleClose')) TextInput.classList.toggle('textInputToggleClose');
        if(TextInput.classList.contains('clipAreaToggle')) ClipArea.classList.toggle('clipAreaToggle');
        if(ClipArea.classList.contains('clipAreaToggleOff')) ClipArea.classList.toggle('clipAreaToggleOff');
        if(ClipArea.classList.contains('clipAreaToggle')) ClipArea.classList.toggle('clipAreaToggle');

        ClipBtn.innerHTML = "Clip"
        SaveBtn.style.height = '0px'
        SaveBtn.style.display = 'none'
        SaveBtn.style.opacity = '0';

        selectedWords = []; //reset or erase saved array words
        inputText = "";

        FaddingCreateBtns.forEach(button => {
            button.classList.toggle('clipButtonFade')
        })

        setTimeout(()=>{
            TextInput.classList.toggle('textInputToggle');
        },500);
    })

    SaveBtn.addEventListener('click', () => {
        const SelectedWordBtn = document.querySelectorAll('.word-btn.selected');
        SelectedWordBtn.forEach(words => {
            selectedWords.push(words.textContent.trim());
        })

        let userInputData = {
            paragraph: inputText, 
            selectedW: selectedWords
        };
        
        saveNote(userInputData);

    })

    // -----------------------REVIEW SECTION-------------------------

    ReviewBtn.addEventListener('click', () => {

        StartReview.style.display = 'flex'
        QuestionArea.innerHTML = ""
        const ObjectData = getNotes();

        if (ObjectData.length === 0) {
            alert('No questions available. Please create some notes first.');
            return;
        }
        //Shuffle Questions - using Fisher-Yates Algo..
        shuffledQuestions = shuffleArray([...ObjectData]);
        currentQuestionIndex = 0;
        userAnswers = [];
        answeredQuestions = new Set();

        displayQuestion(currentQuestionIndex);
        StartReview.classList.toggle('startRevFade');

    })

    NextQuestion.addEventListener('click', () => {
        const inputs = document.querySelectorAll('.guessInput');
        let allFilled = true;
        const currentAnswers = []

        inputs.forEach(input => {
            if(input.value.trim() === ''){
                allFilled = false;
            } else {
                currentAnswers.push({
                    userAnswer: input.value.trim(),
                    correctAnswer: input.dataset.answer
                })
            }
        })

        if(!allFilled){
            alert("Please fill in all blanks before proceeding to the next question.");
            return;
        }

        //Save answers
        userAnswers.push({
            questionIndex: currentQuestionIndex,
            paragraph: shuffledQuestions[currentQuestionIndex].paragraph,
            answers: currentAnswers
        });

        //Used to mark as answered
        answeredQuestions.add(currentQuestionIndex);

        //Check if all questions are answered
        if(answeredQuestions.size === shuffledQuestions.length){
            showResults();
            return;
        }

        //Move to next unanswered question
        do{
            currentQuestionIndex = (currentQuestionIndex + 1) % shuffledQuestions.length;
        } while(answeredQuestions.has(currentQuestionIndex));

        displayQuestion(currentQuestionIndex);
    })

    SkipQuestion.addEventListener('click', () => {
        //Check if all questions are answered
        if(answeredQuestions.size === shuffledQuestions.length) {
            alert('All questions have been answred!');
            showResults();
            return;
        }

        //Move to next unanswered question
        let attempts = 0;
        do{
            currentQuestionIndex = (currentQuestionIndex + 1) % shuffledQuestions.length;
            attempts++;
            //Prevent infinite loop
            if(attempts > shuffledQuestions.length) break;
        } while (answeredQuestions.has(currentQuestionIndex));

        displayQuestion(currentQuestionIndex);
    })

    CloseStartReviewBtn.addEventListener('click', () => {
        StartReview.classList.toggle('startRevFade');
        StartReview.style.display = "none";
        setTimeout(() => {
            StartReview.style.display = "flex";
        }, 500);
    })
}

//(Fisher-Yates Algorithm)
function shuffleArray(array){
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Function to display a question
function displayQuestion(index) {
    QuestionArea.innerHTML = "";
    
    const currentQuestion = shuffledQuestions[index];
    
    // Create question paragraph
    const question = document.createElement('p');
    question.className = 'paragraphQuestion';
    question.textContent = currentQuestion.paragraph;
    QuestionArea.appendChild(question);
    
    const ParagraphQuestion = document.querySelector('.paragraphQuestion');
    let text = ParagraphQuestion.textContent;
    
    // Replace selected words with input fields
    currentQuestion.selectedW.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        text = text.replace(
            regex, 
            `<input type='text' class='guessInput' data-answer="${word}">`
        );
    });
    
    ParagraphQuestion.innerHTML = text;
    
    // Display progress';
    ProgressInfo.textContent = `Question ${index + 1} of ${shuffledQuestions.length} (Answered: ${answeredQuestions.size})`;
}

function saveNote(note) {
    // 1. Get existing notes (if any)
    let notes = JSON.parse(localStorage.getItem('userNotes')) || [];

    //2. Add the new one
    notes.push(note);

    // 3. Save back to localStorage
    localStorage.setItem('userNotes', JSON.stringify(notes));
}

function getNotes(){
    return JSON.parse(localStorage.getItem('userNotes')) || [];
}

function getRandomWholeNumber(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showResults() {
    QuestionArea.innerHTML = "";
    
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results-container';
    
    const title = document.createElement('h2');
    title.textContent = 'Review Complete!';
    resultsContainer.appendChild(title);
    
    let correctCount = 0;
    let totalAnswers = 0;
    
    // Check answers
    userAnswers.forEach((questionData, qIndex) => {
        const questionResult = document.createElement('div');
        questionResult.className = 'question-result';
        
        const questionTitle = document.createElement('h4');
        questionTitle.textContent = `Question ${qIndex + 1}:`;
        questionResult.appendChild(questionTitle);
        
        const paragraphSnippet = document.createElement('p');
        paragraphSnippet.textContent = questionData.paragraph.substring(0, 100) + '...';
        paragraphSnippet.style.fontStyle = 'italic';
        questionResult.appendChild(paragraphSnippet);
        
        questionData.answers.forEach((answer, aIndex) => {
            totalAnswers++;
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-item';
            
            const isCorrect = answer.userAnswer.toLowerCase() === answer.correctAnswer.toLowerCase();
            if (isCorrect) correctCount++;
            
            answerDiv.innerHTML = `
                <span style="color: ${isCorrect ? 'green' : 'red'}">
                    ${isCorrect ? '✓' : '✗'} Your answer: "${answer.userAnswer}"
                </span>
                ${!isCorrect ? `<span style="color: blue"> (Correct: "${answer.correctAnswer}")</span>` : ''}
            `;
            
            questionResult.appendChild(answerDiv);
        });
        
        resultsContainer.appendChild(questionResult);
    });
    
    // Score summary
    const score = document.createElement('h3');
    score.textContent = `Score: ${correctCount}/${totalAnswers} (${((correctCount/totalAnswers)*100).toFixed(1)}%)`;
    resultsContainer.insertBefore(score, resultsContainer.children[1]);
    
    QuestionArea.appendChild(resultsContainer);
    
    // Add restart button
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Start New Review';
    restartBtn.className = 'restart-btn';
    restartBtn.addEventListener('click', () => {
        ReviewBtn.click(); // Restart the review
    });
    QuestionArea.appendChild(restartBtn);
}