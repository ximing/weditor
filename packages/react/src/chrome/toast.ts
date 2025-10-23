export function toast(message: string): void {
  document.querySelectorAll('.deditor-toast').forEach((el) => el.remove())
  const el = document.createElement('div')
  el.className = 'deditor-toast'
  el.textContent = message
  document.body.appendChild(el)
  window.setTimeout(() => el.remove(), 2000)
}
