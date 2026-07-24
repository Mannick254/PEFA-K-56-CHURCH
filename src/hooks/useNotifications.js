
import { useState, useEffect } from 'react';

const useNotificationPermission = () => {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    const requestPermission = async () => {
      if (permission !== 'granted') {
        const newPermission = await Notification.requestPermission();
        setPermission(newPermission);
      }
    };

    requestPermission();
  }, [permission]);

  return permission;
};

export default useNotificationPermission;
