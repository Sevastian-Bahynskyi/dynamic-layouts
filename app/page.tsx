// app/page.tsx

import React from 'react';
import SquaredLayout from './components/background';

const HomePage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <SquaredLayout paintedSquareRatio={7} colorChangeInterval={[1500, 3000]}></SquaredLayout>
    </div>
  );
};

export default HomePage;
