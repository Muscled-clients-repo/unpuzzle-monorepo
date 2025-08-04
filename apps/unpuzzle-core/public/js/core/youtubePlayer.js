import { YTInterface } from '../interface/yt-video-events.js';

export class YouTubeWidgetAPI {
  constructor() {
    this.scriptUrl = 'https://www.youtube.com/s/player/b2858d36/www-widgetapi.vflset/www-widgetapi.js';
    this.YT = window["YT"] || { loading: 0, loaded: 0 };
    this.YTConfig = window["YTConfig"] || { host: "https://www.youtube.com" };

    console.log("Init began")
    this.init();
  }

  createTrustedScriptURL(url) {
    try {
      const ttPolicy = window.trustedTypes.createPolicy("youtube-widget-api", {
        createScriptURL: x => x,
      });
      return ttPolicy.createScriptURL(url);
    } catch (e) {
      console.error("Error in createTrustedScriptURL", e);
      return url;
    }
  }

  setConfig(config) {
    for (const key in config) {
      if (config.hasOwnProperty(key)) {
        this.YTConfig[key] = config[key];
      }
    }
  }

  ready(callback) {
    console.log("YT.loaded", this.YT.loaded);
    if (this.YT.loaded) {
      callback();
    } else {
      this._callbacks.push(callback);
    }
  }

  onYTReady() {
    this.YT.loaded = 1;
    this._callbacks.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error('Error in YTReady callback', fn);
      }
    });
    document.dispatchEvent(new CustomEvent('YTReady'));
  }

  loadScript() {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "www-widgetapi-script";
    script.src = this.scriptUrl;
    script.async = true;

    const currentScript = document.currentScript;
    if (currentScript) {
      const nonce = currentScript.nonce || currentScript.getAttribute("nonce");
      if (nonce) script.setAttribute("nonce", nonce);
    }

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  init() {
    this.scriptUrl = this.createTrustedScriptURL(this.scriptUrl);
    window['yt_embedsEnableIframeApiSendFullEmbedUrl'] = true;
    window['yt_embedsEnableAutoplayAndVisibilitySignals'] = true;
    console.log("Init began 2", this.YT.loading)

    if (this.YT.loading==0) {
      this.YT.loading = 1;
      this._callbacks = [];

      // Attach ready and setConfig methods to YT object on window
      this.YT.ready = this.ready.bind(this);
      this.YT.setConfig = this.setConfig.bind(this);
      window.onYTReady = this.onYTReady.bind(this);

      this.loadScript();

      // Expose YT and YTConfig on the window
      window.YT = this.YT;
      window.YTConfig = this.YTConfig;
      this.onYTReady();
    }
  }
}

export class YouTubePlayer extends YouTubeWidgetAPI {
    /**
     * Initialize YouTube Player
     * @param {string} elementId - The ID of the HTML element where the player will be embedded
     * @param {string} videoId - The YouTube video ID to play
     */
    constructor(elementId, videoId) {
      super();
      // dynamic value for video, start and end time
      this.elementId = elementId;
      const elem = document.getElementById(elementId);
      this.video = elem ? JSON.parse(elem.getAttribute('data-video')) : null;
      console.log(this.video)
      this.videoId = this.video.yt_video_id;
      this.startTime = this.video ? this.video.start_time : 0;
      this.endTime = this.video ? this.video.end_time : 0;

      this.player = null;
      this.retryCount = 0;
      this.maxRetries = 3;
      this.isDragging = false;

      this.onPlayerReady = this.onPlayerReady.bind(this);
      this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
      this.onPlayerError = this.onPlayerError.bind(this);
      this.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this);
      this.handleProgressDrag = this.handleProgressDrag.bind(this);
      this.handleProgressDragEnd = this.handleProgressDragEnd.bind(this);
      this.handleProgressDragStart = this.handleProgressDragStart.bind(this);

      this.playbackInterval = null;
      this.isPlaying = false;
      this.loaded = false;

