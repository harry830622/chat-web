import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { ArrowUp, X } from 'react-feather';

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
      if (f.text.trim().length !== 0) {
        onSubmit({
          ...f,
          text: f.text.trim(),
        });
      }
      setForm({ text: '' });
    },
    [onSubmit],
  );

  const textareaFontSize = 20;
  const maxNumTextreaLines = 5;
  const textareaLineHeight = 1.2;
  const numTextreaLines = form.text.split('\n').length;
  const textareaHeight =
    numTextreaLines * textareaLineHeight * textareaFontSize;
  const textareaMaxHeight =
    maxNumTextreaLines * textareaLineHeight * textareaFontSize;

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
          flex-grow: 0;
          flex-shrink: 0;
          display: flex;
          justify-content: flex-end;
        `}
      >
        <X color="#424874" size={30} />
      </div>
      <div
        css={css`
          flex-grow: 1;
          flex-shrink: 1;
          display: flex;
          flex-direction: column-reverse;
          overflow-y: auto;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          `}
        >
          {messageEvents.map((evt) => (
            <div
              key={evt.id}
              css={css`
                flex-grow: 0;
                flex-shrink: 0;
                display: flex;
                flex-direction: ${evt.senderId === myId
                  ? 'row-reverse'
                  : 'row'};
              `}
            >
              <p
                css={css`
                padding: 0.3rem 0.6rem;
                border-radius: 0.5rem;
                border-top-${
                  evt.senderId === myId ? 'left' : 'right'
                }-radius: 1rem;
                border-bottom-${
                  evt.senderId === myId ? 'left' : 'right'
                }-radius: 1rem;
                margin: 0.1rem;
                margin-${evt.senderId === myId ? 'right' : 'left'}: 0.5rem;
                background-color: ${
                  evt.senderId === myId ? '#424874' : '#f4eeff'
                };
                font-size: 1rem;
                color: ${evt.senderId === myId ? 'white' : 'black'};
                white-space: pre-line;
              `}
              >
                {evt.payload.message.payload.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={handleSubmit(form)}
        css={css`
          flex-grow: 0;
          flex-shrink: 0;
          display: flex;
          align-items: flex-end;
          padding: 7px;
        `}
      >
        <textarea
          rows={numTextreaLines}
          name="text"
          value={form.text}
          placeholder="Type a message..."
          onChange={handleInputChange}
          css={css`
            flex-grow: 1;
            box-sizing: content-box;
            height: ${textareaHeight}px;
            max-height: ${textareaMaxHeight}px;
            font-size: ${textareaFontSize}px;
            line-height: ${textareaLineHeight};
            border-radius: 6px;
            resize: none;
          `}
        />
        <button
          type="submit"
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 30px;
            padding: 0;
            margin-left: 5px;
            border: none;
            border-radius: 6px;
            background-color: #424874;
            color: #ffffff;
            box-shadow: 0 0 1px 0 rgba(8, 11, 14, 0.06),
              0 6px 6px -1px rgba(8, 11, 14, 0.1);
          `}
        >
          <ArrowUp color="#ffffff" size={20} />
        </button>
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
