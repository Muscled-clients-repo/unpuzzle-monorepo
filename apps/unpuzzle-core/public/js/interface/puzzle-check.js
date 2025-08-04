
export class PuzzleCheckInterface {
    constructor() {
        this.cardCheck = document.querySelector('.card-check');
        this.cardCheckBody = document.querySelector('.card-check-body');
        this.cardCheckTitle = document.querySelector('.card-check-title');
        // this.checkPreviousButton = document.querySelector('.card-check-buttons .previous-button');
        // this.checkNextButton = document.querySelector('.card-check-buttons .next-button');
        this.checkButtons = document.querySelectorAll('.card-check-buttons button');
        this.checkQuestionNumber = document.querySelector('.card-check-question-number');
        this.agentCheckButton = document.querySelector('.agent-button[agent="agent_button_check"]');
        this.cardCheckProgressBar = document.querySelector('.card-check-progress-bar');
        this.cardCheckButtons = document.querySelector('.card-check-buttons');
        this.checkPausedNotification = document.querySelector('.check-paused-notification');
        this.index = 0;
        this.totalScore = 0
        this.score = 0
        // data to store the check
        this.data = {
            completion: [],
            prompt: '',
            topic: ''
        };
    }

    setLoading = (isLoading) =>{
        if(isLoading){  
            this.cardCheck.classList.add('loading');
        }else{
            this.cardCheck.classList.remove('loading');
        }
    }

    activateCheck = () =>{
        window.ytPlayer.pause();
        
        this.index = 0;
        this.totalScore = 0
        this.score = 0
        // data to store the check
        this.data = {
            completion: [],
            prompt: '',
            topic: ''
        };
        this.cardCheck.classList.remove('hidden');
        this.cardCheckBody.classList.remove('hidden');
        const prevActive = document.querySelector('.agent-button.active');
        if(prevActive){
            prevActive.classList.remove('active');
            prevActive.classList.add('disabled');
        }
        this.agentCheckButton.classList.add('active');
        this.agentCheckButton.classList.remove('disabled');
        this.cardCheckButtons.classList.remove('hidden');
        this.checkPausedNotification.classList.remove('hidden');
        
    }
    deactivateCheck = () =>{
        this.cardCheck.classList.add('hidden');
        this.cardCheckBody.classList.add('hidden');
        this.agentCheckButton.classList.add('disabled');
        this.agentCheckButton.classList.remove('active');
        this.cardCheckButtons.classList.add('hidden');
        this.checkPausedNotification.classList.add('hidden');
        this.index = 0;
        this.totalScore = 0
        this.score = 0
        // data to store the check
        this.data = {
            completion: [],
            prompt: '',
            topic: ''
        };

        this.checkQuestionNumber.innerHTML = ``;
        this.cardCheckBody.innerHTML = ``;
    }

    showStream = (data) =>{
        // console.log(this.cardCheckBody)
        this.cardCheckBody.classList.remove('hidden');
        this.cardCheckBody.classList.add('generating');
        const spilitedData = data.split('\n');
        let bodyText = "";
        let qsNumber = 1;
        let choicesNumber = 1;
        let totalQuestions = 0;
        
        spilitedData.forEach((line, index) => { 
            const cleanLine = line.replace(/\\n/g, '\n').trim();
            if(cleanLine.startsWith('"question":')){
                totalQuestions++;
            }
            if(cleanLine.startsWith('"question":') && qsNumber == 1){
                bodyText += `<h3 class="text-[14px] text-[#1D1D1D] font-semibold card-check-title mb-2">${cleanLine.split('"question":')[1]?.replace(/^"|"$/g, '').replace(/,$/, '').trim()}</h3>`;
                qsNumber++;
            }
            if(cleanLine.startsWith('"choices":') && choicesNumber == 1){
                const choices1 = spilitedData[index+1]?.replace(/^"|"$/g, '').replace(/,$/, '').trim();
                const choices2 = spilitedData[index+2]?.replace(/^"|"$/g, '').replace(/,$/, '').trim();
                const choices3 = spilitedData[index+3]?.replace(/^"|"$/g, '').replace(/,$/, '').trim();
                const choices4 = spilitedData[index+4]?.replace(/^"|"$/g, '').replace(/,$/, '').trim();
                if(choices1){
                    bodyText += `<div class="flex flex-row border border-[#E4E4E4] rounded-md w-full gap-2 mb-2 option-wrapper">
                        <input type="checkbox" class="hidden", id="card-check-input-1" value="${choices1}">
                        <label for="card-check-input-1" class="w-full p-2 rounded-md card-check-input-label flex flex-row gap-2 items-center w-full justify-between">
                            <p class="text-sm text-[#606060] card-check-input-label-text">
                                ${choices1}
                            </p>
                            <div class="w-[24px] h-[24px] border-[1px] border-[#606060] rounded-full check-indegator shrink-0"></div>
                        </label>
                    </div>`;
                }
                if(choices2){
                    bodyText += `<div class="flex flex-row border border-[#E4E4E4] rounded-md w-full gap-2 mb-2 option-wrapper">
                        <input type="checkbox" class="hidden", id="card-check-input-2" value="${choices2}">
                        <label for="card-check-input-2" class="w-full p-2 rounded-md card-check-input-label flex flex-row gap-2 items-center w-full justify-between">
                            <p class="text-sm text-[#606060] card-check-input-label-text">
                                ${choices2}
                            </p>
                            <div class="w-[24px] h-[24px] border-[1px] border-[#606060] rounded-full check-indegator shrink-0"></div>
                        </label>
                    </div>`;
                }
                if(choices3){
                    bodyText += `<div class="flex flex-row border border-[#E4E4E4] rounded-md w-full gap-2 mb-2 option-wrapper">
                        <input type="checkbox" class="hidden", id="card-check-input-3" value="${choices3}">
                        <label for="card-check-input-3" class="w-full p-2 rounded-md card-check-input-label flex flex-row gap-2 items-center w-full justify-between">
                            <p class="text-sm text-[#606060] card-check-input-label-text">
                                ${choices3}
                            </p>
                            <div class="w-[24px] h-[24px] border-[1px] border-[#606060] rounded-full check-indegator shrink-0"></div>
                        </label>
                    </div>`;
                }
                if(choices4){
                    bodyText += `<div class="flex flex-row border border-[#E4E4E4] rounded-md w-full gap-2 mb-2 option-wrapper">
                        <input type="checkbox" class="hidden", id="card-check-input-4" value="${choices4}">
                        <label for="card-check-input-4" class="w-full p-2 rounded-md card-check-input-label flex flex-row gap-2 items-center w-full justify-between">
                            <p class="text-sm text-[#606060] card-check-input-label-text">
                                ${choices4}
                            </p>
                            <div class="w-[24px] h-[24px] border-[1px] border-[#606060] rounded-full check-indegator shrink-0"></div>
                        </label>
                    </div>`;
                }
                choicesNumber++;
            }
        });
        this.checkQuestionNumber.innerHTML = `Question 1 of ${totalQuestions}`;
        this.cardCheckBody.innerHTML = bodyText;
    }

