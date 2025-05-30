import { useEffect } from 'react';
import { useUserStore } from '@/stores/user-store';
import { getSession } from 'next-auth/react';
import axiosClient from '@/lib/axios';
import i18n from '@/lib/i18n';

export const useInitializeUser = () => {
  const {
    username,
    setUserName,
    setUserImage,
    setUserSubheader,
    setUserId,
    setEmail,
    setImpersonated,
    setExperiments,
    setLangcode,
  } = useUserStore();

  useEffect(() => {
    if (username === 'Guest') {
      getSession()
        .then(session => {
          if (session?.user) {
            axiosClient
              .post('/user/info', { langcode: '' })
              .then(res => {
                const langcode = res.data?.langcode;

                // Safely set the user data
                setUserId(session.user.id || '');
                setUserName(session.user.name || '');
                setUserImage(session.user.image || '');
                setUserSubheader(session.user.email || '');
                setEmail(session.user.email || '');
                setImpersonated(session.user.impersonated || false);
                setExperiments(session.user.experiments || {});

                if (langcode) {
                  setLangcode(langcode);
                  i18n.changeLanguage(langcode);
                }
              })
              .catch(err => {
                console.error('Error fetching user info:', err);
              });
          }
        })
        .catch(err => {
          console.error('Error fetching session:', err);
        });
    }
    // Add dependencies to useEffect to avoid potential bugs in future
  }, [
    username,
    setUserName,
    setUserImage,
    setUserSubheader,
    setUserId,
    setEmail,
    setImpersonated,
    setExperiments,
    setLangcode,
  ]);
};
