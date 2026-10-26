import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'

// Global palette and styles for controls rendered through portals.
document.body.classList.add(...[
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)]:rounded-[22px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)]:bg-white!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)]:[box-shadow:0_25px_80px_#081c414d]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)]:pt-[25px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)]:pr-[25px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)]:pb-[23px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)]:pl-[25px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)]:text-[#4f698b]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)]:text-[length:14px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)]:border!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)]:border-solid!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)]:border-[#bdcee8]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-title]:text-[#36577e]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-title]:text-[length:22px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-title]:tracking-[-.025em]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-title]:leading-[1.35]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-title]:font-[650]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-title]:pt-[10px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-html-container]:text-[#657b97]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-html-container]:text-[length:14px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-html-container]:leading-[1.75]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-actions]:gap-[9px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-actions]:mt-[22px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-styled]:rounded-[10px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-styled]:pt-[10px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-styled]:pr-[17px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-styled]:pb-[10px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-styled]:pl-[17px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-styled]:text-[length:13px]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-styled]:font-semibold!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-styled]:[box-shadow:none]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-styled]:mt-0!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-styled]:mr-0!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-styled]:mb-0!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-styled]:ml-0!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-close]:text-[#879dbb]!",
  "[&_.swal2-container_.swal2-popup:not(.swal2-toast)_.swal2-close]:rounded-[9px]! [--app-ink:#142d50]!",
  "[--app-muted:#50647f]! [--app-blue:#1859d5]! [--app-cyan:#12c4e5]! [--app-line:#cbd8ea]!",
  "[--app-shadow:0_8px_24px_#1737660f,_0_2px_5px_#17376608]!"
].join(" ").split(' '));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
