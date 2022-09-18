import React, { useState } from "react";
import {
  Typography,
  Button,
  Container,
  TextField,
  FormControl
} from "@mui/material";
import { Save } from "@mui/icons-material";
import Categories from "../components/categories";

// const useStyles = makeStyles({
//   field: {
//     marginTop: 20,
//     marginBottom: 20,
//     display: "block"
//   }
// });
const styles = {
  field: {
    marginTop: "20px",
    marginBottom: "20px",
    display: "block"
  },
  button: {
    marginTop: "20px",
    marginBottom: "20px",
    display: "flex",
    width: "120px"
  }
};

export default function Create() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [detailsError, setDetailsError] = useState(false);
  const [category, setCategory] = useState("notes");

  const clearTextFieldErrors = () => {
    setTitleError(false);
    setDetailsError(false);
  };

  const handleSetCategory = (value) => {
    setCategory(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearTextFieldErrors();

    if (title === "") setTitleError(true);
    if (details === "") setDetailsError(true);

    if (title && details) {
      console.log("title, details, category", title, details, category);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit} autoComplete="off" noValidate>
        <Typography
          variant="h6"
          color="textSecondary"
          component="h2"
          gutterBottom>
          Create a New Note
        </Typography>
        <TextField
          onChange={(e) => setTitle(e.target.value)}
          id="noteTitle"
          sx={styles.field}
          variant="outlined"
          color="secondary"
          label="Note Title"
          fullWidth
          required
          error={titleError}
        />
        <TextField
          onChange={(e) => setDetails(e.target.value)}
          id="noteDetails"
          sx={styles.field}
          variant="outlined"
          color="secondary"
          label="Details"
          multiline
          maxRows={4}
          fullWidth
          required
          error={detailsError}
        />

        <FormControl>
          <Categories categoryProps={{ category, handleSetCategory }} />
        </FormControl>

        <Button
          sx={styles.button}
          type="submit"
          color="primary"
          variant="contained"
          startIcon={<Save />}
          disableElevation>
          SAVE
        </Button>
      </form>
    </Container>
  );
}
