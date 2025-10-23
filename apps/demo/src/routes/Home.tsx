import { DocEditor } from '@deditor/react'
import '@deditor/react/style.css'
import { sampleDoc } from '../sample-doc'
import { readImageFile } from '../upload'

export function Home(props: { theme: 'light' | 'dark' }) {
  return (
    <DocEditor
      theme={props.theme}
      defaultContent={sampleDoc}
      currentUser={{ id: 'local', name: 'You', color: '#4f81bd' }}
      uploadImage={readImageFile}
    />
  )
}
