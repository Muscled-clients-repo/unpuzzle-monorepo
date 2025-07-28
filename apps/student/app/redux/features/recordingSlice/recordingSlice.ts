import { createSlice } from "@reduxjs/toolkit";

interface RecordingOptions {
    webcamBlob : null | string,
    screenBlob : null | string,
    webcamRecording: boolean,
    audioRecording: boolean,
}

const initialState : RecordingOptions = {
    webcamBlob: null,
    screenBlob: null,
    webcamRecording: false,
    audioRecording: false,
}

const recordingSlice = createSlice({
    name: 'recordingSlice',
    initialState,
    reducers: {
        setWebcamBlob : (state,action) =>{
            state.webcamBlob = action.payload
        },
        setScreenBlob : (state,action) =>{
            state.screenBlob = action.payload
        },
        setWebcamRecording : (state) => {
            state.webcamRecording = !state.webcamRecording;
        },
        setAudioRecording : (state) => {
            state.audioRecording = !state.audioRecording;
        }
    }
})

export const { setWebcamBlob, setScreenBlob, setWebcamRecording, setAudioRecording } = recordingSlice.actions;

export default recordingSlice.reducer;
