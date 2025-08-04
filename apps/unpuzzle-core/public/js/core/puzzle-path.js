import { PuzzlePathInterface } from '../interface/puzzle-path.js';
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
import { fetchApi } from "../utils/api.js";

export class PuzzlePath {
    constructor() {
        this.endpoint = `/api/puzzel-path`; 
        this.pathInterface = new PuzzlePathInterface();
        this.pathInterface.init();
        this.data = "";
        
        // Use user ID for consistent socketId between frontend and backend
        if (window.USER_ID) {
            // New approach: use user ID
            this.userId = window.USER_ID;
            this.socketId = this.userId;
            console.log(`[DEBUG] PuzzlePath using userId for streaming: ${this.userId}`);
        } else {
            // Fallback for cached versions or if USER_ID is not available
            const socketIdElement = document.querySelector('div[socketId]');
            this.socketId = socketIdElement ? socketIdElement.getAttribute('socketId') : 'fallback-' + Date.now();
            console.log(`[DEBUG] PuzzlePath using fallback socketId: ${this.socketId}`);
        }
        
        this.streaming = false;
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
        
        const eventName = `path-stream_${this.socketId}`;
        console.log(`[DEBUG] Listening for Socket.IO event: ${eventName}`);
        
        socket.on(eventName, (data) => {
            console.log(`[DEBUG] Received streaming data:`, data);
            if(this.streaming){
                this.data += data.message;
                this.pathInterface.showStream(this.data);
            } else {
                console.log(`[DEBUG] Not streaming, ignoring data`);
            }
        });

        document.addEventListener('puzzle-path:generate', () => {
            this.getPath();
        });
    }

    async getPath() {
        const duration = window.ytPlayer.getCurrentTime();
        const video = window.ytPlayer.video;
        console.log(`[DEBUG] Starting path generation for video ${video.id} at time ${duration}`);
        this.pathInterface.setLoading(true);
        this.streaming = true;
        this.data = "";
        console.log(`[DEBUG] Streaming set to true, socketId: ${this.socketId}`);

        try {
            const response = await fetchApi(`${this.endpoint}?videoId=${encodeURIComponent(video.id)}&endTime=${encodeURIComponent(duration)}`);
            this.streaming = false;
            if(response.ok){
                const {body} = await response.json();
                const newData={...video, puzzlePaths: body};
                // console.log(newData)
                this.pathInterface.updatePath(newData);
            }
        } catch (error) {
            // console.log(error)
            this.pathInterface.updatePath({error: error.message});
            this.pathInterface.setLoading(false);
        }
    }   
}
