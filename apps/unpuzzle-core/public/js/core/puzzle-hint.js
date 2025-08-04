import { PuzzleHintInterface } from '../interface/puzzle-hint.js';
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
import { fetchApi } from "../utils/api.js";
// import axios from 'https://esm.sh/axios';

export class PuzzleHint {
    constructor() {
        this.endpoint = `/api/puzzle-hint`; 
        this.hintInterface = new PuzzleHintInterface();
        this.hintInterface.init();
        this.data = "";
        
        // Use user ID for consistent socketId between frontend and backend
        if (window.USER_ID) {
            // New approach: use user ID
            this.userId = window.USER_ID;
            this.socketId = this.userId;
            console.log(`[DEBUG] PuzzleHint using userId for streaming: ${this.userId}`);
        } else {
            // Fallback for cached versions or if USER_ID is not available
            const socketIdElement = document.querySelector('div[socketId]');
            this.socketId = socketIdElement ? socketIdElement.getAttribute('socketId') : 'fallback-' + Date.now();
            console.log(`[DEBUG] PuzzleHint using fallback socketId: ${this.socketId}`);
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

        const eventName = `hint-stream_${this.socketId}`;
        console.log(`[DEBUG] Listening for Socket.IO event: ${eventName}`);
        
        socket.on(eventName, (data) => {
            console.log(`[DEBUG] Received streaming data:`, data);
            if(this.streaming){
                this.data += data.message;
                this.hintInterface.showStream(this.data);
                this.hintInterface.setLoading(false);
            } else {
                console.log(`[DEBUG] Not streaming, ignoring data`);
            }
        });

        document.addEventListener('puzzle-hint:generate', () => {
            this.data = "";
            this.getHint();
        });
    }

    async getHint() {
        
        const duration = window.ytPlayer.getCurrentTime();
        const video = window.ytPlayer.video;
        console.log(`[DEBUG] Starting hint generation for video ${video.id} at time ${duration}`);
        this.hintInterface.setLoading(true);
        this.streaming=true;
        console.log(`[DEBUG] Streaming set to true, socketId: ${this.socketId}`);
        

        try {
            const response = await fetchApi(`${this.endpoint}?videoId=${encodeURIComponent(video.id)}&endTime=${encodeURIComponent(duration)}`);
            this.streaming=false;
            const {body} = await response.json();
            setTimeout(()=>{
                this.hintInterface.updateHint(body);
            }, 100);
        } catch (error) {
            this.hintInterface.updateHint({error: error.message});
            this.hintInterface.setLoading(false);
        }
    }   
}
