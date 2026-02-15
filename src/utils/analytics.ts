import ReactGA from 'react-ga4';

export const initGA = () => {
  const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID; // Access from environment variable
  
  if (gaId) {
    ReactGA.initialize(gaId);
    console.log('Google Analytics initialized with ID:', gaId);
  } else {
    console.warn('Google Analytics ID not found in environment variables (VITE_GOOGLE_ANALYTICS_ID). Analytics disabled.');
  }
};
