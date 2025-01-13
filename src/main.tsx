import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import TabNavigation from './components/TabNavigation/TabNavigation'
import  BlobLayoutPage from './BlobLayoutPage'
import  SquaredLayoutPage from './SquaredLayoutPage'
import React from 'react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TabNavigation tabs={[
      {
        label: 'Blob Layout',
        element: <BlobLayoutPage />,
        id: 'blob-layout'
      },
      {
        label: 'Squared Layout',
        element: <SquaredLayoutPage />,
        id: 'squared-layout'
      }
    ]} />
  </StrictMode>,
)
