export class PuzzleReflectInterface {
    constructor() {
        this.agentReflectButton = document.querySelector('.agent-button[agent="agent_button_reflect"]');
        this.cardReflectWrapper = document.querySelector('.card-reflect-wrapper');
        this.cardReflectAudioSection = document.querySelector('.card-reflect-audio-section');
        this.cardReflectLoomLinkSection = document.querySelector('.card-reflect-loom-link-section');
        this.cardReflectFileUploadSection = document.querySelector('.card-reflect-file-upload-section');
        // audio player
        this.cardReflectPlayer = document.querySelector('.reflect-audio-player');
        this.reflectAudioClips = document.querySelectorAll('.reflect-audio-clip');
        this.recordButton = document.getElementById('recordButton');
        this.audioPlayer = document.getElementById('audioPlayer');
        this.waveformContainer = document.getElementById('waveform');
        this.audioRecordingWrapper = document.querySelector('.audio-recording-wrapper');
        this.audioPlayerWrapper = document.querySelector('.audio-player-wrapper');
        this.backButton = document.querySelector('.card-reflect-buttons #backButton');
        this.loomLinkInput = document.querySelector('.loom-link-input');
        this.reflectUploadFile = document.querySelector('#reflectUploadFile');
        this.previewImageWrapper = document.querySelector('.preview-image-wrapper');
        this.confettiWrapper = document.querySelector('.card-reflect-confetti-section');
        this.reflectPausedNotification = document.querySelector('.reflect-paused-notification');

        this.audioRecorder = null;
        this.isRecording = false;
        this.isPlaying = false;
        this.audioChunks = [];
        this.wavesurfer = null;
        this.audioContext = null;
        this.analyser = null;
        this.mediaStreamSource = null;
        this.animationId = null;
        this.canvas = null;
        this.ctx = null;
        this.lastFrameTime = 0;
        this.frameInterval = 100; // Update every 100ms instead of 60fps
        this.smoothedData = [];
        this.recordingStartTime = 0;
        this.recordingTimer = null;

        this.reflectFiles = [];
    }

    setLoading(isLoading){
        if(isLoading){  
            this.cardReflectWrapper.classList.add('loading');
        }else{
            this.cardReflectWrapper.classList.remove('loading');
        }
    }

    resetPuzzleReflect(){
        this.audioRecorder = null;
        this.isRecording = false;
        this.isPlaying = false;
        this.audioChunks = [];
        this.wavesurfer = null;
        this.audioContext = null;
        this.analyser = null;
        this.mediaStreamSource = null;
        this.animationId = null;
        this.canvas = null;
        this.ctx = null;
        this.lastFrameTime = 0;
        this.frameInterval = 100;
        this.smoothedData = [];
        this.recordingStartTime = 0;
        this.recordingTimer = null;
        this.reflectFiles = [];

        this.confettiWrapper.classList.remove('hidden');
        this.setLoading(false)
        setTimeout(() => {
            this.confettiWrapper.classList.add('hidden');
            this.cardReflectFileUploadSection.classList.add('hidden');
            this.cardReflectWrapper.classList.add('hidden');
            
            this.recordButton.setAttribute('recording', 'false');
            this.recordButton.innerHTML = 'Start recording';
            this.audioPlayerWrapper.classList.add('hidden');
            this.backButton.classList.add("hidden")
        }, 2000);
    }

    decodeAudioBlob=async(blob)=>{
        const arrayBuffer = await blob.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return audioContext.decodeAudioData(arrayBuffer);
    }

