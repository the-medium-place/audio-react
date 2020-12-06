import React from 'react'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

// require('dotenv').config();

// const cloudinary = require('cloudinary').v2

// cloudinary.api.resources((err, res) => {
//     console.log(res)
// })
// cloudinary.config({
//     // cloudinary_url: process.env.CLOUDINARY_URL
//     cloud_name: 'zgscloud',
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })

console.log()



export default function RecordingList(props) {


    // console.log((props.recording.audioURL));

    async function handleDelete() {
        props.deleteRecording(props.recording.id);

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

    return (
            <tr key={props.recording.id} className="RecordingList">
                <td>{props.recording.recordingName}</td>
                <td>
                    <audio src={props.recording.audioURL} controls style={{ maxWidth: '100%' }}/>
                </td>
                <td>
                    <button onClick={handleDelete}>delete</button>
                    <a href={"blob:" + props.recording.audioURL} download={props.recording.recordingName.split(' ').join('') + ".wav"}><button>Download</button></a>
                </td>
            </tr>
    )
}
