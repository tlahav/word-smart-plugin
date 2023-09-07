import React, { useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
}

const TabControl: React.FC<Props> = ({ categories }) => {
  const [activeTab, setActiveTab] = useState(categories[0].id);

  return (
    <div>
      <div className="tab-buttons">
        {categories.map(category => (
          <button
            key={category.id}
            className={activeTab === category.id ? 'active' : ''}
            onClick={() => setActiveTab(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {categories.map(category => (
          <div
            key={category.id}
            className={activeTab === category.id ? 'active' : 'hidden'}
          >
            {category.name} content here
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabControl;