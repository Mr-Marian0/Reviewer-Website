
// BUTTON CLASSES AND ID
const CreateRevBtn = document.querySelector('.createRev_btn');
const ReviewBtn = document.querySelector('.review_btn');
const CloseInputRevBtn = document.querySelector('.closeInputRev_btn');
const ClipBtn = document.querySelector('.clip_btn');
const ClipArea = document.querySelector('.clip_area');
const TextInput = document.querySelector('.textInput');
const SaveBtn = document.querySelector(".save_btn");
// const WordBtn = document.querySelector('word_btn');

const TextInputId = document.getElementById('createRev_Id');
const FaddingCreateBtns = document.querySelectorAll('.AllcreateRev_btns');

let selectedWords = [];
let experimentOnly = null;
let savePreviousPar;

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
        console.log(words)

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
        let inputText = TextInput.value;

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
                try{
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


                } catch(error){
                    console.log("Reason why button not changed!: "+error);
                }
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

        FaddingCreateBtns.forEach(button => {
            button.classList.toggle('clipButtonFade')
        })
    })

    SaveBtn.addEventListener('click', () => {
        const SelectedWordBtn = document.querySelectorAll('.word-btn.selected');
        SelectedWordBtn.forEach(words => {
            selectedWords.push(words.textContent.trim());
        })

        console.log("Here are the selected WORDS: ", selectedWords);
    })

    ReviewBtn.addEventListener('click', () => {
        
    })
    
}

