import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const genderKeys = ['M', 'F', 'A'];
const genderTextByKey = {
  M: 'Male',
  F: 'Female',
  A: 'All',
};

const PairForm = (props) => {
  const { filter, onSubmit } = props;

  const [form, setForm] = useState(filter);
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
      {genderKeys.map((key) => {
        const inputId = `pair_form__gender--${key}`;
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
      <input type="submit" value="Pair NOW!" />
    </form>
  );
};

PairForm.propTypes = {
  filter: PropTypes.shape({
    genderKey: PropTypes.string.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default PairForm;
