import { DocEditor } from '@deditor/react'
import '@deditor/react/style.css'
import { sampleDoc } from '../sample-doc'
import { readImageFile } from '../upload'

export function Home() {
  return (
    <DocEditor
      defaultContent={sampleDoc}
      currentUser={{ id: 'local', name: 'You', color: '#4f81bd' }}
      uploadImage={readImageFile}
    />
  )
}
