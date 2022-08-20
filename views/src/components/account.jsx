import React, { Component, useState } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Button,
  Grid,
  TextField
} from "@material-ui/core";

import clsx from "clsx";

import axios from "axios";
import { authMiddleWare } from "../util/auth";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar,
  root: {},
  details: {
    display: "flex"
  },
  avatar: {
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  locationText: {
    paddingLeft: "15px"
  },
  buttonProperty: {
    position: "absolute",
    top: "50%"
  },
  uiProgess: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "50%",
    top: "35%"
  },
  progess: {
    position: "absolute"
  },
  uploadButton: {
    marginLeft: "8px",
    margin: theme.spacing(1)
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 10
  },
  submitButton: {
    marginTop: "10px"
  }
});

function Account({ classes }) {
  const history = useHistory;

  const [uiLoading, setUiLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    username: "",
    country: "",
    profilePhoto: ""
  });

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    authMiddleWare(history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get("/user")
      .then((response) => {
        console.log(response.data);
        setUserData({
          firstName: response.data.userCredentials.firstName,
          lastName: response.data.userCredentials.lastName,
          email: response.data.userCredentials.email,
          phoneNumber: response.data.userCredentials.phoneNumber,
          country: response.data.userCredentials.country,
          username: response.data.userCredentials.username
        });

        setUiLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          history.push("/login");
        }
        console.log(error);
        setErrors(error);
      });
  }, []);

  const handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  const handleImageChange = (event) => {
    this.setState({
      image: event.target.files[0]
    });
  };
}
