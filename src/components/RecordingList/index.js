import React from 'react'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function RecordingList({ blob, i }) {
    

    // function onPlay(){
    //     const tmp = new Audio(JSON.parse(blob.blobString)["blobURL"]);
    //     tmp.play()
    // }

    console.log(JSON.parse(blob.blobString));

    return (
            <tr key={blob.id} className="RecordingList">
                <td>{i + 1}</td>
                <td>{blob.recordingName}</td>
                <td>
                    {/* time: {(audioBlob.stopTime - audioBlob.startTime)*1000} seconds */}
                </td>
                {/* {console.log(JSON.parse(blob.blobString))} */}
                {/* <td>
                    <AudioPlayer
                        // src={JSON.parse(blob.blobString)["blobURL"]}
                        onPlay={onPlay}
                    />
                </td> */}
            </tr>
    )
}
