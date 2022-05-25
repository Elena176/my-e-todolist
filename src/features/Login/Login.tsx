import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from 'formik';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import {loginThunk} from './loginReducer';
import {useAppDispatch} from '../../app/store';
import {LoginParamsType} from '../../api/todolists-api';
import {selectIsLoggedIn} from './selectors';

type FormValuesType = {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {
  const dispatch = useAppDispatch();
  const isLoginIn = useSelector(selectIsLoggedIn)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validate: (values) => {
      /* const errors: Partial<Omit<LoginParamsType, 'captcha'>> = {};*/
      const errors: Partial<Pick<LoginParamsType, 'password' | 'email' | 'rememberMe'>> = {};
      if (!values.email) {
        errors.email = 'Required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      if (!values.password) {
        errors.password = 'Required';
      } else if (values.password.length < 3) {
        errors.password = 'Must be 3 characters or more';
      }
      return errors;
    },
    onSubmit: async (values: FormValuesType, formikHelpers: FormikHelpers<FormValuesType>) => {
      const action = await dispatch(loginThunk(values))
      if (loginThunk.rejected.match(action)) {
        if (action.payload?.fieldsErrors?.length) {
          const error = action.payload?.fieldsErrors[0];
          formikHelpers.setFieldError(error.error, error.field)
        }
      }
    },
  })

  if (isLoginIn) {
    return <Navigate to="/"/>
  }

  return <Grid container justifyContent={'center'}>
    <Grid item justifyContent={'center'}>
      <FormControl>
        <FormLabel>
          <p>To log in get registered
            <a href={'https://social-network.samuraijs.com/'}
               target={'_blank'} rel="noreferrer"> here
            </a>
          </p>
          <p>or use common test account credentials:</p>
          <p>Email: free@samuraijs.com</p>
          <p>Password: free</p>
        </FormLabel>
        {/*форма в которой будем работать*/}
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <TextField label="Email" margin="normal"
                       {...formik.getFieldProps('email')}/>
            {formik.touched.email && formik.errors.email && <div style={{color: 'red'}}>{formik.errors.email}</div>}
            <TextField type="password" label="Password"
                       margin="normal"
                       {...formik.getFieldProps('password')}
              /*  onChange={formik.handleChange}
                value={formik.values.password}
                name="password"
                onBlur={formik.handleBlur}*/
            />
            {formik.touched.password && formik.errors.password &&
                <div style={{color: 'red'}}>{formik.errors.password}</div>}
            <FormControlLabel label={'Remember me'} control={<Checkbox  {...formik.getFieldProps('rememberMe')}/>}/>
            <Button type={'submit'} variant={'contained'} color={'primary'}>
              Login
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  </Grid>
}
