import React, { useState } from 'react';

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState('Details');

  const tabs = ['Details', 'Shipping', 'Returns'];

  const tabContent = {
    Details: (
      <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
        <p>Voted 2023's best goggles by GogglesGlobal. These low temp goggles provide clear vision with zero fogging protection.</p>
        <p>Voted 2023's best goggles by GogglesGlobal. These low temp goggles provide clear vision with zero fogging protection.</p>
        <p>Voted 2023's best goggles by GogglesGlobal. These low temp goggles provide clear vision with zero fogging protection.</p>
      </div>
    ),
    Shipping: <div className="text-gray-600 text-sm">Standard shipping information goes here.</div>,
    Returns: <div className="text-gray-600 text-sm">Return policy details go here.</div>,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 relative">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              pb-2 px-6 text-xl transition-all duration-200 relative
              ${activeTab === tab 
                ? 'font-bold text-black border-b-[4px] border-[#8a2be2] -mb-[2px]' 
                : 'text-gray-400 font-normal hover:text-gray-600'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {tabContent[activeTab]}
      </div>
    </div>
  );
};

export default ProductTabs;