//@ts-nocheck
import React, { useRef, useState } from 'react'

import { getFirebase } from '../../App'

import { Typography } from '@mui/material'
import { toast } from 'react-toastify'

import 'firebase/storage'

import uploadImg from '../../img/uploadImg.svg'
import useTranslations from '../../hooks/useTranslations'

import { v4 } from 'uuid'

const UploadButton = ({ imgRef }) => {
  const firebase = getFirebase()
  const ref = useRef(undefined)
  const [file, setFile] = useState(null)

  const translations = useTranslations()

  const handleClick = () => {
    if (ref) {
      return ref.current?.click()
    }
  }

  const handleUpload = async (event) => {
    if (!firebase) return

    const uploadedFile = event?.target.files[0]
    if (!uploadedFile) return

    const storage = firebase.storage()
    const storageRef = storage.ref('quizImg')
    const id = v4()

    try {
      await storageRef.child(id).put(uploadedFile)
      const url = await storage.ref(`quizImg/${id}`).getDownloadURL()
      console.log(url)
      setFile(url)
      toast.success(translations.alerts.uploadedpic)
    } catch (error) {
      console.log('error', error)
    }
  }

  const UploadBox = () => (
    <div onClick={() => handleClick()} className="upload-box">
      {file === null ? (
        <img
          src={uploadImg}
          alt="upload"
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <img
          id="coverImg"
          ref={imgRef}
          style={{ width: '100%', height: '100%' }}
          src={file}
          alt="quiz-cover"
        />
      )}
    </div>
  )

  return (
    <div>
      <UploadBox />
      <input
        type="file"
        ref={ref}
        accept=".png, .jpg, .jpeg"
        hidden
        onChange={handleUpload}
      />
    </div>
  )
}

export default UploadButton
