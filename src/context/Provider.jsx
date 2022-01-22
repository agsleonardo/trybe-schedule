/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { useState, useEffect, createContext } from 'react';
import usePersistedState from '../hooks/usePersistedState';

const { gapi } = window;
const blankImage = 'https://i.imgur.com/qEgz28w.png';

const CLIENT_ID = '21771173827-darl8kjorgcnu0chelaillutki3fqc5e.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCuU61dFOxsqTw0 wu8qvRSisl5nqTG4vbA';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

export const MyContext = createContext();

export function Provider({ children }) {
  const [minutes, setMinutes] = usePersistedState('minutes', 0);
  const [isSignedIn, changeSignedInState] = useState(false);
  const [colorId, setColorId] = usePersistedState('color',
    { color: '#33b679', name: 'Sálvia', id: '2' });
  const [scheduleValue, changeScheduleValue] = useState('');
  const [links, setLinks] = useState('');
  const [userImage, setUserImage] = usePersistedState('userImage', blankImage);
  const [loading, setLoading] = useState(true);

  const context = {
    minutes,
    isSignedIn,
    colorId,
    scheduleValue,
    setMinutes,
    setUserImage,
    userImage,
    changeSignedInState,
    setColorId,
    changeScheduleValue,
    loading,
    links,
    setLinks,
  };

  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(changeSignedInState);
        changeSignedInState(gapi.auth2.getAuthInstance().isSignedIn.get());
      })
        .catch((error) => console.log(`Error intialize:${error}`));

      gapi.client.load('calendar', 'v3').then(() => {
        setUserImage(gapi.auth2.getAuthInstance().currentUser.get()
          .getBasicProfile().getImageUrl());
        setLoading(false);
      }).catch(() => setLoading(false));
    });
  }, [setUserImage]);

  return (
    <MyContext.Provider value={ context }>
      {children}
    </MyContext.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};
