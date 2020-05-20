import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const genderKeys = ['M', 'F'];
const genderTextByKey = {
  M: 'Male',
  F: 'Female',
};

const SignupForm = (props) => {
  const { onSubmit } = props;

  const [form, setForm] = useState({ name: '', genderKey: 'M' });
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
      onSubmit(f);
    },
    [onSubmit],
  );

  return (
    <form
      onSubmit={handleSubmit(form)}
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <label
        htmlFor="signup_form__name"
        css={css`
          display: none;
        `}
      >
        Name
      </label>
      <input
        type="text"
        required
        id="signup_form__name"
        name="name"
        value={form.name}
        onChange={handleInputChange}
        placeholder="Name"
      />
      {genderKeys.map((key) => {
        const inputId = `signup_form__gender--${key}`;
        return (
          <div key={key}>
            <label htmlFor={inputId}>{genderTextByKey[key]}</label>
            <input
              type="radio"
              id={inputId}
              name="genderKey"
              value={key}
              checked={key === form.genderKey}
              onChange={handleInputChange}
            />
          </div>
        );
      })}
      <input type="submit" value="Chat NOW!" />
    </form>
  );
};

SignupForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SignupForm;
