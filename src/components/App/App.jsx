import React, { useState, useCallback, useEffect } from 'react';
import { Global, css } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { Loader } from 'react-feather';
import { v4 as uuidv4 } from 'uuid';

import PairForm from './PairForm';
import ChatRoom from './ChatRoom';

const { WS_URL } = process.env;

const App = () => {
  const theme = useTheme();

  const storedMe = JSON.parse(window.localStorage.getItem('me'));
  const [me, setMe] = useState(
    storedMe || { genderKey: 'F', filter: { genderKey: 'A' } },
  );
  const [isPairing, setIsPairing] = useState(false);
  const handlePairFormChange = useCallback((f) => {
    setMe((prev) => {
      const nextMe = { ...prev, ...f };
      localStorage.setItem('me', JSON.stringify(nextMe));
      return nextMe;
    });
  }, []);
  const handlePairFormSubmit = useCallback(() => {
    setIsPairing(true);
  }, []);

  const [pairedUser, setPairedUser] = useState(null);
  const isPaired = !!pairedUser;
  const [sock, setSock] = useState(null);
  const [mySockId, setMySockId] = useState(null);
  const [pairedSockId, setPairedSockId] = useState(null);
  const [messageEvents, setMessageEvents] = useState([]);
  useEffect(() => {
    if (isPairing) {
      const newSock = new WebSocket(WS_URL);
      newSock.onopen = () => {
        newSock.send(
          JSON.stringify({
            type: 'PAIR',
            payload: {
              user: me,
            },
          }),
        );
      };
      newSock.onclose = () => {
        setIsPairing(false);
        setPairedUser(null);
        setSock(null);
        setMySockId(null);
        setPairedSockId(null);
        setMessageEvents([]);
        // Tell the user that the paired one leaves.
      };
      newSock.onmessage = (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case 'PAIRED': {
            setSock(newSock);
            setMySockId(data.payload.mySockId);
            setPairedUser(data.payload.pairedUser);
            setPairedSockId(data.payload.pairedSockId);
            setIsPairing(false);
            break;
          }
          case 'RECEIVED': {
            setMessageEvents((prev) => [...prev, data]);
            break;
          }
          default: {
            break;
          }
        }
      };
    }
  }, [isPairing, me.genderKey, me.filter.genderKey]);

  const handleChatRoomFormSubmit = useCallback(
    (f) => {
      if (sock !== null) {
        const event = {
          id: uuidv4(),
          type: 'SEND',
          senderSockId: mySockId,
          receiverSockId: pairedSockId,
          payload: {
            message: {
              type: 'TEXT',
              payload: {
                text: f.text,
              },
            },
          },
        };
        setMessageEvents((prev) => [...prev, event]);
        sock.send(JSON.stringify(event));
      }
    },
    [mySockId, pairedSockId],
  );
  const handleChatRoomLeave = useCallback(() => {
    if (sock !== null) {
      sock.close();
    }
  }, [mySockId]);

  return (
    <>
      <Global
        styles={css`
          @keyframes spin {
            from {
              transform: rotate(0);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      />
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        `}
      >
        {(() => {
          if (isPaired) {
            return (
              <ChatRoom
                messageEvents={messageEvents}
                mySockId={mySockId}
                onSubmit={handleChatRoomFormSubmit}
                onLeave={handleChatRoomLeave}
              />
            );
          }
          if (isPairing) {
            return (
              <Loader
                size={50}
                color={theme.color.primary}
                css={css`
                  animation: 1s linear 0s infinite spin;
                `}
              />
            );
          }
          return (
            <PairForm
              me={me}
              onChange={handlePairFormChange}
              onSubmit={handlePairFormSubmit}
            />
          );
        })()}
      </div>
    </>
  );
};

export default App;
