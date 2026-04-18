import React from 'react';

const Breadcrumbs = () => {
  const paths = [
    { name: 'Home', link: '/' },
    { name: 'Mens', link: '/mens' },
    { name: 'Accessories', link: '/accessories' },
    { name: 'Goggles', link: '#' },
  ];

  return (
    <nav className="flex px-4 md:px-0 py-4 text-[10px] md:text-xs uppercase tracking-widest text-gray-400 font-sans">
      {paths.map((path, index) => (
        <div key={index} className="flex items-center">
          <a 
            href={path.link} 
            className={`hover:text-black transition-colors ${
              index === paths.length - 1 ? 'text-black font-bold' : ''
            }`}
          >
            {path.name}
          </a>
          {index < paths.length - 1 && (
            <span className="mx-2 text-gray-300">{'>'}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;