    updateCheck = () =>{
        const data = this.data;
        try{
            // console.log("this.cardCheckBody: ",this.cardCheckBody)
            // remove class if exist
            this.cardCheckBody.classList.remove('hidden');
            this.cardCheckBody.classList.remove('generating');
            // Api request to generate Check and set the Check to the card Check body
            if(data.error){
                this.cardCheckBody.innerHTML = `<p class="text-sm text-gray-500">${data.error}</p>`;
                return;
            }

            const completion = data.completion[this.index];
            this.checkQuestionNumber.innerHTML = `Question ${this.index + 1} of ${data.completion.length}`;
            // this.cardCheckTitle.innerHTML = data.topic;
            let bodyText = `<h3 class="text-[14px] text-[#1D1D1D] font-semibold card-check-title mb-2">${completion.question}</h3>`;
            

            completion.choices.forEach((choice, index) => {
                bodyText += `
                <div class="flex flex-row border border-[#E4E4E4] rounded-md w-full gap-2 mb-2 option-wrapper">
                    <input type="checkbox" class="hidden", id="card-check-input-${index+1}" value="${choice}">
                    <label for="card-check-input-${index+1}" class="w-full p-2 rounded-md card-check-input-label flex flex-row gap-2 items-center w-full justify-between">
                        <p class="text-sm text-[#606060] card-check-input-label-text">
                            ${choice}
                        </p>
                        <div class="w-[24px] h-[24px] border-[1px] border-[#606060] rounded-full check-indegator shrink-0"></div>
                    </label>
                </div>
                `;
            });
            
            this.cardCheckBody.innerHTML = bodyText;

            this.cardCheckBody.querySelectorAll('input[type="checkbox"]').forEach(input => {
                input.addEventListener('change', (e) => {
                    this.checkAnswer(completion, e.target);
                });
            });
            this.cardCheckButtons.classList.add('hidden');

        }catch(error){
            console.error(error);
        }finally{
            this.setLoading(false);
        }
    }

    checkAnswer = (data, ansElement) =>{
        if(!ansElement){
            return;
        }
        this.cardCheckBody.querySelectorAll('.option-wrapper').forEach(wrapper => {
            wrapper.classList.remove('correct');
            wrapper.classList.remove('incorrect');
            // console.log(wrapper.querySelector('input[type="checkbox"]'));
        });
        const answer = ansElement.value;
        if(answer === data.answer){
            ansElement.closest('.option-wrapper').classList.add('correct');
            this.score++
        }else{
            ansElement.closest('.option-wrapper').classList.add('incorrect');
        }

        this.index++;
        setTimeout(() => {
            if(this.index >= this.data.completion.length){
                this.index = this.data.completion.length - 1;
                return this.showScore()
            }
            this.updateCheck();
        }, 1000);
        this.cardCheckProgressBar.style.width = `${(this.index / (this.data.completion.length)) * 100}%`;
    }

    showScore = () =>{
        this.cardCheckBody.innerHTML = `
            <h3 class="text-[14px] text-[#1D1D1D] font-semibold card-check-title mb-2">
            You Got: ${this.score} out of ${this.totalScore}
            </h3>
        `;

        setTimeout(() => {
            this.deactivateCheck()
            this.cardCheckProgressBar.style.width = `0%`;
            document.dispatchEvent(new CustomEvent('puzzle-check:reset'));
        }, 3000);
    }

    init = () =>{
        // card Check buttons
        // this.checkPreviousButton.addEventListener('click', () => {
        //     this.index--;
        //     if(this.index < 0){
        //         this.index = 0;
        //     }
        //     this.updateCheck();
        // });
        // this.checkNextButton.addEventListener('click', () => {
        //     this.index++;
        //     if(this.index >= this.data.completion.length){
        //         this.index = this.data.completion.length - 1;
        //     }
        //     this.updateCheck();
        // });

        this.cardCheckButtons.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('action');
                if(action === 'generate-check'){
                    document.dispatchEvent(new CustomEvent('puzzle-check:generate'));
                }else if(action === 'do-not-generate-check'){
                    this.deactivateCheck();
                }
            });
        });


        // card reset
        document.addEventListener('card-check:reset', () => {
            // set the card initial state like button change the button text and the attribute
            this.deactivateCheck();
        });
    }
}