import React, { ReactNode } from 'react';

interface FullScreenProps {
  children: ReactNode;
}

const FullScreen: React.FC<FullScreenProps> = ({ children }) => {
  return (
    <div className="w-screen h-screen max-h-screen">
      {children}
    </div>
  );
}

export default FullScreen;


