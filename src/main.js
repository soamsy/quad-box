import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { error } from './stores/errorStore'

window.addEventListener('error', (e) => {
  error.set({ message: e.message, stacktrace: e.stack })
})

window.addEventListener('unhandledrejection', (e) => {
  error.set({
    message: (e.reason?.message || 'Unhandled promise rejection'),
    stacktrace: (e.reason?.stack || e.reason)
  })
})

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
