import { instanceOf } from 'prop-types';
import React, { useState } from 'react'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

let hertz125 = 0,
hertz250 = 0,
hertz500 = 0,
hertz1000 = 0,
hertz2000 = 0,
hertz4000 = 0,
hertz8000 = 0

// SET HERTZ VALUES TO NEGATIVE VALUE OF
// AVERAGE OF CHART VALUE NUMBERS PLUS 25
let hertzArr = [hertz125, hertz250, hertz500, hertz1000, hertz2000, hertz4000, hertz8000]
let audio;




export default function RecordingList(props) {
 
    // USE CHART VALUES TO ADJUST FILTER GAIN LEVELS
    hertzArr.forEach((hertzVal, i) => {
        let leftEar = props.leftEarDecibels[i],
        rightEar = props.rightEarDecibels[i];
        // TODO: FIND CORRECT VALUE FOR FILTER GAIN FROM CHART VALS
        // ========================================================
        if(leftEar && rightEar){
            hertzArr[i] = (Math.round(-(leftEar + rightEar) / 2)+25)
        }
    })

    function setAudioFilters(audioURL){
        // console.log('setting filters for: ', audioURL)
        // CREATE AUDIO PROCESSING CONTEXT AND FILTERS
        // audio = new Audio(audioURL);
        audio = document.createElement('audio');
        audio.src=audioURL
        audio.controls = true;
        // audio.preload = false;
        audio.crossOrigin = 'anonymous';
        audio.textContent = 'Your browser does not support the HTML5 audio element';
    
        // console.log(audio)
        // console.log(audio)// HTML audio element? work with already existent one?
        const context = new AudioContext();
        const audioSource = context.createMediaElementSource(audio);
    
        const filter1 = context.createBiquadFilter();
        const filter2 = context.createBiquadFilter();
        const filter3 = context.createBiquadFilter();
        const filter4 = context.createBiquadFilter();
        const filter5 = context.createBiquadFilter();
        const filter6 = context.createBiquadFilter();
        const filter7 = context.createBiquadFilter();    
    
    
        const filterArr = [filter1, filter2, filter3, filter4, filter5, filter6, filter7]
    
        filterArr.forEach((filter, index) => {
    
            let hertz,
                gainVal;
    
            switch (index){
                case 0:
                    hertz=125;
                    gainVal=hertzArr[0];
                    break;
    
                case 1:
                    hertz=250;
                    gainVal=hertzArr[1];
                    break;
        
                case 2:
                    hertz=500;
                    gainVal=hertzArr[2];
                    break;
    
                case 3:
                    hertz=1000;
                    gainVal=hertzArr[3];
                    break;
    
                case 4:
                    hertz=2000;
                    gainVal=hertzArr[4];
                    break;
    
                case 5:
                    hertz=4000;
                    gainVal=hertzArr[5];
                    break;
    
                default:
                    hertz=8000;
                    gainVal=hertzArr[6];
                    break;
            }
    
            // CONNECT THE MediaElementAudioSourceNode TO THE FILTERS/PANNERS
            // AND THE FILTERS/PANNERS TO THE DESTINATION  
            audioSource.connect(filter);
            filter.connect(context.destination);
            // CONFIGURE FILTERS
            filter.type = 'peaking';
            filter.frequency.value = hertz;
            filter.Q.value = 100;
            filter.gain.value = gainVal;
        })
        console.log('filterArr gain vals: \n','===========================');
        filterArr.forEach(filter=>{
            console.log(filter.gain.value)
        })

        return audio;
}

    // console.log(setAudioFilters(props.recording.audioURL))
    // setAudioFilters(props.recording.audioURL);c
    // console.log("audioEl: ",audioEl);
      
    // window.addEventListener('load', () => {
    // //     console.log(document.getElementById('player-td-'+props.recording.id))
    //     // document.getElementById('player-td-'+props.recording.id).innerHTML = '';
    //     console.log('fully loaded')
    //     document.getElementById('player-td-'+props.recording.id).innerHTML = setAudioFilters(props.recording.audioURL);
    // })

    async function handleDelete() {

        // DELETE FROM USER DATABASE
        props.deleteRecording(props.recording.id);


        //FIXME: DELETE FROM CLOUDINARY 
        const formData = new FormData()
        formData.append('upload_preset', 'xbbzgwk2');
        formData.append('resource_type', 'video');
        formData.append('api_key', process.env.CLOUDINARY_API_KEY);
        formData.append('api_secret', process.env.CLOUDINARY_API_SECRET);
        formData.append('public_id', props.recording.cloudinaryId);

        console.log('formData: ', formData)

        const options = {
            method: 'POST',
            body: formData,
        };

        const res = await fetch('https://api.Cloudinary.com/v1_1/zgscloud/video/destroy', options)
        const delConfirm = await res.json()
        console.log("delConfirm: ",delConfirm)
    }
    
    const audioHTML = setAudioFilters(props.recording.audioURL)

    return (
            <tr key={props.recording.id} className="RecordingList">
                <td>{props.recording.recordingName}</td>
                <td id={'player-td-'+props.recording.id} dangerouslySetInnerHTML={{__html: audioHTML.outerHTML}}>
                    {console.log((setAudioFilters(props.recording.audioURL)).outerHTML)}
                    {/* {audioElState ? console.log(audioElState) : null} */}
                    {/* <audio src={props.recording.audioURL} controls>Your browser does not support the HTML5 audio element</audio>&lt;-- unfiltered */}
                    {/* {audio.src ? audio : null} */}
                    {/* AUDIO PLAYER DYNAMICALLY GENERATED */}
                </td>
                <td id={'options-td-'+props.recording.id}>
                    <button onClick={handleDelete}>delete</button>
                    {/* <a href={"blob:" + props.recording.audioURL} download={props.recording.recordingName.split(' ').join('') + ".wav"}><button>Download</button></a> */}
                    {/* <a href={"blob:"+audio.src} download={props.recording.recordingName.split(' ').join('') + ".wav"}><button>Download</button></a> */}

                </td>
            </tr>
    )
}
