import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const genderKeys = ['M', 'F', 'A'];
const genderTextByKey = {
  M: '👨',
  F: '👩',
  A: '👩👨',
};

const PairForm = (props) => {
  const { me, onChange, onSubmit } = props;

  const [form, setForm] = useState(me);
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    const next = name
      .split('.')
      .reverse()
      .reduce(
        (prev, curr) => ({
          [curr]: prev,
        }),
        value,
      );
    setForm((prev) => ({
      ...prev,
      ...next,
    }));
  }, []);
  useEffect(() => {
    onChange(form);
  }, [onChange, form.genderKey, form.filter.genderKey]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit();
    },
    [onSubmit],
  );

  return (
    <form
      onSubmit={handleSubmit}
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      `}
    >
      <h2>I am a</h2>
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        {genderKeys
          .filter((key) => key !== 'A')
          .map((key) => {
            const inputId = `PairForm__MyGender--${key}`;
            return (
              <div
                key={key}
                css={css`
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: relative;
                  padding: 10px;
                  border-radius: 10px;
                  box-shadow: ${key === form.genderKey
                    ? 'inset 0 0 0 4px #1597ff, 0 15px 15px -10px rgba(0, 125, 225, 0.375)'
                    : 'none'};
                  font-size: 30px;
                `}
              >
                <label htmlFor={inputId}>{genderTextByKey[key]}</label>
                <input
                  type="radio"
                  id={inputId}
                  name="genderKey"
                  value={key}
                  checked={key === form.genderKey}
                  onChange={handleInputChange}
                  css={css`
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    visibility: hidden;
                  `}
                />
              </div>
            );
          })}
      </div>
      <h1>I want to chat with a</h1>
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        {genderKeys.map((key) => {
          const inputId = `PairForm__FilterGender--${key}`;
          return (
            <div
              key={key}
              css={css`
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                padding: 10px;
                border-radius: 10px;
                box-shadow: ${key === form.filter.genderKey
                  ? 'inset 0 0 0 4px #1597ff, 0 15px 15px -10px rgba(0, 125, 225, 0.375)'
                  : 'none'};
                font-size: 30px;
              `}
            >
              <label htmlFor={inputId}>{genderTextByKey[key]}</label>
              <input
                type="radio"
                id={inputId}
                name="filter.genderKey"
                value={key}
                checked={key === form.filter.genderKey}
                onChange={handleInputChange}
                css={css`
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  visibility: hidden;
                `}
              />
            </div>
          );
        })}
      </div>
      <input
        type="submit"
        value="Pair NOW!"
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 20px;
          margin-top: 30px;
          border: none;
          border-radius: 6px;
          background-color: #424874;
          box-shadow: 0 0 1px 0 rgba(8, 11, 14, 0.06),
            0 6px 6px -1px rgba(8, 11, 14, 0.1);
          color: #ffffff;
          font-size: 16px;
        `}
      />
    </form>
  );
};

PairForm.propTypes = {
  me: PropTypes.shape({
    genderKey: PropTypes.string.isRequired,
    filter: PropTypes.shape({
      genderKey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default PairForm;
