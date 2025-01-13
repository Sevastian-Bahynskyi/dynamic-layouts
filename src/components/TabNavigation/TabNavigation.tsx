import React, { useState, ReactElement } from 'react';

interface TabConfig {
  id: string;
  label: string;
  element: ReactElement;
}

interface TabNavigationProps {
  tabs: TabConfig[];
  defaultActiveTab?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, defaultActiveTab }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  const activeElement = tabs.find(tab => tab.id === activeTab)?.element || tabs[0]?.element;

  return (
    <>
      {/* Navigation with even frosted glass effect */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Backdrop overlay for consistent translucency */}
        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[8px]" />
        
        {/* Content container */}
        <div className="relative">
          <div className="flex gap-2 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-2 rounded-full transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-white/20'
                    : 'hover:bg-white/10'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {activeElement}
    </>
  );
};
export default TabNavigation;