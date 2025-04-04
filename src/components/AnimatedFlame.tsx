import React from 'react';

const AnimatedFlame: React.FC = () => {
  return (
    <div className="sticky top-4">
      <div className="flame-wrapper">
        <div className="flame-container">
          <div className="flame red"></div>
          <div className="flame orange"></div>
          <div className="flame gold"></div>
          <div className="flame white"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedFlame;