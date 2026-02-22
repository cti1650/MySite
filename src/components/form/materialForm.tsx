import React, { useState, useCallback, FC } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  Link as MuiLink,
  Typography,
  TextField,
  TextareaAutosize,
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import axios from 'axios';

const twitterUrl = '';

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contact: {
      '& .text': {
        fontSize: 'inherit',
      },
      '& .main-btn': {
        marginTop: theme.spacing(5),
        textAlign: 'center',
      },
      '& .contact-form': {
        marginTop: theme.spacing(5),
        fontSize: 'inherit',
        '& > * ': {
          marginBottom: theme.spacing(2),
        },
        '& .submit-btn': {
          display: 'flex',
          alignItems: 'center',
          '& > .icon, & > .icon-text': {
            marginLeft: theme.spacing(1),
          },
          '& > .icon-text': {
            fontSize: 'inherit',
          },
        },
      },
    },
  })
);

export const MaterialForm: FC = () => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({
    name: {
      error: false,
      message: '',
    },
    email: {
      error: false,
      message: '',
    },
    body: {
      error: false,
      message: '',
    },
  });

  const [openAlert, setOpenAlert] = useState(false);

  const validate = useCallback(
    (targetName?: string) => {
      const pattern =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/g;
      const param: any = {
        name: {
          error: name === '',
          message: '名前を入力してください',
        },
        email: {
          error: email === '' || !email.match(pattern),
          message: 'メールアドレスを入力してください',
        },
        body: {
          error: body === '',
          message: '内容を入力してください',
        },
      };

      let overrides: any = {};
      if (targetName) {
        overrides[targetName] = param[targetName];
      } else {
        overrides = param;
      }

      setError({
        ...error,
        ...overrides,
      });
      return !(name === '' || email || !email.match(pattern) || body === '');
    },
    [name, email, body, error]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      console.log('on submit');
      e.preventDefault();

      if (loading || success) return;

      // if (!validate()) {
      //   setLoading(false);
      //   return;
      // }
      setLoading(true);

      // fetch('/api/notion', {
      //   method: 'post', mode: 'cors', headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     name,
      //     mail: email,
      //     body,
      //   }),
      // });
      const database_id = process.env.NOTION_CONTACT_DATABASE_ID ?? '';
      console.log(
        'https://notion-flask-api-test.vercel.app/db/' + database_id + '/add'
      );
      //.post('https://notion-flask-api-test.vercel.app/db/' + database_id + '/add', {
      const data = new FormData();
      data.append('name', name);
      data.append('email', email);
      data.append('body', body);
      axios({
        method: 'post',
        url: `https://notion-flask-api-test.herokuapp.com/db/${database_id}/form/add/`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: data,
      })
        .then((res) => {
          console.log(res);
          if (res.status === 400) {
            throw new Error('Bad request');
          }
          if (res.status === 200) {
            setLoading(false);
            setSuccess(true);
            setOpenAlert(true);
          } else {
            throw new Error('Bad response');
          }
        })
        .catch(() => {
          setLoading(false);
          setOpenAlert(true);
        });
    },
    [loading, success, name, email, body]
  );
  const handleCloseAlert = useCallback(
    (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenAlert(false);
    },
    []
  );

  // useEffect(() => {
  //   fetch('/api/notion', {
  //     method: 'get'
  //   }).then(async res => {
  //     const json = await res.json()
  //     json.map(item => {
  //       console.log(item.properties)
  //     })
  //   })
  // }, [])

  return success ? (
    <section className="h-[300px] flex justify-center items-center">
      <div>
        <Typography className="text py-4 text-center">
          送信が完了しました！
        </Typography>
        <Typography className="text py-4 text-justify">
          改めてご連絡いたしますので、
          <br />
          今しばらくお待ちください。
        </Typography>
      </div>
    </section>
  ) : (
    <section className={classes.contact}>
      <Typography className="text py-4">
        お問い合わせがありましたら、
        {twitterUrl && (
          <span>
            <MuiLink
              href={twitterUrl}
              target="_blank"
              rel="noopener"
              aria-label="Twitter"
            >
              Twitter
            </MuiLink>
            からダイレクトメッセージを送っていただくか、
          </span>
        )}
        下のフォームからお問い合わせください。
      </Typography>
      <form
        className="contact-form flex flex-col space-y-4"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div>
          <TextField
            error={error.name.error}
            helperText={error.name.error && error.name.message}
            name="name"
            type="text"
            label="名前"
            variant="outlined"
            fullWidth
            onChange={(e) => setName(e.target.value)}
            onBlur={(e) => validate(e.target.name)}
          />
        </div>
        <div>
          <TextField
            error={error.email.error}
            helperText={error.email.error && error.email.message}
            name="email"
            type="text"
            label="メールアドレス"
            variant="outlined"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => validate(e.target.name)}
          />
        </div>
        <div>
          <TextField
            error={error.body.error}
            helperText={error.body.error && error.body.message}
            name="body"
            type="text"
            label="内容"
            InputProps={{
              inputComponent: TextareaAutosize,
              rows: 8,
            }}
            variant="outlined"
            fullWidth
            onChange={(e) => setBody(e.target.value)}
            onBlur={(e) => validate(e.target.name)}
          />
        </div>
        <div className="submit-btn">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || success}
          >
            送信
          </Button>
          <Snackbar open={openAlert} autoHideDuration={3000}>
            {success ? (
              <Alert onClose={handleCloseAlert} severity="success">
                送信が完了しました！
              </Alert>
            ) : (
              <Alert onClose={handleCloseAlert} severity="error">
                送信に失敗しました。時間を置いて再度送信してみてください。
              </Alert>
            )}
          </Snackbar>
        </div>
      </form>
    </section>
  );
};
