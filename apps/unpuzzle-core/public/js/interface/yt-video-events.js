export class YTInterface {
    constructor() {
        this.puzzleSwitch = document.getElementById('puzzle-pieces-switch');
        this.muteButton = document.getElementById('muteButton');
        this.playButton = document.getElementById('playButton');
        this.fullScreenButton = document.getElementById('fullScreenButton');
        this.ccButton = document.getElementById('ccButton');
        this.mainAgentWrapper = document.querySelector('.main-agent-wrapper');
        this.pausedAtTime = document.querySelectorAll('.paused-at-time');

    }

    init(){
        // play button
        document.addEventListener('video:playing', () => {
            this.playButton.setAttribute('is-playing', 'true');
            this.playButton.innerHTML = `<img src="${ASSET_ORIGIN}/img/icon-pause.svg" alt="play" class="w-6 h-6">`;
        });

        // pause button
        document.addEventListener('video:paused', () => {
            this.playButton.removeAttribute('is-playing');
            this.playButton.innerHTML = `<img src="${ASSET_ORIGIN}/img/icon-play.svg" alt="pause" class="w-6 h-6">`;
            this.pausedAtTime.forEach(time => {
                time.innerHTML = ` ${window.ytPlayer.getFormattedTime(window.ytPlayer.player.getCurrentTime())}, `;
            });
        });

        // video ended
        document.addEventListener('video:ended', () => {
            this.playButton.removeAttribute('is-playing');
            this.playButton.innerHTML = `<img src="${ASSET_ORIGIN}/img/icon-play.svg" alt="pause" class="w-6 h-6">`;
        });
        

        // mute button
        this.muteButton?.addEventListener('click', (e) => {
            console.log("mute button clicked")
            if(window.ytPlayer.player.isMuted()){
                window.ytPlayer.unMute();
            }else{
                window.ytPlayer.mute();
            }
        });

        // play button
        this.playButton?.addEventListener('click', (e) => {
            const isPlaying = e.currentTarget.hasAttribute('is-playing') 
            if(isPlaying){
                window.ytPlayer.pause();
            }else{
                window.ytPlayer.play();
            }
        });

        // puzzle pieces switch
        this.puzzleSwitch?.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            const label= document.querySelector(`label[for="${e.target.id}"]`);
            if(isChecked){
                label.classList.add('active');
                this.mainAgentWrapper.classList.remove('hidden');
            }else{
                label.classList.remove('active');
                this.mainAgentWrapper.classList.add('hidden');
            }
        });

        // full screen button
        this.fullScreenButton?.addEventListener('click', (e) => {
            const isFullScreen = e.currentTarget.hasAttribute('is-full-screen');
            if(isFullScreen){
                e.currentTarget.removeAttribute('is-full-screen');
                e.currentTarget.innerHTML = `<img src="${ASSET_ORIGIN}/img/icon-full-screen.png" alt="fullscreen" class="w-6 h-6">`;
                window.ytPlayer.exitFullscreen();
            }else{
                const cb = (isFullScreen) => {
                    if(isFullScreen){
                        // build a toast notification
                        const toast = document.createElement('div');
                        toast.classList.add('toast');
                        toast.innerHTML = 'Fullscreen mode enabled press ESC to exit';
                        document.body.appendChild(toast);
                        setTimeout(() => {
                            toast.remove();
                        }, 1300);
                        e.currentTarget.setAttribute('is-full-screen', 'true');
                        e.currentTarget.innerHTML = `<img src="${ASSET_ORIGIN}/img/icon-full-screen.png" alt="fullscreen" class="w-6 h-6">`;
                    }
                }
                window.ytPlayer.requestFullscreen(cb);
            }
        });

        // ccButton
        this.ccButton?.addEventListener('click', (e) => {
            const isCCEnabled = localStorage.getItem('ccEnabled')=="true" ? true : false;
            localStorage.setItem('ccEnabled', !isCCEnabled);
            window.ytPlayer.player.destroy()
            const cb = () => {
                window.ytPlayer.play();
            }
            window.ytPlayer.onYouTubeIframeAPIReady(cb);
        });
        
    }
}


