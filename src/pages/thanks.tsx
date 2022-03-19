import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Container,
  Button,
  Link as MuiLink,
  Typography,
  TextField,
  TextareaAutosize,
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import axios from 'axios';

const Thanks: NextPage = () => {
  return (
    <div className="w-full h-full px-10 font-n2i">
      <Head>
        <title>cti1650 Portfolio</title>
        <meta property="og:title" content="cti1650 Portfolio" />
      </Head>
      <div title="Contact">お問い合わせ</div>
      <Container maxWidth="xs">
        <section>
          <Typography className="text py-4">
            お問い合わせがありましたら、
            下のフォームからお問い合わせください。
          </Typography>
        </section>
      </Container>
    </div>
  );
};

export default Thanks;
