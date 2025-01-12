import React from 'react';
import  { BlobLayout } from './components/BlobLayout/BlobLayout';

const BlobLayoutPage: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-slate-900">
          <BlobLayout numBlobs={16}/>
        </div>
      );
};

export  { BlobLayoutPage };