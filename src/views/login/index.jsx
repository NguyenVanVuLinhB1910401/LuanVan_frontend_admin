import { Box, Typography, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../state';
const initialValues = {
  taiKhoan: '',
  matKhau: '',
};

const loginSchema = yup.object().shape({
  taiKhoan: yup.string().required('Tài khoản không được để trống.'),
  matKhau: yup.string().required('Mật khẩu không được để trống.'),
});
const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleFormSubmit = async (values, onSubmitProps) => {
    //console.log(values);
    axios
      .post('http://localhost:3000/api/users/login', values)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setLogin({
              user: res.data.user,
              token: res.data.token,
            })
          );
          navigate('/');
        }
      })
      .catch((res) => {
        if (res.response.status === 400) {
          alert(res.response.data.message);
        }
      });
  };
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        m="0 auto"
        p="30px"
        width="40%"
        borderRadius="15px"
        sx={{
          background: colors.grey[900],
        }}
      >
        <Box textAlign="center" mb="20px">
          <Typography
            fontWeight="bold"
            fontSize="32px"
            color={colors.greenAccent[500]}
          >
            ADMIN LOGIN
          </Typography>
        </Box>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={loginSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box gap="30px"  display="flex" flexDirection="column">
                <TextField
                  label="Tài khoản"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.taiKhoan}
                  name="taiKhoan"
                  error={Boolean(touched.taiKhoan) && Boolean(errors.taiKhoan)}
                  helperText={touched.taiKhoan && errors.taiKhoan}
                />

                <TextField
                  label="Mật khẩu"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.matKhau}
                  name="matKhau"
                  error={Boolean(touched.matKhau) && Boolean(errors.matKhau)}
                  helperText={touched.matKhau && errors.matKhau}
                />

                <Button
                  type="submit"
                  sx={{
                    m: '10px 0',
                    p: '20px',
                    borderRadius: '10px',
                    backgroundColor: colors.greenAccent[600],
                    '&:hover': {
                      backgroundColor: colors.greenAccent[500],
                    },
                  }}
                >
                  <Typography variant="h5">Đăng nhập</Typography>
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Login;
