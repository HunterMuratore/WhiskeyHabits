import { useState } from 'react'

function Tooltip({ content, children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="custom-tooltip-container">
      {/* Content to be displayed */}
      {isHovered && (
        <div className="custom-tooltip-content">{content}</div>
      )}
      
      {/* Element to trigger tooltip */}
      <div
        className="custom-tooltip-trigger"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </div>
    </div>
  );
}

export default Tooltip