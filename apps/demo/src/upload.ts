export const MAX_IMAGE_BYTES = 200 * 1024

export function readImageFile(file: File): Promise<{ src: string; alt?: string }> {
  if (file.size > MAX_IMAGE_BYTES) return Promise.reject(new Error('Upload failed'))
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve({ src: String(reader.result), alt: file.name })
    reader.onerror = () => reject(new Error('Upload failed'))
    reader.readAsDataURL(file)
  })
}
