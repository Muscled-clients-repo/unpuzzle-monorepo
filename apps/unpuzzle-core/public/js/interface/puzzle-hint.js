import { PuzzleReflectInterface } from './puzzle-reflect.js';

export class PuzzleHintInterface {
    constructor() {
        this.cardHint = document.querySelector('.card-hint');
        this.cardHintBody = document.querySelector('.card-hint-body');
        this.cardHintTitle = document.querySelector('.card-hint-title');
        this.hintPrimaryButton = document.querySelector('.card-hint-buttons .secondary-action-button');
        this.hintSecondaryButton = document.querySelector('.card-hint-buttons .primary-action-button');
        this.cardHintButtons = document.querySelectorAll('.card-hint-buttons button');
        this.agentHintButton = document.querySelector('.agent-button[agent="agent_button_hint"]');
        this.hintPausedNotification = document.querySelector('.hint-paused-notification');
        this.puzzleReflectInterface = new PuzzleReflectInterface();
    }

    setLoading = (isLoading) =>{
        if(isLoading){  
            this.cardHint.classList.add('loading');
        }else{
            this.cardHint.classList.remove('loading');
        }
    }

    showStream = (data) =>{
        this.cardHintBody.classList.remove('hidden');
        this.cardHintBody.classList.add('animate-fade-in');
        const spilitedData = data.split('\n');
        let bodyText = "";
        let stepNumber = 1;
        spilitedData.forEach(line => { 
            const cleanLine = line.trim().replace(/\\n/g, '\n');
            if(cleanLine.startsWith('"prompt":')){
                bodyText += `<p class="text-sm text-[#1D1D1D]">${cleanLine.split('"prompt":')[1]}</p><p class="text-sm text-gray-500 mt-2">Here is a step-by-step guide to help you solve the problem:</p>`;
            }
            if(cleanLine.startsWith('"instruction":')){
                bodyText += `<p class="text-sm text-gray-500 mt-2">${stepNumber}. ${cleanLine.split('"instruction":')[1]}</p>`;
                stepNumber++;
            }
        });
        this.cardHintBody.innerHTML = bodyText;
    }

    updateHint = (data) =>{
        console.log(data);
        try{
            this.cardHintBody.classList.remove('hidden');
            // Api request to generate hint and set the hint to the card hint body
            if(data.error){
                this.cardHintBody.innerHTML = `<p class="text-sm text-gray-500">${data.error}</p>`;
                return;
            }

            const completion = data.completion;
            const prompt = data.prompt;
            this.cardHintTitle.innerHTML = data.topic;
            let bodyText = `<p class="text-sm text-[#1D1D1D]">${prompt}</p><p class="text-sm text-gray-500 mt-2">Here is a step-by-step guide to help you solve the problem:</p>`;
            

            completion.forEach((step, index) => {
                bodyText += `<p class="text-sm text-gray-500 mt-2">${step.step_number}. ${step.instruction}</p>`;
            });
            
            this.cardHintBody.innerHTML = bodyText;
        }catch(error){
            console.error(error);
        }finally{
            this.hintPrimaryButton.setAttribute('action', 'got-it');
            this.hintPrimaryButton.innerHTML = 'Got It';
    
            this.hintSecondaryButton.setAttribute('action', 'still-confused');
            this.hintSecondaryButton.innerHTML = 'Still Confused';
            this.setLoading(false);
        }

    }

    activateHint = () =>{
        window.ytPlayer.pause();
        this.cardHint.classList.remove('hidden');
        const prevActive = document.querySelector('.agent-button.active');
        if(prevActive){
            prevActive.classList.remove('active');
            prevActive.classList.add('disabled');
        }
        this.agentHintButton.classList.add('active');
        this.agentHintButton.classList.remove('disabled');
        this.hintPausedNotification.classList.remove('hidden');
    }
    deactivateHint = () =>{
        this.cardHint.classList.add('hidden');
        this.cardHintBody.classList.add('hidden');
        this.agentHintButton.classList.add('disabled');
        this.agentHintButton.classList.remove('active');
        this.hintPausedNotification.classList.add('hidden');
    }

    init = () =>{

        // card hint buttons
        this.cardHintButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const action = e.currentTarget.getAttribute('action');
                switch(action){
                    case 'do-not-generate-hint':
                        document.dispatchEvent(new CustomEvent('card-hint:reset'));
                        break;
                    case 'generate-hint':
                        document.dispatchEvent(new CustomEvent('puzzle-hint:generate'));
                        break;
                    case 'still-confused':
                        document.dispatchEvent(new CustomEvent('card-hint:reset'));
                        this.puzzleReflectInterface.activateReflect();
                        break;
                    case 'got-it':
                        document.dispatchEvent(new CustomEvent('card-hint:reset'));
                        break;
                    default:
                        break;
                }
            });
        });

        // card reset
        document.addEventListener('card-hint:reset', () => {
            // set the card initial state like button change the button text and the attribute
            this.hintPrimaryButton.setAttribute('action', 'do-not-generate-hint');
            this.hintPrimaryButton.innerHTML = 'No Thanks';
            this.hintSecondaryButton.setAttribute('action', 'generate-hint');
            this.hintSecondaryButton.innerHTML = 'Show Hint';
            this.cardHint.classList.add('hidden');
            this.cardHintBody.classList.add('hidden');
        });
    }
}