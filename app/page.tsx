// app/page.tsx

import React from 'react';
import SquaredLayout from './components/background';
import { SquaredLayoutProps } from './props/squaredLayoutProps';

const HomePage: React.FC = () => {
  const squaredLayoutProps: SquaredLayoutProps = {
    paintedSquareRatio: 7,
    square: {
      defaultColor: '#0f172a',
      changeToDefaultColorInterval: {
        from: 2500,
        to: 3000
      }
    },
    gap: {
      size: 2,
      color: '#2e2e2e'
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <SquaredLayout {...squaredLayoutProps}></SquaredLayout>
    </div>
  );
};

export default HomePage;
