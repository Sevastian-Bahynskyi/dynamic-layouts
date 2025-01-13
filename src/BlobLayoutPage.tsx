import React from 'react';
import  { BlobLayout } from './components/BlobLayout/BlobLayout';

const BlobLayoutPage: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-slate-900">
          <BlobLayout
            container={{width: window.innerWidth, height: window.innerHeight}} 
            numBlobs={10}
            size={{from: 100, to: 150}}
            speed={{from: 0.1, to: 1}}
            opacity={0.8}
          />
        </div>
      );
};

export  default BlobLayoutPage;