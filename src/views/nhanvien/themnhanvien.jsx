import { Box, Typography, Button, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ClearIcon from '@mui/icons-material/Clear';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const initialValues = {
  hoTen: '',
  taiKhoan: '',
  matKhau: '',
  nhapLaiMK: '',
  email: '',
  sdt: '',
  diaChi: ''
};

const registerSchema = yup.object().shape({
  hoTen: yup.string().required('Họ tên không được để trống.'),
  taiKhoan: yup.string().required('Tài khoản không được để trống.'),
  matKhau: yup.string().required('Mật khẩu không được để trống.'),
  nhapLaiMK: yup.string().required('Không được để trống.'),
  email: yup.string().required('Email không được để trống.'),
  sdt: yup.string().required('Số điện thoại không được để trống.'),
  diaChi: yup.string().required('Địa chỉ không được để trống.'),
});
const ThemNhanVien = ({data, setData}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector(state => state.token);
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleHuy = () => {
    setOpen(false);
  };
  const handleFormSubmit = async (values, onSubmitProps) => {
    //console.log(values);
    if (values.matKhau === values.nhapLaiMK) {
        axios
      .post('http://localhost:3000/api/nhanviens', values, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
      })
      .then((res) => {
        if (res.status === 201) {
            toast.success("Thêm thành công");
            handleHuy();
            setData([...data, res.data.result]);
        }
      })
      .catch((res) => {
        if (res.response.status === 400) {
          toast.error(res.response.data.message);
        }
      });
    } else {
        toast.warning("Mật khẩu không khớp");
    }
  };
  return (
    <Box>
      <Button onClick={handleClickOpen}>
        Thêm nhân viên
      </Button>
      <Dialog open={open}>
        <DialogTitle>
          <Box display="flex" justifyContent="end">
            <ClearIcon onClick={handleHuy} />
          </Box>
        </DialogTitle>
        <DialogContent>
        <Box
        width="500px"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        m="0 auto"
        width="100%"
        borderRadius="15px"
      >
        <Box textAlign="center" mb="20px">
          <Typography
            fontWeight="bold"
            fontSize="32px"
            color={colors.greenAccent[500]}
          >
            THÊM NHÂN VIÊN
          </Typography>
        </Box>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={registerSchema}
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
              <Box
                display="grid"
                gap="15px"
                gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                sx={{
                  '& > div': 'span 2',
                }}
              >
                <>
                  <TextField
                    label="Họ tên"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.hoTen}
                    name="hoTen"
                    error={
                      Boolean(touched.hoTen) && Boolean(errors.hoTen)
                    }
                    helperText={touched.hoTen && errors.hoTen}
                    sx={{ gridColumn: 'span 1' }}
                  />

                <TextField
                  label="Tài khoản"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.taiKhoan}
                  name="taiKhoan"
                  error={Boolean(touched.taiKhoan) && Boolean(errors.taiKhoan)}
                  helperText={touched.taiKhoan && errors.taiKhoan}
                  sx={{ gridColumn: 'span 1' }}
                />
                <TextField
                  label="Email"
                  type="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: 'span 1' }}
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
                  sx={{ gridColumn: 'span 1' }}
                />
                
                <TextField
                  label="Số điện thoại"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.sdt}
                  name="sdt"
                  error={Boolean(touched.sdt) && Boolean(errors.sdt)}
                  helperText={touched.sdt && errors.sdt}
                  sx={{ gridColumn: 'span 1' }}
                />

                <TextField
               
                  label="Nhập lại mật khẩu"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.nhapLaiMK}
                  name="nhapLaiMK"
                  error={Boolean(touched.nhapLaiMK) && Boolean(errors.nhapLaiMK)}
                  helperText={touched.nhapLaiMK && errors.nhapLaiMK}
                  sx={{ gridColumn: 'span 1' }}
                />
                
                
                

                <TextField
                    label="Địa chỉ"
                    multiline
                    rows="2"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.diaChi}
                    name="diaChi"
                    error={Boolean(touched.diaChi) && Boolean(errors.diaChi)}
                    helperText={touched.diaChi && errors.diaChi}
                    sx={{ gridColumn: 'span 2' }}
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
                    gridColumn: 'span 2'
                  }}
                >
                  <Typography variant="h5">Thêm</Typography>
                </Button>
                  
                </>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
          
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ThemNhanVien;
  