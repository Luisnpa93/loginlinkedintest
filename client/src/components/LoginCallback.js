import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchUserAndToken = async () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const userParam = urlSearchParams.get('user');
  const accessTokenParam = urlSearchParams.get('accessToken');

  if (userParam && accessTokenParam) {
    return {
      user: JSON.parse(decodeURIComponent(userParam)),
      accessToken: accessTokenParam,
    };
  } else {
    throw new Error('Login failed');
  }
};

const LoginCallback = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const { data, error } = useQuery('userAndToken', fetchUserAndToken, {
    retry: false,
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/');
    },
    onError: (error) => {
      navigate(`/login?error=${error.message}`);
    },
  });

  return null;
};

export default LoginCallback;
