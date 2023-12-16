import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const info = await AsyncStorage.getItem('userInfo');
        const type = await AsyncStorage.getItem('userType');

        if (token) {
          setUserToken(token);
        }
        if (info) {
          setUserInfo(JSON.parse(info));
        }
        if (type) {
          setUserType(type);
        }
      } catch (error) {
        console.error('Error loading auth state', error);
      }
    };

    loadAuthState();
  }, []);

  const signIn = async (data) => {
    try {
      await AsyncStorage.setItem('userToken', data.token);

      if (data.user) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
        await AsyncStorage.setItem('userType', 'customer');
        setUserInfo(data.user);
        setUserType('customer');
      } else if (data.provider) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.provider));
        await AsyncStorage.setItem('userType', 'provider');
        setUserInfo(data.provider);
        setUserType('provider');
      }

      setUserToken(data.token);
    } catch (error) {
      console.error('Error signing in', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('userType');
      setUserToken(null);
      setUserInfo(null);
      setUserType(null);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const signUp = async (data) => {
    try {
      await AsyncStorage.setItem('userToken', data.token);

      if (data.user) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
        await AsyncStorage.setItem('userType', 'customer');
        setUserInfo(data.user);
        setUserType('customer');
      } else if (data.provider) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.provider));
        await AsyncStorage.setItem('userType', 'provider');
        setUserInfo(data.provider);
        setUserType('provider');
      }

      setUserToken(data.token);
    } catch (error) {
      console.error('Error signing up', error);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, userInfo, userType, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
