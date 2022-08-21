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
  const history = useHistory();

  const [uiLoading, setUiLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [image, setImage] = useState();
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

  const handleUserDataChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value
    });
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const hanldeProfilePhoto = (event) => {
    event.preventDefault();
    setUiLoading(true);

    authMiddleWare(history);
    const authToken = localStorage.getItem("AuthToken");

    let form_data = new FormData();
    form_data.append("image", image);
    //form_data.append('content', this.state.content);
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .post("/user/image", form_data, {
        headers: {
          "content-type": "multipart/form-data"
        }
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        if (error.response.status === 403) {
          history.push("/login");
        }
        console.log(error);
        setUiLoading(false);
        setImageError("Error in posting the data");
      });
  };

  const updateFormValues = (event) => {
    event.preventDefault();
    setButtonLoading(true);

    authMiddleWare(history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    const formRequest = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      country: userData.country
    };
    axios
      .post("/user", formRequest)
      .then(() => {
        setButtonLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          history.push("/login");
        }
        console.log(error);
        setButtonLoading(false);
      });
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
        <Card className={clsx(classes.root, classes)}>
          <CardContent>
            <div className={classes.details}>
              <div>
                <Typography
                  className={classes.locationText}
                  gutterBottom
                  variant="h4">
                  {userData.firstName} {userData.lastName}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  type="submit"
                  size="small"
                  startIcon={<CloudUploadIcon />}
                  className={classes.uploadButton}
                  onClick={hanldeProfilePhoto}>
                  Upload Photo
                </Button>
                <input type="file" onChange={handleImageChange} />

                {imageError ? (
                  <div className={classes.customError}>
                    {" "}
                    Wrong Image Format || Supported Format are PNG and JPG
                  </div>
                ) : (
                  false
                )}
              </div>
            </div>
            <div className={classes.progress} />
          </CardContent>
          <Divider />
        </Card>

        <br />
        <Card className={clsx(classes.root, classes)}>
          <form autoComplete="off" noValidate>
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="First name"
                    margin="dense"
                    name="firstName"
                    variant="outlined"
                    value={userData.firstName}
                    onChange={handleUserDataChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Last name"
                    margin="dense"
                    name="lastName"
                    variant="outlined"
                    value={userData.lastName}
                    onChange={handleUserDataChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    margin="dense"
                    name="email"
                    variant="outlined"
                    disabled={true}
                    value={userData.email}
                    onChange={handleUserDataChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    margin="dense"
                    name="phone"
                    type="number"
                    variant="outlined"
                    disabled={true}
                    value={userData.phoneNumber}
                    onChange={handleUserDataChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="User Name"
                    margin="dense"
                    name="userHandle"
                    disabled={true}
                    variant="outlined"
                    value={userData.username}
                    onChange={handleUserDataChange}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Country"
                    margin="dense"
                    name="country"
                    variant="outlined"
                    value={userData.country}
                    onChange={handleUserDataChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions />
          </form>
        </Card>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          className={classes.submitButton}
          onClick={updateFormValues}
          disabled={
            buttonLoading ||
            !userData.firstName ||
            !userData.lastName ||
            !userData.country
          }>
          Save details
          {buttonLoading && (
            <CircularProgress size={30} className={classes.progess} />
          )}
        </Button>
      </main>
    );
  }
}

export default withStyles(styles)(Account);
