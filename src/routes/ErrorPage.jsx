import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { REL_PATH } from '../api';

const ErrorPage = () => (
  <Grid container justify="center">
    <Grid item xs={5}>
      <h1>404 Not found</h1>
      <h3>
        <Link to={REL_PATH}>Take me back!</Link>
      </h3>
    </Grid>
  </Grid>
);

export default ErrorPage;
