import { ScrollArea } from '@/components/ui/scroll-area';
import React, { ReactNode } from 'react';

interface FullScreenProps {
  children: ReactNode;
}

const FullScreen: React.FC<FullScreenProps> = ({ children }) => {
  return (
    <ScrollArea className="h-dvh w-dvw  max-h-dvh overflow-x-hidden">
      {children}
    </ScrollArea>
  );
}

export default FullScreen;


