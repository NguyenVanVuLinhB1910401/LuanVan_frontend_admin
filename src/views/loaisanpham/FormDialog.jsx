import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Box } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const initialValues = {
  tenLoaiSP: '',
};

const loaiSanPhamSchema = yup.object().shape({
  tenLoaiSP: yup.string().required('Tên loại sản phẩm không được bỏ trống.'),
});

const FormDialog = ({ data, setData }) => {
  const [open, setOpen] = useState(false);
  const token = useSelector((state) => state.token);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleHuy = () => {
    setOpen(false);
  };
  const handleFormSubmit = (values) => {
    //console.log(values);
    axios
      .post('http://localhost:3000/api/loaisanphams', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          toast.success('Thêm loại sản phẩm thành công');
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
        Thêm loại sản phẩm
      </Button>
      <Dialog open={open}>
        <DialogTitle>THÊM LOẠI SẢN PHẨM</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" mt="10px">
            <Formik
              onSubmit={handleFormSubmit}
              initialValues={initialValues}
              validationSchema={loaiSanPhamSchema}
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
                      label="Tên loại sản phẩm"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.tenLoaiSP}
                      name="tenLoaiSP"
                      error={
                        Boolean(touched.tenLoaiSP) && Boolean(errors.tenLoaiSP)
                      }
                      helperText={touched.tenLoaiSP && errors.tenLoaiSP}
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
