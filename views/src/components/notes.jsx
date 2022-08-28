import React, { Component, useState } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
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
import MuiDialogContent from "@material-ui/core/DialogContent";

import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { authMiddleWare } from "../util/auth";
import { useHistory } from "react-router-dom";

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
  dialogeStyle: {
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Notes({ classes }) {
  const [notes, setNotes] = useState("");
  const [noteDetails, setNoteDetails] = useState({
    title: "",
    body: ""
  });
  const [noteID, setNoteId] = useState("");
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const [uiLoading, setUiLoading] = useState(true);
  const [buttonType, setButtonType] = useState("");
  const [viewOpen, setViewOpen] = useState(false);

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
    setOpen(true);
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

  const DialogContent = withStyles((theme) => ({
    viewRoot: {
      padding: theme.spacing(2)
    }
  }))(MuiDialogContent);

  dayjs.extend(relativeTime);

  const handleClickOpen = () => {
    setNoteId("");
    setNoteDetails({
      title: "",
      body: ""
    });
    setButtonType("");
    setOpen(true);
  };

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Typography paragraph>Hello I am todo</Typography>
    </main>
  );
}

export default withStyles(styles)(Notes);
