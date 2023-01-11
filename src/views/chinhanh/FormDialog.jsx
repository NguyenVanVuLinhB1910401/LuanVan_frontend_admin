import {
    Box,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
  } from '@mui/material';
  import { useSelector } from 'react-redux';
  import { useTheme } from '@mui/material';
  import { tokens } from '../../theme';
  import { useState } from 'react';
  import { Formik } from 'formik';
  import * as yup from 'yup';
  import axios from "axios";
  
  const initialValues = {
    tenChiNhanh: '',
    diaChiChiNhanh: ''
  };
  
  const chiNhanhSchema = yup.object().shape({
    tenChiNhanh: yup.string().required('Tên chi nhánh không được để trống'),
    diaChiChiNhanh: yup.string().required("Địa chỉ chi nhánh không được để trống")
  });
  
  const FormDialog = ({data, setData}) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme);
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
        .post('http://localhost:3000/api/chinhanhs', values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 201) {
            alert('Thêm chi nhánh thành công');
            //console.log(...data);
            // const result = {
            //     id: response.data.result._id,
            //     tenLoaiSP: response.data.result.tenLoaiSP
            // }
            setData([...data, response.data.result]);
          }
        })
        .catch((err) => console.log(err));
      handleHuy();
    };
  
    return (
      <Box>
        <Button variant="outlined" onClick={handleClickOpen}>
          Thêm chi nhánh
        </Button>
        <Dialog open={open}>
          <DialogTitle sx={{margin: "0 auto"}}>THÊM CHI NHÁNH</DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="center" alignItems="center" mt="10px">
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={chiNhanhSchema}
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
                        label="Tên chi nhánh"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.tenChiNhanh}
                        name="tenChiNhanh"
                        error={
                          Boolean(touched.tenChiNhanh) && Boolean(errors.tenChiNhanh)
                        }
                        helperText={touched.tenChiNhanh && errors.tenChiNhanh}
                        sx={{
                          width: '300px',
                        }}
                      />
                      <TextField 
                        multiline
                        rows="4"
                        label="Địa chỉ chi nhánh"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.diaChiChiNhanh}
                        name="diaChiChiNhanh"
                        error={
                          Boolean(touched.diaChiChiNhanh) && Boolean(errors.diaChiChiNhanh)
                        }
                        helperText={touched.diaChiChiNhanh && errors.diaChiChiNhanh}
                        sx={{
                            marginTop: "15px"
                        }}
                      />
                      <Box display="flex" justifyContent="end" mt="15px">
                        <Button type="submit">Thêm</Button>
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
    );
  };
  
  export default FormDialog;
  