
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

// SAVED NOTES SECTION
const SavedNotesBtn = document.querySelector('.saved_notes_btn');
const CloseSaveNotesBtn = document.querySelector('.closeSavedNotes_btn');
const SavedNotesContainer = document.querySelector('.saved_notes_container');
const SavedNotes = document.querySelector('.saved_notes');
const DeleteParagraphBtn = document.querySelector('.deleteParagraph_btn');

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
let createUniqueId = 0; //used to create Unique ID in: list of saved question

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
        addReviewCloseAll();
    })

    SaveBtn.addEventListener('click', () => {

        let selectedExist = false;
        const WordBtnContainsSelectedW = document.querySelectorAll('.word-btn');

        WordBtnContainsSelectedW.forEach(wordBtn => {
            if(wordBtn.classList.contains('selected')){
                selectedExist = true
            }
        })

        if(!selectedExist) return alert('Please select word before saving.')

        const SelectedWordBtn = document.querySelectorAll('.word-btn.selected');
        const allWordBtn = document.querySelectorAll('.word-btn');
        let allWordBtnArr = [];
        let SelectedWordBtnIndex = [];

        SelectedWordBtn.forEach(words => {
            selectedWords.push(words.textContent.trim());
        })

        allWordBtn.forEach( (Allword, index) => {
            allWordBtnArr.push(Allword);

            if(Allword.classList.contains('selected')){SelectedWordBtnIndex.push(index)}
        })

        let userInputData = {
            paragraph: inputText, 
            selectedW: selectedWords,
            selectedWrdBtnIndex: SelectedWordBtnIndex
        };

        console.log("Selected Words",userInputData.selectedW);
        console.log("INDEX OF SELECTED: ", userInputData.selectedWrdBtnIndex)
        
        saveNote(userInputData);

        // addReviewCloseAll()

        alert("Note is now saved");
    })

    function addReviewCloseAll(){
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
    }

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
    
    SavedNotesBtn.addEventListener('click', () => {

        // Clear
        SavedNotes.textContent = ''
        createUniqueId = 0;
        
        //DISPLAY THE LIST AGAIN
        DisplayNotesOnSavedList();

        SavedNotesContainer.classList.toggle('SavedNotesContainerToggle');
    })

    // Delete all the marked only in saved paragarph
    DeleteParagraphBtn.addEventListener('click', () => {
        createUniqueId = 0
        const ParagraphList = document.querySelectorAll('.paragraph_list');

        if(!ParagraphList.length) return alert("NO LIST TO BE DELETED");
        
        deleteSavedItem(ParagraphList);

        SavedNotes.textContent = ''
        DisplayNotesOnSavedList();
    })

    CloseSaveNotesBtn.addEventListener('click', () => {
        SavedNotesContainer.classList.toggle('SavedNotesContainerToggle');
        SavedNotesContainer.classList.toggle('SavedNotesContainerClose');
        
        setTimeout(()=>{
            SavedNotesContainer.classList.toggle('SavedNotesContainerClose');
        }, 200);
    })

    CloseStartReviewBtn.addEventListener('click', () => {
        StartReview.classList.toggle('startRevFade');
        StartReview.style.display = "none";
        setTimeout(() => {
            StartReview.style.display = "flex";
        }, 500);
    })
}

function DisplayNotesOnSavedList(){
    
    getNotes().forEach(par =>{

            const listOfParagraph = document.createElement('div')
            listOfParagraph.className = "paragraph_list";
            listOfParagraph.id = `qId${createUniqueId}`;
            listOfParagraph.textContent = par.paragraph
            SavedNotes.appendChild(listOfParagraph);

            const SavedParagraphQuestion = document.getElementById(`qId${createUniqueId}`)
            let textQuestion = SavedParagraphQuestion.textContent;

            par.selectedW.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                textQuestion = textQuestion.replace(
                    regex,
                    `<span class="selectedWord"> _${word}_ </span>`
                )
            });

            SavedParagraphQuestion.innerHTML = textQuestion;
            createUniqueId++;

        });

    const ParagraphList = document.querySelectorAll('.paragraph_list');
        
        // Used to detect clickEvent on PARAGRAPH LIST
    ParagraphList.forEach(eachDiv => {
        eachDiv.addEventListener('click', () => {
            console.log(eachDiv.id)
            eachDiv.classList.toggle('markAsCheck');
        })
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
    
    // Replace selected words with input fields
    const words = currentQuestion.paragraph.split(" ").filter(word => word !== "");

    currentQuestion.selectedWrdBtnIndex.forEach( (slcIndex,i) => {
        words[slcIndex] = `<input class="guessInput" data-answer="${currentQuestion.selectedW[i]}">`
    })
    
    //TURNS THE OBJECT "currentQuestion" BAcK TO PARAGRAPH AGAIN.
    words.forEach((element, index) => {
        //Add spaces before element if it's not the first one
        if(index > 0){
            QuestionArea.appendChild(document.createTextNode(' '))
        }

        if(element.startsWith('<input')){
            const temp = document.createElement('div');
            temp.innerHTML = element;
            QuestionArea.appendChild(temp.firstChild);
        } else {
            QuestionArea.appendChild(document.createTextNode(element));
        }
    })
    
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
            if (questionData.answers.length - 1 === aIndex) totalAnswers++; //1 SCORE PER QUESTIONS

            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-item';
            
            const isCorrect = answer.userAnswer.toLowerCase() === answer.correctAnswer.toLowerCase();
            if (isCorrect && questionData.answers.length - 1 === aIndex) correctCount++;
            
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

function deleteSavedItem(PassedParagraphList) {
    let data = JSON.parse(localStorage.getItem("userNotes")) || [];

    // 1. Collect all indices to delete
    let indicesToRemove = [];

    PassedParagraphList.forEach(eachDiv => {
        if (eachDiv.classList.contains('markAsCheck')) {
            const num = parseInt(eachDiv.id.replace(/\D/g, ''));
            indicesToRemove.push(num);
        }
    });
    console.log(indicesToRemove);
    // 2. Sort indices descending
    indicesToRemove.sort((a, b) => b - a);

    // 3. Delete items using descending order
    indicesToRemove.forEach(i => {
        data.splice(i, 1);
    });

    // 4. Save updated storage
    localStorage.setItem('userNotes', JSON.stringify(data));
}