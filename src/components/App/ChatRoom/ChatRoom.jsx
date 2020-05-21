import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { ArrowUp, X } from 'react-feather';

const ChatRoom = (props) => {
  const { messageEvents, mySockId, onSubmit, onLeave } = props;

  const theme = useTheme();

  const textareaElem = useRef();

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
      textareaElem.current.focus();
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

  const handleCloseBtnClick = useCallback(() => {
    onLeave();
  }, [onLeave]);

  const textareaFontSize = 20;
  const maxNumTextreaLines = 5;
  const textareaLineHeight = 1.2;
  const numTextreaLines = form.text.split('\n').length;
  const textareaHeight =
    numTextreaLines * textareaLineHeight * textareaFontSize;
  const textareaMaxHeight =
    maxNumTextreaLines * textareaLineHeight * textareaFontSize;

  const textareaPaddingTop = 5;
  const textareaPaddingBottom = 5;
  const textareaPaddingLeft = 10;
  const textareaPaddingRight = 10;
  const textareaBorderRadius = textareaLineHeight * textareaFontSize;

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
          padding: 10px 7px;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
        `}
      >
        <X
          color={theme.color.primary}
          size={30}
          onClick={handleCloseBtnClick}
        />
      </div>
      <div
        css={css`
          flex-grow: 1;
          flex-shrink: 1;
          display: flex;
          flex-direction: column-reverse;
          padding: 0 7px;
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
                flex-direction: ${evt.senderSockId === mySockId
                  ? 'row-reverse'
                  : 'row'};
              `}
            >
              <p
                css={css`
                  padding-top: ${textareaPaddingTop}px;
                  padding-bottom: ${textareaPaddingBottom}px;
                  padding-left: ${textareaPaddingLeft}px;
                  padding-right: ${textareaPaddingRight}px;
                  border-radius: ${textareaBorderRadius}px;
                  margin: 0;
                  margin-top: 5px;
                  background-color: ${evt.senderSockId === mySockId
                    ? theme.color.primary
                    : theme.color.secondary};
                  font-size: ${textareaFontSize}px;
                  color: ${evt.senderSockId === mySockId ? 'white' : 'black'};
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
          padding: 10px 7px;
        `}
      >
        <textarea
          ref={textareaElem}
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
            padding: 5px 10px;
            border: none;
            border-radius: ${textareaBorderRadius}px;
            background-color: ${theme.color.secondary};
            font-size: ${textareaFontSize}px;
            line-height: ${textareaLineHeight};
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
            height: ${textareaLineHeight * textareaFontSize + 10}px;
            padding: 0;
            margin-left: 5px;
            border: none;
            border-radius: 6px;
            background-color: ${theme.color.primary};
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
  mySockId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
};

export default ChatRoom;
