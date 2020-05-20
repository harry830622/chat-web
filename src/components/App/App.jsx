import React, { useState, useCallback, useEffect } from 'react';
import { Global, css } from '@emotion/core';
import { Loader } from 'react-feather';
import { v4 as uuidv4 } from 'uuid';

import PairForm from './PairForm';
import ChatRoom from './ChatRoom';

const { WS_URL = 'ws://192.168.0.32:8080' } = process.env;

const App = () => {
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

  const [paired, setPaired] = useState(null);
  const isPaired = !!paired;
  const [sock, setSock] = useState(null);
  const [messageEvents, setMessageEvents] = useState([]);
  useEffect(() => {
    if (isPairing) {
      const newSock = new WebSocket(WS_URL);
      newSock.id = uuidv4();
      setSock((prev) => {
        if (prev !== null) {
          prev.close();
        }
        return newSock;
      });
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
      newSock.onmessage = (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case 'PAIRED': {
            setIsPairing(false);
            setMe((prev) => ({ ...prev, id: data.payload.myId }));
            setPaired(data.payload.paired);
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
          senderId: me.id,
          receiverId: paired.id,
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
    [sock?.id, me?.id, paired?.id],
  );

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
                myId={me.id}
                onSubmit={handleChatRoomFormSubmit}
              />
            );
          }
          if (isPairing) {
            return (
              <Loader
                size={100}
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
