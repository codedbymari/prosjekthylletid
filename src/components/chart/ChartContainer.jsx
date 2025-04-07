// src/components/chart/ChartContainer.jsx
import React, { useRef, useEffect, useState } from 'react';
import './ChartContainer.css';

const ChartContainer = ({ 
  children, 
  height = 450, 
  aspectRatio = 16/9,
  className = '',
  fullWidth = true
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });
  
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        const width = containerRef.current.clientWidth;
        const calculatedHeight = fullWidth ? width / aspectRatio : height;
        setDimensions({ 
          width, 
          height: Math.max(calculatedHeight, height) 
        });
      };
      
      updateDimensions();
      
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);
      
      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }
  }, [height, aspectRatio, fullWidth]);
  
  return (
    <div 
      className={`chart-container-wrapper ${className}`} 
      ref={containerRef}
      style={{ 
        height: `${dimensions.height}px`,
        minHeight: `${height}px`
      }}
    >
      <div className="chart-content">
        {React.Children.map(children, child => 
          React.isValidElement(child) ? 
            React.cloneElement(child, { 
              containerWidth: dimensions.width,
              containerHeight: dimensions.height
            }) : 
            child
        )}
      </div>
    </div>
  );
};

export default ChartContainer;