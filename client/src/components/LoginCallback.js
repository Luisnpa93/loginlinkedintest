import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';

const LoginCallback = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const userParam = urlSearchParams.get('user');
    const accessTokenParam = urlSearchParams.get('accessToken');

    if (userParam && accessTokenParam) {
      const user = JSON.parse(decodeURIComponent(userParam));
      setUser(user);

      // Store the access token in the localStorage
      localStorage.setItem('accessToken', accessTokenParam);

      console.log(user); // Log user data to console
      navigate('/'); // Redirect to the home page or another protected route
    } else {
      const redirectTo = urlSearchParams.get('redirectTo');
      const message = urlSearchParams.get('message');

      if (redirectTo && message) {
        navigate(redirectTo, { state: { errorMessage: message } });
      } else {
        navigate('/login?error=Login failed');
      }
    }
  }, []);

  return (
    null
  );
};

export default LoginCallback;
