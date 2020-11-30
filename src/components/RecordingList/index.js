import React from 'react'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function RecordingList(props) {
    

    // function onPlay(){
    //     const tmp = new Audio(JSON.parse(blob.blobString)["blobURL"]);
    //     tmp.play()
    // }

    console.log((props.blob.blobObject));

    function handleDelete () {
        props.deleteRecording(props.blob.id);
    }

    return (
            <tr key={props.blob.id} className="RecordingList">
                <td>{props.i + 1}</td>
                <td>{props.blob.recordingName}</td>
                <td>
                    {/* time: {(audioBlob.stopTime - audioBlob.startTime)*1000} seconds */}
                </td>
                {/* {console.log(JSON.parse(blob.blobString))} */}
                <td>
                    <AudioPlayer
                        src={props.blob.blobObject.blobURL}
                        // onPlay={onPlay}
                    />
                </td>
                <td>
                    <button onClick={handleDelete}>delete</button>
                </td>
            </tr>
    )
}
