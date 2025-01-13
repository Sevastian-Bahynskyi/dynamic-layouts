import React, { useEffect } from 'react';
import { SquaredLayout } from './components/SquaredLayout/SquaredLayout';
import { SquaredLayoutConfig } from './types/squaredLayout';
import { Size } from './types/base';

const SquaredLayoutPage: React.FC = () => {
  const [container, setContainer] = React.useState<Size>({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => {
      setContainer({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  })

  const squaredLayoutProps: SquaredLayoutConfig = {
    paintedSquareRatio: 7,
    square: {
      defaultColor: '#0f172a',
      changeToDefaultColorInterval: {
        from: 2000,
        to: 4000
      },
      changeTransition: 2000
    },
    net: {
      width: 2,
      color: '#2e2e2e'
    },
    container: {
      width: container.width,
      height: container.height
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <SquaredLayout {...squaredLayoutProps} />
    </div>
  );
};

export default SquaredLayoutPage;
