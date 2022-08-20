import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
});

function Todo({ classes }) {
  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Typography paragraph>Hello I am todo</Typography>
    </main>
  );
}

export default withStyles(styles)(Todo);
