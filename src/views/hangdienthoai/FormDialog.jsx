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
import { toast } from 'react-toastify';
const initialValues = {
  tenHang: '',
};

const hangDienThoaiSchema = yup.object().shape({
  tenHang: yup.string().required('Tên hãng điện thoại không được để trống'),
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
      .post('http://localhost:3000/api/hangdienthoais', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          toast.success('Thêm hãng điện thoại thành công');
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
        Thêm hãng điện thoại
      </Button>
      <Dialog open={open}>
        <DialogTitle>THÊM HÃNG ĐIỆN THOẠI</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" mt="15px">
            <Formik
              onSubmit={handleFormSubmit}
              initialValues={initialValues}
              validationSchema={hangDienThoaiSchema}
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
                      label="Tên hãng điện thoại"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.tenHang}
                      name="tenHang"
                      error={
                        Boolean(touched.tenHang) && Boolean(errors.tenHang)
                      }
                      helperText={touched.tenHang && errors.tenHang}
                      sx={{
                        width: '300px',
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
