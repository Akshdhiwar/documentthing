import React, { ReactNode } from 'react';

interface FullScreenProps {
  children: ReactNode;
}

const FullScreen: React.FC<FullScreenProps> = ({ children }) => {
  return (
    <div className="h-dvh w-dvw  max-h-dvh overflow-auto">
      {children}
    </div>
  );
}

export default FullScreen;


