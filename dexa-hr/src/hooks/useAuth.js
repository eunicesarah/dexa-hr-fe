import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/index";

const ProtectedAuthorization = ({children, role}) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      } 

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (role && payload.role !== role) {
          navigate('/login');
          return;
        }
        setIsAuthorized(true);
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, role]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
}

export default ProtectedAuthorization;