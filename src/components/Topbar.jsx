import {
  Box,
  TextField,
  Button,
  IconButton,
  useTheme,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  Select,
  InputBase,
  MenuItem
} from '@mui/material';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { setLogout } from '../state';

import { ColorModeContext } from '../theme';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
// import axios from 'axios';
import { tokens } from '../theme';
let initialValues = {
  hoTen: '',
  email: '',
  sdt: '',
  diaChi: '',
};
const userSchema = yup.object().shape({
  hoTen: yup.string().required('Không được để trống'),
  email: yup.string().required('Không được để trống'),
  sdt: yup.string().required('Không được để trống'),
  // diaChi: yup.string().required('Không được để trống'),
});
const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  initialValues.hoTen = user.hoTen;
  initialValues.email = user.email;
  initialValues.sdt = user.sdt;
  initialValues.diaChi = user.diaChi;
  //console.log(user);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleHuy = () => {
    setOpen(false);
  };
  const handleFormSubmit = (values) => {
    // console.log(values);
    handleHuy();
  };
  return (
    <Box display="flex" justifyContent="end" p={2}>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        {/* Thong tin ca nhan */}
        <IconButton onClick={handleClickOpen}>
            <PersonOutlineIcon />
          </IconButton>
        <Box>
          <Dialog open={open}>
            <DialogTitle sx={{ textAlign: 'center' }}>
              THÔNG TIN CÁ NHÂN
            </DialogTitle>
            <DialogContent>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt="15px"
              >
                <Formik
                  onSubmit={handleFormSubmit}
                  initialValues={initialValues}
                  validationSchema={userSchema}
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
                        display="flex"
                        gap={3}
                        flexDirection="column"
                        width="500px"
                      >
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
                        />
                        <TextField
                          label="Số điện thoại"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.sdt}
                          name="sdt"
                          error={Boolean(touched.sdt) && Boolean(errors.sdt)}
                          helperText={touched.sdt && errors.sdt}
                        />

                        <TextField
                          label="Email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.email}
                          name="email"
                          error={
                            Boolean(touched.email) && Boolean(errors.email)
                          }
                          helperText={touched.email && errors.email}
                        />

                        <TextField
                          label="Địa chỉ"
                          multiline
                          rows={2}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.diaChi}
                          name="diaChi"
                          error={
                            Boolean(touched.diaChi) && Boolean(errors.diaChi)
                          }
                          helperText={touched.diaChi && errors.diaChi}
                        />
                        <Box display="flex" justifyContent="end" mt="15px">
                          <Button type="submit">Cập nhật</Button>
                          <Button onClick={handleHuy}>Hủy</Button>
                        </Box>
                      </Box>
                    </form>
                  )}
                </Formik>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>

        {/* <Box p={1}>
          <Typography
            sx={{
              '&:hover': {
                color: '#ffa366',
                cursor: 'pointer',
              },
            }}
            fontSize="17px"
            onClick={() => dispatch(setLogout())}
          >
            Đăng xuất
          </Typography>
        </Box> */}

        <FormControl variant="standard" value={user.hoTen} sx={{minWidth: "150px"}}>
          <Select
            value={user.hoTen}
            sx={{
              backgroundColor: colors.primary[400],
              borderRadius: '0.25rem',
              p: '0.25rem 1rem',
              '& .MuiSvgIcon-root': {
                pr: '0.25rem',
                width: '3rem',
                
              },
              '& .MuiSelect-select:focus': {
                backgroundColor: colors.primary[400],
              },
            }}
            input={<InputBase sx={{fontSize: "20px"}} />}
          >
            <MenuItem value={user.hoTen} onClick={handleClickOpen}>
              <Typography>{user.hoTen}</Typography>
            </MenuItem>
            <MenuItem onClick={() => dispatch(setLogout())}>Đăng xuất</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Topbar;
