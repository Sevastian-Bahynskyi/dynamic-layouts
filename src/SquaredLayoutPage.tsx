import React from 'react';
import { SquaredLayoutConfig } from './props/squaredLayoutConfig';
import { SquaredLayout } from './components/SquaredLayout/SquaredLayout';

const SquaredLayoutPage: React.FC = () => {
  const squaredLayoutProps: SquaredLayoutConfig = {
    paintedSquareRatio: 7,
    square: {
      defaultColor: '#0f172a',
      changeToDefaultColorInterval: {
        from: 1500,
        to: 4000
      },
      changeTransition: '2s ease'
    },
    net: {
      width: 2,
      color: '#2e2e2e'
    },
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <SquaredLayout {...squaredLayoutProps}></SquaredLayout>
    </div>
  );
};

export default SquaredLayoutPage;
