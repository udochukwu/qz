'use client';
import { Button } from '@/components/elements/button';
import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="200" height="200" viewBox="0 0 48 48">
    <path
      fill="#fbc02d"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path
      fill="#e53935"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path
      fill="#4caf50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path
      fill="#1565c0"
      d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const AppleIcon = () => (
  <svg
    fill="#000000"
    height="200px"
    width="200px"
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 22.773 22.773">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      {' '}
      <g>
        {' '}
        <g>
          {' '}
          <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"></path>{' '}
          <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z"></path>{' '}
        </g>{' '}
        <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{' '}
        <g> </g> <g> </g> <g> </g>{' '}
      </g>{' '}
    </g>
  </svg>
);

function getRedirectURLFromPath(path: string) {
  // Split on the last question mark
  const parts = path.split(/\?(?=[^\?]*$)/);

  // If there's no question mark, return null
  if (parts.length < 2) return '';

  // Parse the query string
  const searchParams = new URLSearchParams(parts[1]);

  // Get the redirectURL parameter
  return searchParams.get('customReferer') || '';
}

export default function SignInButtons() {
  const { t } = useTranslation();
  const [redirectUrl, setRedirectUrl] = useState<string>('/');

  useEffect(() => {
    const url = new URL(location.href);
    // if callbackURL is present, we want to include this, this is in the case of study.new or an action that requires auth
    // if this is present, we use this over a refer
    // we also know there is no "source button in this case
    // in the case that we do have a redirect url, we want to know the source i.e. study.new, etc.
    const redirectUrl = url.searchParams.get('callbackUrl') ?? '/';
    let customReferer = document.referrer ?? '';
    let sourceAction = '';

    if (redirectUrl !== '/') {
      const decodedRedirectUrl = decodeURIComponent(redirectUrl);
      customReferer = decodedRedirectUrl;
      sourceAction = getRedirectURLFromPath(decodedRedirectUrl);
    } else {
      sourceAction = url.searchParams.get('source_button') ?? '';
    }
    setRedirectUrl(redirectUrl);
  }, []);

  return (
    <>
      <Button
        size={'lg'}
        variant={'outline'}
        borderRadius={'20px'}
        boxShadow={'0px 1px 3px rgba(13, 13, 18, 0.05), 0px 1px 2px rgba(13, 13, 18, 0.04)'}
        border={0}
        width={'80%'}
        fontSize={{ base: 14, md: 16 }}
        onClick={() => signIn('google', { callbackUrl: redirectUrl })}>
        <GoogleIcon />
        <span>{t('auth.signIn.google')}</span>
      </Button>

      <Button
        size={'lg'}
        variant={'outline'}
        borderRadius={'20px'}
        boxShadow={'0px 1px 3px rgba(13, 13, 18, 0.05), 0px 1px 2px rgba(13, 13, 18, 0.04)'}
        border={0}
        width={'80%'}
        fontSize={{ base: 14, md: 16 }}
        onClick={() => signIn('apple', { callbackUrl: redirectUrl })}>
        <AppleIcon />
        <span>{t('auth.signIn.apple')}</span>
      </Button>
    </>
  );
}
