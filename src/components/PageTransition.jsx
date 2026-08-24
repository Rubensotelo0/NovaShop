import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/PageTransition.css';

function PageTransition({ children }) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    });
  }, [location.key]);

  return (
    <div
      key={location.key}
      className={`page-transition ${visible ? 'visible' : ''}`}
    >
      {children}
    </div>
  );
}

export default PageTransition;