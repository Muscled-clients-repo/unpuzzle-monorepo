import { PuzzleReflectInterface } from '../interface/puzzle-reflect.js';
// import axios from 'https://esm.sh/axios';

export class PuzzleReflect {
    constructor() {
        this.endpoint = `/api/puzzel-reflects`; 
        this.reflectInterface = new PuzzleReflectInterface();
        this.reflectInterface.init();

    }
    
    init() {
        console.log("init puzzle reflect core event listener");
        document.addEventListener('puzzle-reflect:generate', async(e) => {
            console.log(e.detail);
            if(e.detail.type === 'audio'){
                await this.createAudioReflect(e.detail.blob);
                this.reflectInterface.resetPuzzleReflect()
            }else if(e.detail.type === 'file'){
                // this.createFileReflect(e.detail.file);
            }else if(e.detail.type === 'loom-link'){
                // this.createLoomLinkReflect(e.detail.loomLink);
            }
        });
    }

    createAudioReflect=async(blob)=>{
        console.log("createAudioReflect");
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('video_id', window.ytPlayer.video.id);
        formData.append('endTime', window.ytPlayer.getCurrentTime());
        const response = await fetch(`${this.endpoint}/audio`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        // console.log(data);
        return data;
    }

    async getReflect() {
        console.log('getReflect');
        const duration = window.ytPlayer.getCurrentTime();
        const video = window.ytPlayer.video;
        this.reflectInterface.setLoading(true);

        try {
            const response = await fetch(`${this.endpoint}?videoId=${encodeURIComponent(video.id)}&endTime=${encodeURIComponent(duration)}`);
            const data = await response.json();
            this.reflectInterface.data = data;
            this.reflectInterface.totalScore=data.completion.length
            this.reflectInterface.score=0
            this.reflectInterface.updateReflect();
        } catch (error) {
            console.log(error)
            this.reflectInterface.updateReflect({error: error.message});
            this.reflectInterface.setLoading(false);
        }
    }   
}
