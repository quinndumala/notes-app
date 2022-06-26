import React from "react";
import PropTypes from "prop-types";
import { FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

export default function Categories({ categoryProps }) {
  const styles = {
    formControl: {
      margin: 0,
      padding: 0,
      display: "flex",
      wrap: "nowrap"
    }
  };

  const { category, handleSetCategory } = categoryProps;

  return (
    <>
      <FormLabel disabled>Note Category</FormLabel>
      <RadioGroup value={category} sx={styles.formControl}>
        <FormControlLabel
          onChange={(e) => handleSetCategory(e.target.value)}
          value="todos"
          control={<Radio />}
          label="Todos"
        />
        <FormControlLabel
          onChange={(e) => handleSetCategory(e.target.value)}
          value="reminders"
          control={<Radio />}
          label="Reminders"
        />
        <FormControlLabel
          onChange={(e) => handleSetCategory(e.target.value)}
          value="personal"
          control={<Radio />}
          label="Personal"
        />
        <FormControlLabel
          onChange={(e) => handleSetCategory(e.target.value)}
          value="work"
          control={<Radio />}
          label="Work"
        />
      </RadioGroup>
    </>
  );
}

Categories.propTypes = {
  categoryProps: PropTypes.shape({
    category: PropTypes.string,
    handleSetCategory: PropTypes.func
  })
};
