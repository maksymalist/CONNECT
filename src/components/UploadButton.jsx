import React, { useRef, useState } from "react";

import { getFirebase } from '../App'

import { Typography } from '@material-ui/core'
import { toast } from "react-toastify";

import Translations from '../translations/translations.json'

const UploadButton = () => {
    const firebase = getFirebase();
    const ref = useRef(undefined);
    const [file, setFile] = useState(null);

    const handleClick = () => {
        if (ref) {
            return ref.current?.click();
        }
    };

    const handleUpload = async (event) => {
        if (!firebase) return;

        const uploadedFile = event?.target.files[0];
        if (!uploadedFile) return;

        const storage = firebase.storage();
        const storageRef = storage.ref("quizImg");
        const listRef = await storage
        .ref(`quizImg/${uploadedFile.name}`)
        .getDownloadURL()
        .then((response) => {
            toast.success(Translations[localStorage.getItem('connectLanguage')].alerts.uploadedpic);
            setFile(response)
        })
        .catch(async (err) => {
            try {
                await storageRef.child(uploadedFile.name).put(uploadedFile)
                const url = await storage.ref(`quizImg/${uploadedFile.name}`).getDownloadURL()
                console.log(url)
                setFile(url)
                toast.success(Translations[localStorage.getItem('connectLanguage')].alerts.uploadedpic);
            } catch (error) {
                console.log("error", error);
            }
        })

    };

    const UploadBox = () => (
        <div onClick={() => handleClick()} className='upload-box'>
            {
                file === null ?
                <Typography variant='h3'>{Translations[localStorage.getItem('connectLanguage')].uploadbox.upload}</Typography>
                :
                <img id='coverImg' style={{width:'100%', height:'100%'}} src={file} alt='quiz-cover'/>
            }
        </div>
    )

    return (
        <div>
          <UploadBox/>
          <input
            type="file"
            ref={ref}
            accept=".png, .jpg, .jpeg"
            hidden
            onChange={handleUpload}
          />
        </div>
    );
};

export default UploadButton;