import React, { createContext, useState, useContext, useCallback } from 'react';
import Drawer from '../components/admin/Drawer';

const DrawerContext = createContext();

export const useDrawer = () => useContext(DrawerContext);

export const DrawerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState('');

  const openDrawer = useCallback((newTitle, newContent) => {
    setTitle(newTitle);
    setContent(newContent);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    // Delay clearing content to allow for exit animation
    setTimeout(() => {
      setContent(null);
      setTitle('');
    }, 300);
  }, []);

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      <Drawer isOpen={isOpen} onClose={closeDrawer} title={title}>
        {content}
      </Drawer>
    </DrawerContext.Provider>
  );
};
