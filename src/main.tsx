import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import  { BlobLayoutPage } from './BlobLayoutPage'
import React from 'react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BlobLayoutPage />
  </StrictMode>,
)
