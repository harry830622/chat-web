import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const ChatRoom = (props) => {
  const { messageEvents, myId, onSubmit } = props;

  const [form, setForm] = useState({ text: '' });
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);
  const handleSubmit = useCallback(
    (f) => (e) => {
      e.preventDefault();
      setForm({ text: '' });
      onSubmit(f);
    },
    [onSubmit],
  );

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
      `}
    >
      <div
        css={css`
          flex-grow: 1;
        `}
      >
        {messageEvents.map((evt) => (
          <div
            key={evt.id}
            css={css`
              display: flex;
              flex-direction: ${evt.senderId === myId ? 'row-reverse' : 'row'};
            `}
          >
            <div>{evt.payload.message.payload.text}</div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit(form)}
        css={css`
          display: flex;
          flex-grow: 0;
        `}
      >
        <textarea
          rows="1"
          name="text"
          value={form.text}
          onChange={handleInputChange}
          css={css`
            resize: none;
            flex-grow: 1;
          `}
        />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
};

ChatRoom.propTypes = {
  messageEvents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  myId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ChatRoom;
