import {
    Box,
    // Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
  } from '@mui/material';
  import { useSelector } from 'react-redux';
  // import { useTheme } from '@mui/material';
  // import { tokens } from '../../theme';
  import { useState } from 'react';
  import { Formik } from 'formik';
  import * as yup from 'yup';
  import axios from "axios";
  import { toast } from 'react-toastify';
  const initialValues = {
    tenNCC: '',
    sdtNCC: '',
    emailNCC: '',
    diaChiNCC: ''
  };
  
  const nhaCungCapSchema = yup.object().shape({
    tenNCC: yup.string().required('Tên nhà cung cấp không được để trống'),
    sdtNCC: yup.string().required('Số điện thoại không được để trống'),
    emailNCC: yup.string().required('Email không được để trống'),
    diaChiNCC: yup.string().required("Địa chỉ nhà cung cấp không được để trống")
  });
  
  const FormDialog = ({data, setData}) => {
    const [open, setOpen] = useState(false);
    // const theme = useTheme();
    // const colors = tokens(theme);
    const token = useSelector((state) => state.token);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleHuy = () => {
      setOpen(false);
    };
  
    const handleFormSubmit = (values) => {
      // console.log(values);
      axios
        .post('http://localhost:3000/api/nhacungcaps', values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 201) {
            toast.success('Thêm nhà cung cấp thành công');
            //console.log(...data);
            // const result = {
            //     id: response.data.result._id,
            //     tenLoaiSP: response.data.result.tenLoaiSP
            // }
            setData([...data, response.data.result]);
            handleHuy();
          }
        })
        .catch((err) => console.log(err));
      
    };
  
    return (
      <Box>
        <Button variant="outlined" onClick={handleClickOpen}>
          Thêm nhà cung cấp
        </Button>
        <Dialog open={open}>
          <DialogTitle sx={{margin: "0 auto"}}>THÊM NHÀ CUNG CẤP</DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="center" alignItems="center" mt="10px" px="20px">
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={nhaCungCapSchema}
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
                    <Box display="flex" flexDirection="column">
                      <TextField
                        label="Tên nhà cung cấp"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.tenNCC}
                        name="tenNCC"
                        error={
                          Boolean(touched.tenNCC) && Boolean(errors.tenNCC)
                        }
                        helperText={touched.tenNCC && errors.tenNCC}
                        sx={{
                          width: '300px',
                        }}
                      />
                      <TextField
                        label="Số điện thoại"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.sdtNCC}
                        name="sdtNCC"
                        error={
                          Boolean(touched.sdtNCC) && Boolean(errors.sdtNCC)
                        }
                        helperText={touched.sdtNCC && errors.sdtNCC}
                        sx={{
                          width: '300px',
                          marginTop: "15px"
                        }}
                      />
                      <TextField
                        label="Email"
                        type="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.emailNCC}
                        name="emailNCC"
                        error={
                          Boolean(touched.emailNCC) && Boolean(errors.emailNCC)
                        }
                        helperText={touched.emailNCC && errors.emailNCC}
                        sx={{
                          width: '300px',
                          marginTop: "15px"
                        }}
                      />
                      <TextField 
                        multiline
                        rows="4"
                        label="Địa chỉ nhà cung cấp"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.diaChiNCC}
                        name="diaChiNCC"
                        error={
                          Boolean(touched.diaChiNCC) && Boolean(errors.diaChiNCC)
                        }
                        helperText={touched.diaChiNCC && errors.diaChiNCC}
                        sx={{
                            marginTop: "15px"
                        }}
                      />
                      <Box display="flex" justifyContent="end" mt="15px">
                        <Button onClick={handleHuy}>Hủy</Button>
                        <Button type="submit">Thêm</Button>
                      </Box>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    );
  };
  
  export default FormDialog;
  