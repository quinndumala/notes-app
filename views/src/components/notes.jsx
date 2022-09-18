import React, { Component, useState } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@mui/material/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@mui/material/Dialog";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardContent from "@material-ui/core/CardContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { authMiddleWare } from "../util/auth";
import { useHistory } from "react-router-dom";
import { createRef } from "react";
import { useEffect } from "react";

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar,
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  submitButton: {
    display: "block",
    color: "white",
    textAlign: "center",
    position: "absolute",
    top: 14,
    right: 10
  },
  floatingButton: {
    position: "fixed",
    bottom: 0,
    right: 0
  },
  form: {
    width: "98%",
    marginLeft: 13,
    marginTop: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar,
  root: {
    minWidth: 470
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  pos: {
    marginBottom: 12
  },
  uiProgess: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "50%",
    top: "35%"
  },
  dialogStyle: {
    maxWidth: "50%"
  },
  viewRoot: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Notes({ classes }) {
  const [notes, setNotes] = useState([]);
  const [noteDetails, setNoteDetails] = useState({
    title: "",
    body: ""
  });
  const [noteId, setNoteId] = useState("");
  const [errors, setErrors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [uiLoading, setUiLoading] = useState(true);
  const [buttonType, setButtonType] = useState("");
  const [viewOpen, setViewOpen] = useState(false);

  const dialogRef = createRef(null);
  const history = useHistory();

  useState(() => {
    authMiddleWare(history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get("/notes")
      .then((response) => {
        setNotes(response.data);
        setUiLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleTextChange = (event) => {
    setNoteDetails({
      ...noteDetails,
      [event.target.name]: event.target.value
    });
  };

  const handleDeleteNote = (data) => {
    authMiddleWare(history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    let noteId = data.note.noteId;
    axios
      .delete(`deleteNote/${noteId}`)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditClickOpen = (data) => {
    setNoteDetails({
      title: data.note.title,
      body: data.note.body
    });
    setNoteId(data.note.noteId);
    setButtonType("Edit");
    setIsOpen(true);
  };

  const handleViewOpen = (data) => {
    setNoteDetails({
      title: data.note.title,
      body: data.note.body
    });
    setViewOpen(true);
  };

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  dayjs.extend(relativeTime);

  const handleClickOpen = () => {
    setNoteId("");
    setNoteDetails({
      title: "",
      body: ""
    });
    setButtonType("");
    setIsOpen(true);
  };

  const handleSubmit = (event) => {
    authMiddleWare(history);
    event.preventDefault();
    const userNote = {
      title: noteDetails.title,
      body: noteDetails.body
    };
    let options = {};
    if (buttonType === "Edit") {
      console.log("buttonType === Edit");
      options = {
        url: `/updateNote/${noteId}`,
        method: "put",
        data: userNote
      };
    } else {
      options = {
        url: "/addNote",
        method: "post",
        data: userNote
      };
    }
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios(options)
      .then(() => {
        setIsOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        setIsOpen(true);
        setErrors(error.response.data);
        console.log(error);
      });
  };

  const handleViewClose = () => {
    setViewOpen(false);
  };

  const handleClose = (event) => {
    setIsOpen(false);
  };

  if (uiLoading === true) {
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {uiLoading && (
          <CircularProgress size={150} className={classes.uiProgess} />
        )}
      </main>
    );
  } else {
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <IconButton
          className={classes.floatingButton}
          color="primary"
          aria-label="Add Note"
          onClick={handleClickOpen}>
          <AddCircleIcon style={{ fontSize: 60 }} />
        </IconButton>
        <Dialog
          ref={dialogRef}
          fullScreen
          open={isOpen}
          onClose={handleClose}
          TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {buttonType === "Edit" ? "Edit Note" : "Create a new Note"}
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleSubmit}
                className={classes.submitButton}>
                {buttonType === "Edit" ? "Save" : "Submit"}
              </Button>
            </Toolbar>
          </AppBar>

          <Toolbar />

          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="noteTitle"
                  label="Note Title"
                  name="title"
                  autoComplete="noteTitle"
                  helperText={errors.title}
                  value={noteDetails.title}
                  error={errors.title ? true : false}
                  onChange={handleTextChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="noteDetails"
                  label="Note Details"
                  name="body"
                  autoComplete="noteDetails"
                  multiline
                  minRows={25}
                  maxRows={25}
                  helperText={errors.body}
                  error={errors.body ? true : false}
                  onChange={handleTextChange}
                  value={noteDetails.body}
                />
              </Grid>
            </Grid>
          </form>
        </Dialog>

        <Grid container spacing={2}>
          {notes.map((note, i) => (
            <Grid key={i} item xs={12} sm={6}>
              <Card className={classes.root} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {note.title}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {dayjs(note.createdAt).fromNow()}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {`${note.body.substring(0, 65)}`}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleViewOpen({ note })}>
                    {" "}
                    View{" "}
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleEditClickOpen({ note })}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleDeleteNote({ note })}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          onClose={handleViewClose}
          aria-labelledby="customized-dialog-title"
          open={viewOpen}
          fullWidth
          classes={{ paperFullWidth: classes.dialogStyle }}>
          <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
            {noteDetails.title}
          </DialogTitle>
          <DialogContent className={classes.viewRoot} dividers>
            <TextField
              fullWidth
              id="noteDetails"
              name="body"
              multiline
              readOnly
              minRows={1}
              maxRows={25}
              value={noteDetails.body}
              InputProps={{
                disableUnderline: true
              }}
            />
          </DialogContent>
        </Dialog>
      </main>
    );
  }

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Typography paragraph>Hello I am notes view</Typography>
    </main>
  );
}

export default withStyles(styles)(Notes);
