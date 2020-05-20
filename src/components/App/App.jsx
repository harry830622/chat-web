import React, { useState, useCallback, useEffect } from 'react';
import { css } from '@emotion/core';
import { v4 as uuidv4 } from 'uuid';

import SignupForm from './SignupForm';
import PairForm from './PairForm';
import ChatRoom from './ChatRoom';

const { WS_URL = 'ws://192.168.0.32:8080' } = process.env;

const App = () => {
  const storedMe = JSON.parse(window.localStorage.getItem('me'));
  const [me, setMe] = useState(storedMe || { filter: { genderKey: 'A' } });
  const isLoggedIn = !!me.name;
  const handleSignupFormSubmit = useCallback((u) => {
    setMe((prev) => {
      const nextMe = { ...u, filter: prev.filter };
      localStorage.setItem('me', JSON.stringify(nextMe));
      return nextMe;
    });
  }, []);

  const [isPairing, setIsPairing] = useState(false);
  const [paired, setPaired] = useState(null);
  const isPaired = !!paired;
  const [sock, setSock] = useState(null);
  const [messageEvents, setMessageEvents] = useState([]);
  const handlePairFormSubmit = useCallback((f) => {
    setMe((prev) => {
      const nextMe = { ...prev, filter: f };
      localStorage.setItem('me', JSON.stringify(nextMe));
      return nextMe;
    });
    setIsPairing(true);
  }, []);
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
  }, [isPairing, me.name, me.genderKey, me.filter.genderKey]);
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
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      `}
    >
      {isLoggedIn ? (
        isPaired ? (
          <ChatRoom
            messageEvents={messageEvents}
            myId={me.id}
            onSubmit={handleChatRoomFormSubmit}
          />
        ) : (
          <div
            css={css`
              display: flex;
              flex-direction: column;
            `}
          >
            <header
              css={css`
                font-size: 3rem;
              `}
            >
              {me.name}
            </header>
            <PairForm filter={me.filter} onSubmit={handlePairFormSubmit} />
          </div>
        )
      ) : (
        <SignupForm onSubmit={handleSignupFormSubmit} />
      )}
    </div>
  );
};

export default App;
