export class PuzzlePathInterface {
    constructor() {
        this.agentPathButton = document.querySelector('.agent-button[agent="agent_button_path"]');
        this.courseContent = document.querySelector(".card-course-content")
        this.cardPath = document.querySelector('.card-path');
        this.cardPathButtons = document.querySelector('.card-path-buttons');
        this.pathPausedNotification = document.querySelector('.path-paused-notification');
    }

    setLoading = (isLoading) =>{
        if(isLoading){  
            this.courseContent.classList.add('loading');
        }else{
            this.courseContent.classList.remove('loading');
        }
    }

    activatePath = () =>{
        window.ytPlayer.pause();
        const prevActive = document.querySelector('.agent-button.active');
        if(prevActive){
            prevActive.classList.remove('active');
            prevActive.classList.add('disabled');
        }
        this.agentPathButton.classList.add('active');
        this.agentPathButton.classList.remove('disabled');
        this.cardPath.classList.remove('hidden');
        this.pathPausedNotification.classList.remove('hidden');
        // document.dispatchEvent(new CustomEvent('puzzle-path:generate'));
    }
    deactivatePath = () =>{
        this.cardPath.classList.add('hidden');
        this.pathPausedNotification.classList.add('hidden');
        console.log("deactivate the content")
    }

    media = (src, alt, classList) =>{
        return `<img src="${src}" alt="${alt}" class="${classList}" loading="lazy">`;
    }

    updatePath = (data) =>{
        // console.log(data);
        const videoData = {
            id: data.id,
            title: data.title,
            duration: data.duration,
            startTime: data.startTime,
            endTime: data.endTime,
            yt_video_id: data.yt_video_id,
        };
        
        try {
            const courseVideo = document.querySelector(`[course-video-id="${data.id}"]`);
            
            let bodyText = `
                <div class="flex justify-between items-center px-2 py-2 hover:bg-gray-200 cursor-pointer border border-[#00AFF0]" pathVideoId="${data.id}" data-video="${encodeURIComponent(JSON.stringify(videoData))}">
                    <span class="text-[14px]">${data.title}</span>
                    <span class="text-[14px]">${window.ytPlayer.getFormattedTime(data.duration)}</span>
                </div>
                <div class="w-full">
                    <div class="flex items-center gap-2 w-full bg-[#FD8E1F] p-[12px] pl-[32px]">
                        ${this.media(`${ASSET_ORIGIN}/img/icon-puzzle-path-white.png`, 'AI Agent', 'w-[19px] h-[14px] shrink-0 loaded')}
                        <span class="text-[14px] text-gray-500 w-full grow text-white">Puzzle Path Content</span>
                    </div>
                </div>
            `;
            
            data.puzzlePaths.forEach((puzzlePath) => {
                if(puzzlePath.video_details){
                    const puzzlePathData={
                        id: puzzlePath.video_details.id,
                        title: puzzlePath.video_details.title,
                        duration: puzzlePath.video_details.duration,
                        startTime: puzzlePath.video_details.start_time,
                        endTime: puzzlePath.video_details.end_time,
                        yt_video_id: puzzlePath.video_details.yt_video_id,
                    }
                    bodyText += `
                        <div class="flex items-center gap-2 w-full p-[12px] pl-[32px] hover:bg-gray-200 border-r border-l border-b border-[#00AFF0]" pathVideoId="${data.id}" data-video="${encodeURIComponent(JSON.stringify(puzzlePathData))}">
                            ${this.media(`${ASSET_ORIGIN}/img/icon-video.svg`, 'AI Agent', 'w-[21px] h-[16px] shrink-0 loaded')}
                            <span class="text-[14px] text-gray-500 w-full grow">${puzzlePath.video_details.title}</span>
                            <span class="text-[14px] text-gray-500">${window.ytPlayer.getFormattedTime(puzzlePath.video_details.duration)}</span>
                        </div>
                    `;
                }
            });
    
            // Update the inner HTML of the courseVideo element
            courseVideo.innerHTML = bodyText;
    
            // Add click event listener to each element with pathVideoId
            document.querySelectorAll(`[pathVideoId="${data.id}"]`).forEach(pathVideo => {
                pathVideo.addEventListener('click', (e) => {
                    const videoData = JSON.parse(decodeURIComponent(e.currentTarget.getAttribute('data-video')));
                    window.ytPlayer.video = videoData;
                    window.ytPlayer.videoId = videoData.yt_video_id;
                    window.ytPlayer.startTime = videoData.start_time;
                    window.localStorage.setItem(`duration_${videoData.id}`, videoData.start_time);
                    window.ytPlayer.endTime = videoData.end_time>0 ? videoData.end_time : videoData.duration;
                    window.ytPlayer.changeVideo(videoData.yt_video_id, { startTime: videoData.start_time, endTime: videoData.end_time });
                });
            });
    
        } catch (error) {
            console.error(error);
        } finally {
            this.setLoading(false);
        }
    }


    init = () =>{
        // card reset
        document.addEventListener('card-path:reset', () => {
            // set the card initial state like button change the button text and the attribute
            this.cardPath.classList.add('hidden');
        });

        this.cardPathButtons.querySelectorAll("button").forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('action');
                if(action === 'generate-path'){
                    document.dispatchEvent(new CustomEvent('puzzle-path:generate'));
                }else if(action === 'do-not-generate-path'){
                    this.deactivatePath();
                }
            });
        });
    }
}