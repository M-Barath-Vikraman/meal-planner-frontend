import { Amplify } from 'aws-amplify';

const rawDomain = import.meta.env.VITE_COGNITO_DOMAIN || 'https://ap-south-1h5wk04j2m.auth.ap-south-1.amazoncognito.com';
const cognitoDomain = rawDomain.replace(/^https?:\/\//, '').split('/')[0];

const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'ap-south-1_h5wK04j2m',
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '7ngr1t1fddt1pr8i0tf8tk506i',
      signUpVerificationMethod: 'code',
      loginWith: {
        oauth: {
          domain: cognitoDomain,
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [import.meta.env.VITE_COGNITO_REDIRECT_SIGN_IN || 'http://localhost:5173/auth/callback'],
          redirectSignOut: [import.meta.env.VITE_COGNITO_REDIRECT_SIGN_OUT || 'http://localhost:5173/login'],
          responseType: 'code',
        },
      },
    },
  },
};

// Configure Amplify globally
Amplify.configure(cognitoConfig);

export default cognitoConfig;
