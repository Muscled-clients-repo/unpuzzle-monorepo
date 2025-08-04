import { PuzzleCheckInterface } from '../interface/puzzle-check.js';
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
import { fetchApi } from "../utils/api.js";
// import axios from 'https://esm.sh/axios';

export class PuzzleCheck {
    constructor() {
        this.endpoint = `/api/puzzel-checks`; 
        this.checkInterface = new PuzzleCheckInterface();
        this.checkInterface.init();
        this.data = "";
        
        // Use user ID for consistent socketId between frontend and backend
        if (window.USER_ID) {
            // New approach: use user ID
            this.userId = window.USER_ID;
            this.socketId = this.userId;
            console.log(`[DEBUG] PuzzleCheck using userId for streaming: ${this.userId}`);
        } else {
            // Fallback for cached versions or if USER_ID is not available
            const socketIdElement = document.querySelector('div[socketId]');
            this.socketId = socketIdElement ? socketIdElement.getAttribute('socketId') : 'fallback-' + Date.now();
            console.log(`[DEBUG] PuzzleCheck using fallback socketId: ${this.socketId}`);
        }
        
        this.streaming=false;
    }
    
    init() {
        // Use the server-configured Socket.IO URL
        const socketUrl = window.SOCKET_URL;
        
        const socket = io(socketUrl, {
            withCredentials: true,
            transports: ["websocket", "polling"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        
        socket.on('connect', () => {
            console.log('Connected to Socket.IO server:', socketUrl);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket.IO disconnected:', reason);
        });
        
        const eventName = `check-stream_${this.socketId}`;
        console.log(`[DEBUG] Listening for Socket.IO event: ${eventName}`);
        
        socket.on(eventName, (data) => {
            console.log(`[DEBUG] Received streaming data:`, data);
            if(this.streaming){
                this.data += data.message;
                this.checkInterface.showStream(this.data);
                // this.checkInterface.setLoading(false);
            } else {
                console.log(`[DEBUG] Not streaming, ignoring data`);
            }
        });

        document.addEventListener('puzzle-check:generate', () => {
            this.getCheck();
        });
    }

    async getCheck() {
        // console.log('getCheck');
        const duration = window.ytPlayer.getCurrentTime();
        const video = window.ytPlayer.video;
        this.checkInterface.setLoading(true);
        this.streaming=true;

        try {
            const response = await fetchApi(`${this.endpoint}?videoId=${encodeURIComponent(video.id)}&endTime=${encodeURIComponent(duration)}`);
            this.streaming=false;
            const {body} = await response.json();
            console.log("puzzle check data", body)
            this.checkInterface.data = body;
            this.checkInterface.totalScore=body.completion.length
            this.checkInterface.score=0
            this.checkInterface.index = 0
            setTimeout(this.checkInterface.updateCheck, 100);
        } catch (error) {
            // console.log(error)
            this.checkInterface.updateCheck({error: error.message});
            this.checkInterface.setLoading(false);
        }
    }   
}