    // Create canvas for real-time waveform
    createCanvas() {
        // Remove existing canvas if any
        const existingCanvas = this.waveformContainer.querySelector('canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.waveformContainer.offsetWidth;
        this.canvas.height = 30;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '30px';
        this.waveformContainer.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    // Draw real-time waveform
    drawWaveform() {
        if (!this.analyser || !this.ctx) return;

        const currentTime = Date.now();
        if (currentTime - this.lastFrameTime < this.frameInterval) {
            this.animationId = requestAnimationFrame(() => this.drawWaveform());
            return;
        }
        this.lastFrameTime = currentTime;

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteTimeDomainData(dataArray);

        // Smooth the data
        if (this.smoothedData.length === 0) {
            this.smoothedData = new Array(bufferLength).fill(128);
        }

        // Apply smoothing
        for (let i = 0; i < bufferLength; i++) {
            this.smoothedData[i] = this.smoothedData[i] * 0.7 + dataArray[i] * 0.3;
        }

        // Clear canvas with transparent background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate bar width and spacing - increased spacing for less density
        const barWidth = (this.canvas.width / bufferLength) * 0.4; // 40% of available space for bars
        const barSpacing = (this.canvas.width / bufferLength) * 0.6; // 60% for spacing
        const centerY = this.canvas.height / 2;

        // Set bar style for Facebook Messenger-like appearance
        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;

        // Draw bars with rounded tops
        for (let i = 0; i < bufferLength; i++) {
            const amplitude = Math.abs(this.smoothedData[i] - 128) / 128;
            const barHeight = Math.max(amplitude * centerY * 2 + 5); // Minimum height of 5px
            const x = i * (barWidth + barSpacing);
            
            // Draw rounded rectangle for each bar (always draw since we have minimum height)
            this.drawRoundedRect(x, centerY - barHeight, barWidth, barHeight * 2, 2);
        }

        this.animationId = requestAnimationFrame(() => this.drawWaveform());
    }

    // Helper function to draw rounded rectangles
    drawRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    // Format time as MM:SS
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Update recording timer
    updateRecordingTimer() {
        if (this.isRecording) {
            const elapsed = (Date.now() - this.recordingStartTime) / 1000;
            this.recordButton.innerHTML = `Stop Recording (${this.formatTime(elapsed)})`;
            this.recordingTimer = setTimeout(() => this.updateRecordingTimer(), 1000);
        }
    }

    startRecording=async ()=>{
        this.audioRecordingWrapper.classList.remove('hidden');
        console.log("startRecording");
        
        try{
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioRecorder = new MediaRecorder(stream);
            
            // Set up Web Audio API for real-time visualization
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 64; // Reduced from 256 to make bars less dense
            
            this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
            this.mediaStreamSource.connect(this.analyser);
            
            // Create canvas for real-time waveform
            this.createCanvas();
            
            // Start drawing waveform
            this.drawWaveform();

            this.audioRecorder.ondataavailable = async(event)=>{
                this.audioChunks.push(event.data);
            };

            this.audioRecorder.onstop = async () => {
                // Stop real-time visualization
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
                
                // Stop recording timer
                if (this.recordingTimer) {
                    clearTimeout(this.recordingTimer);
                    this.recordingTimer = null;
                }
                
                // Create blob from recorded chunks
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                
                // Create object URL for the audio player
                const audioUrl = URL.createObjectURL(audioBlob);
                this.audioPlayer.src = audioUrl;
                
                // Load the recorded audio into WaveSurfer for final visualization
                try {
                    if (!this.wavesurfer) {
                        this.wavesurfer = WaveSurfer.create({
                            container: '#waveform',
                            waveColor: 'violet',
                            progressColor: 'purple',
                            height: 30,
                            barWidth: 3
                        });
                    }
                    this.wavesurfer.empty();
                    const audioBuffer = await this.decodeAudioBlob(audioBlob);
                    this.wavesurfer.loadDecodedBuffer(audioBuffer);
                } catch (error) {
                    console.error('Error loading audio into WaveSurfer:', error);
                }
            };

            this.audioRecorder.start();
            this.isRecording = true;
            this.recordingStartTime = Date.now();
            this.recordButton.setAttribute('recording', 'true');
            this.recordButton.innerHTML = 'Stop Recording (00:00)';
            
            // Start the recording timer
            this.updateRecordingTimer();
        }catch(error){
            console.error('Error starting recording:', error);
        }
    }

    stopRecording=async ()=>{
        try{
            if (this.audioRecorder && this.isRecording) {
                this.audioRecorder.stop();
                this.audioRecorder.stream.getTracks().forEach(track => track.stop());
                this.audioRecorder = null;
                this.audioChunks = [];
                
                // Stop real-time visualization
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
                
                // Stop recording timer
                if (this.recordingTimer) {
                    clearTimeout(this.recordingTimer);
                    this.recordingTimer = null;
                }
                
                // Clean up Web Audio API
                if (this.mediaStreamSource) {
                    this.mediaStreamSource.disconnect();
                    this.mediaStreamSource = null;
                }
                if (this.analyser) {
                    this.analyser = null;
                }
                
                this.isRecording = false;
                this.recordButton.setAttribute('recording', 'submiting');
                this.recordButton.innerHTML = 'Submit Reflection Of Last 20s';
                this.audioRecordingWrapper.classList.add('hidden');
                this.audioPlayerWrapper.classList.remove('hidden');
                this.backButton.classList.remove("hidden")
            }
        }catch(error){
            console.error('Error stopping recording:', error);
        }
    }

    

    activateAudioSection(){
        this.cardReflectAudioSection.classList.remove('hidden');
        this.recordButton.innerHTML = 'Start recording';
        this.recordButton.setAttribute('recording', 'false');
    }
    activateLoomLinkSection(){
        this.recordButton.setAttribute('recording', 'submiting-loom-link');
        this.recordButton.innerHTML = 'Submit Reflection Of Last 20s';
        this.cardReflectLoomLinkSection.classList.remove('hidden');
    }

    activateFileUploadSection() {
        this.cardReflectFileUploadSection.classList.remove('hidden');
        this.recordButton.setAttribute('recording', 'submiting-file-upload');
        this.recordButton.innerHTML = 'Submit Reflection Of Last 20s';
    }
    
    deactivateReflect(){
        this.cardReflectAudioSection.classList.add('hidden');
        this.cardReflectLoomLinkSection.classList.add('hidden');
        this.cardReflectFileUploadSection.classList.add('hidden');
        this.cardReflectWrapper.classList.add('hidden');
        this.agentReflectButton.classList.remove('active');
        this.agentReflectButton.classList.add('disabled');
        this.reflectPausedNotification.classList.add('hidden');
    }

    activateReflect(){
        window.ytPlayer.pause();
        this.deactivateReflect();
        this.cardReflectWrapper.classList.remove('hidden');
        const prevActive = document.querySelector('.agent-button.active');
        if(prevActive){
            prevActive.classList.remove('active');
            prevActive.classList.add('disabled');
        }
        this.agentReflectButton.classList.add('active');
        this.agentReflectButton.classList.remove('disabled');
        this.reflectPausedNotification.classList.remove('hidden');

        const randomValue = Math.floor(Math.random() * 3) + 1;
        if(randomValue === 1){
            this.activateAudioSection();
        }else if(randomValue === 2){
            this.activateAudioSection();
            // this.activateLoomLinkSection();
        }else if(randomValue === 3){
            this.activateAudioSection();
            // this.activateFileUploadSection();
        }
    }

    previewImage(){
        let imagesElement = "";
        this.reflectFiles.forEach((file, index) => {
            console.log(file);
            imagesElement += `
            <div class="w-full flex flex-row gap-2 items-center justify-between border border-[#606060] rounded-md p-[8px] mt-2">
                <p class="text-sm text-gray-500">${file.name} (${file.size})</p>
                <button class="w-fit h-fit rounded-md p-[8px] preview-image-remove-button" fileId="${index}">
                    <img src="${ASSET_ORIGIN}/img/icon-close.svg" alt="remove" class="w-4 h-4">
                </button>
            </div>
            `; 
        });
        this.previewImageWrapper.classList.remove('hidden');
        this.previewImageWrapper.innerHTML = imagesElement;
        document.querySelectorAll('.preview-image-remove-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.reflectFiles.splice(e.target.getAttribute('fileId'), 1);
                this.previewImage();
            });
        });
    }

    updateReflect(){
        const data = this.data;
        try{
            // 

        }catch(error){
            console.error(error);
        }finally{
            this.setLoading(false);
        }
    }

    init(){
        // this.activateAudioSection();
        // this.activateLoomLinkSection();
        // this.activateFileUploadSection();
        // card Reflect buttons
        this.reflectAudioClips.forEach(clip => {
            clip.addEventListener('click', () => {
                this.audioPlayerWrapper.classList.remove('hidden');
                this.backButton.classList.remove("hidden")
            });
        });
        this.recordButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("recordButton clicked");
            const isRecording = this.recordButton.getAttribute('recording');
            if(isRecording === 'true'){
                this.stopRecording();
            }else if(isRecording === 'false'){
                this.startRecording();
            }else if(isRecording === 'submiting'){
                this.setLoading(true);
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                document.dispatchEvent(new CustomEvent('puzzle-reflect:generate', { detail: { blob: audioBlob, type: 'audio' } }));
            }else if(isRecording === 'submiting-file-upload'){
                console.log("submiting-file-upload");
                this.setLoading(true);
                this.resetPuzzleReflect()
                
            }else if(isRecording === 'submiting-loom-link'){
                console.log("submiting-loom-link");
            }
        });

        this.backButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.cardReflectPlayer.classList.add('hidden');
        });

        this.loomLinkInput.addEventListener('input', (e) => {
            e.preventDefault();
            // console.log(e.target.value);
        });

        this.reflectUploadFile.addEventListener('change', (e) => {
            e.preventDefault();
            const files = Array.from(e.target.files);
            files.forEach(file => {
                this.reflectFiles.push(file);
            });
            this.previewImage();
        });
       
    }
}