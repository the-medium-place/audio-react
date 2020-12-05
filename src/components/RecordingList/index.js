import React from 'react'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function RecordingList(props) {


    console.log((props.recording.audioURL));

    async function handleDelete() {
        props.deleteRecording(props.recording.id);
    }

    return (
            <tr key={props.recording.id} className="RecordingList">
                <td>{props.i + 1}</td>
                <td>{props.recording.recordingName}</td>
                <td>
                    {/* <AudioPlayer
                        src={props.recording.audioURL}
                        // onPlay={onPlay}
                    /> */}
                    <audio src={props.recording.audioURL} controls style={{ maxWidth: '100%' }}/>
                </td>
                <td>
                    <button onClick={handleDelete}>delete</button>
                    <a href={"blob:" + props.recording.audioURL} download={props.recording.recordingName.split(' ').join('') + ".wav"}><button>Download</button></a>
                </td>
            </tr>
    )
}