      this.totalDuration = document.querySelectorAll('.total-duration');
      this.videoPlaybackTime = document.querySelectorAll('.video-playback-time');
    }
  
    /**
     * Initialize the YouTube IFrame API and create the player
     * This is called when the YouTube API is ready
     */
    onYouTubeIframeAPIReady(cb) {
      if (this.playbackInterval) {
        clearInterval(this.playbackInterval);
        this.playbackInterval = null;
      }
      this.loaded = false;
      const isCCEnabled = localStorage.getItem('ccEnabled')=="true" ? 1 : 0;
      this.player = new this.YT.Player(this.elementId, {
        height: '360',
        width: '640',
        videoId: this.videoId,
        playerVars: {
          controls: 0,
          rel: 0,
          cc_load_policy: isCCEnabled,
          cc_lang_pref: ''
        },
        events: {
          'onReady': ()=>{
            this.onPlayerReady();
            if(cb){
              cb();
            }
          },
          'onStateChange': this.onPlayerStateChange,
          'onError': this.onPlayerError
        }
      });
    }

    requestFullscreen(cb){
      const playerContainer = document.getElementById(this.elementId);
      playerContainer.requestFullscreen().then(() => {
        if(cb){
          cb(true)
        }
      }).catch(err => {
        console.error("Fullscreen request failed:", err);
      });
    }

    exitFullscreen(cb){
      document.exitFullscreen().then(() => {
        if(cb){
          cb(true)
        }
      });
    }
    /**
     * Called when the player is ready to play
     * @param {Object} event - YouTube player event object
     */
    onPlayerReady() {
      let duration = this.getDuration();
      if(duration <= 0){
        duration = 0;
      }
      if(this.endTime <= 0 || this.endTime < this.startTime){
        this.endTime = duration;
      }

      // Video is ready
      this.totalDuration.forEach(element => {
          element.innerHTML = this.getFormattedTime(duration);
      });

      
      const getCurrentDuration = window.localStorage.getItem(`duration_${this.video.id}`) || 0;
      if(parseInt(getCurrentDuration) > this.startTime && parseInt(getCurrentDuration) < (this.endTime-20)){
        this.seekTo(parseInt(getCurrentDuration));
      }else{
        this.seekTo(this.startTime);
      }
      
      this.onVideoPlayback();
      document.getElementById(this.elementId).classList.remove('loading');

      // Add progress bar event listeners
      const progressContainer = document.getElementById('progressContainer');
      const progressHandle = document.getElementById('progressHandle');
      
      if (progressContainer) {
        progressContainer.addEventListener('mousedown', this.handleProgressDragStart);
        document.addEventListener('mousemove', this.handleProgressDrag);
        document.addEventListener('mouseup', this.handleProgressDragEnd);
      }

      // Add sound slider event listener
      const soundSlider = document.getElementById('soundSlider');
      const soundValue = document.getElementById('soundValue');
      if (soundSlider && soundValue) {
        soundSlider.addEventListener('input', (e) => {
          const sound = parseFloat(e.target.value);
          this.setVolume(sound);
          soundValue.textContent = `${sound}%`;
        });
      }

      this.loaded = true;
    }

    /**
     * Get the total duration of the video in seconds
     * @returns {number|null} Duration in seconds or null if not available
     */
    getDuration() {
      console.log(this.endTime - this.startTime);
      if (this.player && typeof this.player.getDuration === 'function') {
        if(this.endTime > 0 && this.endTime - this.startTime > 0){
          return this.endTime - this.startTime;
        }
        return this.player.getDuration() - this.startTime;
      }
      return null;
    }

    /**
     * Get the current playback time in seconds
     * @returns {number|null} Current time in seconds or null if not available
     */
    getCurrentTime() {
      if (this.player && typeof this.player.getCurrentTime === 'function') {
          return this.player.getCurrentTime();
      }
      return null;
    }

    /**
     * Format seconds into HH:MM:SS or MM:SS format
     * @param {number} time - Time in seconds
     * @returns {string} Formatted time string
     */
    getFormattedTime(time) {
      if (time === null || isNaN(time) || time <= 0) return '00:00';
      
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);

      return `${hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    
      // return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * Pause the video playback
     */
    pause() {
      if (this.player && typeof this.player.pauseVideo === 'function') {
        this.player.pauseVideo();
      }
    }

    /**
     * Start or resume video playback
     */
    play() {
      if (this.player && typeof this.player.playVideo === 'function') {
        this.player.playVideo();
      }
    }

    /**
     * Change the current video
     * @param {string} videoId - New YouTube video ID
     * @param {Object} options - Additional options
     * @param {number} options.startTime - Start time in seconds
     * @param {number} options.endTime - End time in seconds
     */
    changeVideo(videoId, {startTime = 0, endTime = 0}) {
      if (this.player && typeof this.player.cueVideoById === 'function') {
        this.videoId = videoId;
        this.player.cueVideoById(videoId);
        this.startTime = startTime;
        this.endTime = endTime;
        setTimeout(() => {
          this.onPlayerReady();
          this.play();
        }, 1000);
      }
    }

    /**
     * Seek to a specific time in the video
     * @param {number} seconds - Time in seconds to seek to
     */
    seekTo(seconds) {
      if (this.player && typeof this.player.seekTo === 'function') {
        this.player.seekTo(seconds, true);
        this.videoPlaybackTime.forEach(element => {
          element.innerHTML = this.getFormattedTime(seconds - this.startTime);
        });
      }
    }

    /**
     * Set the player volume
     * @param {number} volume - Volume level (0-100)
     */
    setVolume(volume) {
      if (this.player && typeof this.player.setVolume === 'function') {
        // Ensure volume is between 0 and 100
        volume = Math.max(0, Math.min(100, volume));
        this.player.setVolume(volume);
      }
    }

    /**
     * Get the current volume level
     * @returns {number} Current volume (0-100)
     */
    getVolume() {
      if (this.player && typeof this.player.getVolume === 'function') {
        return this.player.getVolume();
      }
      return 0;
    }

    /**
     * Mute the video
     */
    mute() {
      if (this.player && typeof this.player.mute === 'function') {
        this.player.mute();
      }
    }

    /**
     * Unmute the video
     */
    unMute() {
      if (this.player && typeof this.player.unMute === 'function') {
        this.player.unMute();
      }
    }

    /**
     * Check if the video is muted
     * @returns {boolean} True if muted, false otherwise
     */
    isMuted() {
      if (this.player && typeof this.player.isMuted === 'function') {
        return this.player.isMuted();
      }
      return false;
    }

    /**
     * Handle video playback updates
     * Updates progress bar and dispatches playback events
     */
    onVideoPlayback(){
      const storageTime =  parseInt(window.localStorage.getItem(`duration_${this.video.id}`)) || 0;
      const currentTime = this.getCurrentTime()>storageTime ? this.getCurrentTime() : !this.loaded ? storageTime : this.getCurrentTime();
      window.localStorage.setItem(`duration_${this.video.id}`, currentTime);
      if(this.endTime>0 && currentTime >= this.endTime){
        this.player.stopVideo();
        window.localStorage.setItem(`duration_${this.video.id}`, 0);
        document.dispatchEvent(new CustomEvent('video:ended'));
      }
      
      // Update progress bar only if not dragging
      const totalTime = this.endTime - this.startTime;
      if(totalTime > 0){
        const percent = ((currentTime - this.startTime) / totalTime);
        this.updateProgressBar(percent);
      }else{
        this.updateProgressBar(0);
      }
      this.videoPlaybackTime.forEach(element => {
          element.innerHTML = this.getFormattedTime(currentTime - this.startTime);
      });

    }

    /**
     * Handle player errors and attempt recovery
     * @param {Object} event - YouTube player error event
     */
    onPlayerError(event) {
      console.log('YouTube Player Error:', event);
      if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`Retrying initialization (${this.retryCount}/${this.maxRetries})...`);
          setTimeout(() => {
              this.onYouTubeIframeAPIReady();
          }, 1000 * this.retryCount);
      } else {
          console.error('Failed to initialize YouTube player after multiple attempts');
          const elem = document.getElementById(this.elementId);
          if (elem) {
              elem.innerHTML = '<div class="error-message">Failed to load video. Please refresh the page.</div>';
          }
      }
    }

    /**
     * Handle player state changes (playing, paused, ended, etc.)
     * @param {Object} event - YouTube player state change event
     */
    onPlayerStateChange(event) {
      switch (event.data) {
        case YT.PlayerState.PLAYING:
          document.dispatchEvent(new CustomEvent('video:playing'));
          
          console.log('Video is playing');
          this.isPlaying = true;
          if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
          }
          this.playbackInterval = setInterval(() => {
            this.onVideoPlayback();
          }, 300);
          break;
        case YT.PlayerState.PAUSED:
          this.isPlaying = false;
          if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
          }
          const event = new CustomEvent('video:paused', {
              detail: {
                  currentTime: this.getCurrentTime(),
                  formattedTime: this.getFormattedTime(this.getCurrentTime())
              }
          });
          document.dispatchEvent(event);
          break;
        case YT.PlayerState.ENDED:
          document.dispatchEvent(new CustomEvent('video:ended'));
          console.log('Video has ended');
          this.isPlaying = false;
          if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
          }
          break;
        case YT.PlayerState.BUFFERING:
          console.log('Video is buffering');
          break;
        case YT.PlayerState.CUED:
          this.isPlaying = false;
          this.loaded = false;
          if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
          }
          break;
      }
    }

    /**
     * Update the progress bar visual elements
     * @param {number} percent - Progress percentage (0-1)
     */
    updateProgressBar(percent){
      const progressBar = document.getElementById('progressBar');
      const progressHandle = document.getElementById('progressHandle');
      if (progressBar && progressHandle) {
        progressBar.style.width = `${percent * 100}%`;
        progressHandle.style.left = `${percent * 100}%`;
      }
    }

    /**
     * Handle the start of progress bar dragging
     * @param {MouseEvent} e - Mouse event
     */
    handleProgressDragStart(e) {
      
      if(this.isDragging) return;
      const progressContainer = document.getElementById('progressContainer');
      const rect = progressContainer.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

      // Update visual position
      this.updateProgressBar(percent);
      this.seekTo(this.startTime + (this.endTime - this.startTime) * percent);
      this.isDragging = true;
    }

    /**
     * Handle progress bar dragging
     * @param {MouseEvent} e - Mouse event
     */
    handleProgressDrag(e) {
      if (!this.isDragging) return;
      
      const progressContainer = document.getElementById('progressContainer');
      const rect = progressContainer.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      
      // Update visual position
      this.updateProgressBar(percent);
      this.seekTo(this.startTime + (this.endTime - this.startTime) * percent);
    }

    /**
     * Handle the end of progress bar dragging
     * @param {MouseEvent} e - Mouse event
     */
    handleProgressDragEnd(e) {
      this.isDragging = false;
    }

    setCCEnabled(enabled) {
      if (this.player && typeof this.player.loadModule === 'function') {
        if (enabled) {
          this.player.loadModule('captions');
        } else {
          this.player.unloadModule('captions');
        }
      }
    }

    setCCLanguage(langCode) {
      if (this.player && typeof this.player.setOption === 'function') {
        this.player.setOption('captions', 'track', {'languageCode': langCode});
      }
    }

    getAvailableCCLanguages() {
      if (this.player && typeof this.player.getOption === 'function') {
        return this.player.getOption('captions', 'tracklist') || [];
      }
      return [];
    }

    getCurrentCCLanguage() {
      if (this.player && typeof this.player.getOption === 'function') {
        const track = this.player.getOption('captions', 'track');
        return track ? track.languageCode : null;
      }
      return null;
    }

    /**
     * Set the video playback rate
     * @param {number} rate - Playback rate (0.25 to 2)
     */
    setPlaybackRate(rate) {
      if (this.player && typeof this.player.setPlaybackRate === 'function') {
        // Ensure rate is between 0.25 and 2
        rate = Math.max(0.25, Math.min(2, rate));
        this.player.setPlaybackRate(rate);
      }
    }

    /**
     * Get the current playback rate
     * @returns {number} Current playback rate
     */
    getPlaybackRate() {
      if (this.player && typeof this.player.getPlaybackRate === 'function') {
        return this.player.getPlaybackRate();
      }
      return 1;
    }
  }
  

  window.ytPlayer = new YouTubePlayer('courseVideoPlayer');
  
  // Wait for the YouTube API to be ready
  document.addEventListener('YTReady', (e) => {
    const cb = () => {
      window.ytInterface = new YTInterface();
      window.ytInterface.init();
    }
    window.ytPlayer.onYouTubeIframeAPIReady(cb);
});



  