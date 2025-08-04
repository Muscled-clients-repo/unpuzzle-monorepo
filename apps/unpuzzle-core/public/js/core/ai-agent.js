import { PuzzleHintInterface } from '../interface/puzzle-hint.js';
import { PuzzleCheckInterface } from '../interface/puzzle-check.js';
import { PuzzlePathInterface } from '../interface/puzzle-path.js';
import { PuzzleReflectInterface } from '../interface/puzzle-reflect.js';

import { PuzzleHint } from './puzzle-hint.js';
import { PuzzleCheck } from './puzzle-check.js';
import { PuzzlePath } from './puzzle-path.js';
import { PuzzleReflect } from './puzzle-reflect.js';
import { Draggable } from '../utils/draggable.js';
import UserActivity from './user-activity.js';

class AIAgent {
  constructor() {
    this.agentButtons = document.querySelectorAll('.agent-button');
    this.puzzleHintInterface = new PuzzleHintInterface();
    this.puzzleCheckInterface = new PuzzleCheckInterface();
    this.puzzlePathInterface = new PuzzlePathInterface();
    this.puzzleReflectInterface = new PuzzleReflectInterface();
    this.puzzleHint = new PuzzleHint();
    this.puzzleCheck = new PuzzleCheck();
    this.puzzlePath = new PuzzlePath();
    this.puzzleReflect = new PuzzleReflect();
    this.draggable = new Draggable();
    this.userActivity = new UserActivity();

    this.pausedAt = document.querySelectorAll('.paused-at');
    this.puzzleSwitch = document.getElementById('puzzle-pieces-switch');
    this.playButton = document.getElementById('playButton');

    this.puzzleHint.init();
    this.puzzleCheck.init();
    this.puzzlePath.init();
    this.userActivity.init();
    this.puzzleReflect.init();
  }

  init() {
    
    
    // Video is paused// Video is paused
    document.addEventListener('video:paused', async(event) => {
      if(!this.puzzleSwitch.checked || true){

        return;
      }

      const userLogs = window.localStorage.getItem(`agent-user-logs_${window.ytPlayer.video.id}`) || 0;
      this.pausedAt.forEach(element => {
          element.innerHTML = event.detail.formattedTime;
      });

      // deactivate All 
      this.puzzleCheckInterface.deactivateCheck();
      this.puzzleHintInterface.deactivateHint();
      this.puzzlePathInterface.deactivatePath();
      // Decide what to do based on user logs
      this.playButton.innerHTML = `<img src="/img/icon-play.svg" alt="pause" class="w-6 h-6">`;
      if(this.puzzleSwitch.checked){
        console.log(window.ytPlayer.video.id);
        // /api/recommend-agent/solution
        const response = await fetch(`/api/recommend-agent/solution`,{
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            videoId: window.ytPlayer.video.id
          })
        });

        const {data} = await response.json()

        // console.log(data)
        // this.puzzleReflectInterface.activateReflect();
        if(data.puzzleHint){
          this.puzzleHintInterface.activateHint();
        }else if(data.puzzleReflect){
          this.puzzleReflectInterface.activateReflect();
        }else if(data.puzzlePath){
          this.puzzlePathInterface.activatePath();
        }else if(data.puzzleChecks){
          this.puzzleCheckInterface.data="";
          this.puzzleCheckInterface.activateCheck();
        }

        window.localStorage.setItem(`agent-user-logs_${window.ytPlayer.video.id}`, parseInt(userLogs) + 1);
      }
    });
    // init the agent buttons
    this.agentButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // deactivate All 
        this.puzzleCheckInterface.deactivateCheck();
        this.puzzleHintInterface.deactivateHint();
        this.puzzlePathInterface.deactivatePath();
        this.puzzleReflectInterface.deactivateReflect();

        // activate the agent
        const agentType = e.currentTarget.getAttribute('agent')?.replace('agent_button_', '');
        console.log("agentType: ",agentType);
        if(agentType === "hint"){
          this.puzzleHintInterface.activateHint();
        }else if(agentType === "reflect"){
          this.puzzleReflectInterface.activateReflect();
        }else if(agentType === "path"){
          this.puzzlePathInterface.activatePath();
        }else if(agentType === "check"){
          this.puzzleCheckInterface.data="";
          this.puzzleCheckInterface.activateCheck();
        }
      });
    });
  }
}

// init the ai agent
window.aiAgent = new AIAgent();
window.aiAgent.init();