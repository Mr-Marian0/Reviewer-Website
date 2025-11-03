
// BUTTON CLASSES AND ID
const CreateRevBtn = document.querySelector('.createRev_btn');
const ReviewBtn = document.querySelector('.review_btn');
const CloseInputRevBtn = document.querySelector('.closeInputRev_btn');
const ClipBtn = document.querySelector('.clip_btn');
const ClipArea = document.querySelector('.clip_area');
const TextInput = document.querySelector('.textInput');
const SaveBtn = document.querySelector(".save_btn");
// REVIEW SECTION-
const StartReview = document.querySelector('.start_review');
const CloseStartReviewBtn = document.querySelector('.closeStartReview_btn');
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
            TextInput.style.width = '0px'
            TextInput.style.height = '0px'
            TextInput.style.display = 'none'
            ClipArea.style.width = '70%';
            ClipArea.style.height = '100%'
            ClipArea.style.border = 'solid 2px black'

            ClipBtn.innerHTML = "Unclip"

            SaveBtn.style.opacity = '1'
            SaveBtn.style.height = '30px'
            SaveBtn.style.display = 'inline-block'

            // FOR UNDO PURPOSE----------------------
            if(ClipBtn.classList.contains('cliped')){

                TextInput.value = savePreviousPar;
                TextInput.style.width = '70%'
                TextInput.style.height = '100%'
                TextInput.style.display = 'inline-block'
                
                ClipArea.style.width = '0px';
                ClipArea.style.border = 'none'
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
        TextInput.style.width = '70%'
        TextInput.style.height = '100%'
        TextInput.style.display = 'inline-block'
        ClipArea.style.width = '0px';
        ClipArea.style.border = 'none'

        ClipBtn.innerHTML = "Clip"
        SaveBtn.style.height = '0px'
        SaveBtn.style.display = 'none'
        SaveBtn.style.opacity = '0';

        selectedWords = []; //reset or erase saved array words
        inputText = "";

        FaddingCreateBtns.forEach(button => {
            button.classList.toggle('clipButtonFade')
        })
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

        const ObjectData = getNotes();

        ObjectData.forEach((note, index) => {
            const {paragraph, selectedW} = note;
            console.log(`Note ${index + 1}:`, paragraph, selectedW)
        })

        StartReview.classList.toggle('startRevFade');
    })

    CloseStartReviewBtn.addEventListener('click', () => {
        StartReview.classList.toggle('startRevFade');
    })
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