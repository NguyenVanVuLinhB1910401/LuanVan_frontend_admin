import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
let initialValues = {
  idCNFrom: '',
  idCNTo: '',
  idSP: '',
  soLuong: 1,
};

const sanPhamSchema = yup.object().shape({
  idCNFrom: yup.string().required('Không thể để trống'),
  idCNTo: yup.string().required('Không thể để trống'),
  idSP: yup.string().required('Không thể để trống'),
  soLuong: yup.number().min(1).required('Không thể để trống'),
});
const ChuyenKho = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const [dsSanPham, setDSSanPham] = useState([]);
  const [chiNhanh, setChiNhanh] = useState([]);
  const [dsSanPhamMuonChuyen, setDSSanPhamMuonChuyen] = useState([]);
  const getAllSanPham = async () => {
    const response = await axios.get(`http://localhost:3000/api/sanphams`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      setDSSanPham(response.data.result);
    }
  };
  const getAllChiNhanh = () => {
    axios
      .get(`http://localhost:3000/api/chinhanhs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setChiNhanh(response.data.result);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleFormSubmit = (values, onSubmitProps) => {
    if(values.idCNFrom === values.idCNTo) {
        toast.warning("Bạn đã chọn 2 chi nhánh giống nhau!!!");
    }else {
        const check = dsSanPhamMuonChuyen.find((sp) => sp.idCNFrom === values.idCNFrom && sp.idCNTo === values.idCNTo && sp.idSP === values.idSP);
        if(check) {
            check.soLuong += values.soLuong;
            setDSSanPhamMuonChuyen([...dsSanPhamMuonChuyen])
        }else {
            setDSSanPhamMuonChuyen([...dsSanPhamMuonChuyen, values])
        }
        onSubmitProps.resetForm();  
    }
    
  };


  const dateTime = () => {
    var today = new Date();
    var date =
      today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();
    var time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    var dateTime = date + ' ' + time;
    return dateTime;
  };

  const handleChuyenKho = () => {
    if (dsSanPhamMuonChuyen.length > 0) {
        const ngayChuyen = dateTime();
        const data = dsSanPhamMuonChuyen.map((sp) => {
            const findSP = dsSanPham.find((pro) => pro._id === sp.idSP);
            const tuChiNhanh = chiNhanh.find((cn) => cn._id === sp.idCNFrom);
            const denChiNhanh = chiNhanh.find((cn) => cn._id === sp.idCNTo);
            return {
                ...sp,
                tenSanPham: findSP.tenSanPham,
                tuChiNhanh: tuChiNhanh.tenChiNhanh,
                denChiNhanh: denChiNhanh.tenChiNhanh,
                ngayChuyen: ngayChuyen,
                idNV: user._id
            }
        })
    //   console.log(data);
      axios
        .post(`http://localhost:3000/api/chuyenkho`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data.code === 1) {
            toast.success("Chuyển kho thành công");
            navigate("/khohang");
          } else if(response.status === 200 && response.data.code === 0) {
            toast.warning(response.data.msg);
          }
        })
        .catch((err) => console.log(err));
    }else{
        toast.warning("Danh sách sản phẩm cần chuyển rỗng!!!");
    }
  };

  useEffect(() => {
    getAllSanPham();
    getAllChiNhanh();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m="15px">
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
          CHUYỂN KHO
        </Typography>
        <Button onClick={handleChuyenKho}>Lưu</Button>
      </Box>
      <Box m="20px 5px">
        <Box m="10px 0px" width="100%">
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={sanPhamSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
              resetForm,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box display="flex" gap={3} width="100%">
                  <TextField
                    select
                    label="Từ chi nhánh"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.idCNFrom}
                    name="idCNFrom"
                    error={
                      Boolean(touched.idCNFrom) && Boolean(errors.idCNFrom)
                    }
                    helperText={touched.idCNFrom && errors.idCNFrom}
                    sx={{
                        width: "30%"
                    }}
                  >
                    {chiNhanh.map((chiNhanh) => (
                      <MenuItem key={chiNhanh._id} value={chiNhanh._id}>
                        {chiNhanh.tenChiNhanh}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Đến chi nhánh"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.idCNTo}
                    name="idCNTo"
                    error={Boolean(touched.idCNTo) && Boolean(errors.idCNTo)}
                    helperText={touched.idCNTo && errors.idCNTo}
                    sx={{
                        width: "30%"
                    }}
                  >
                    {chiNhanh.map((chiNhanh) => (
                      <MenuItem key={chiNhanh._id} value={chiNhanh._id}>
                        {chiNhanh.tenChiNhanh}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Tên sản phẩm"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.idSP}
                    name="idSP"
                    error={Boolean(touched.idSP) && Boolean(errors.idSP)}
                    helperText={touched.idSP && errors.idSP}
                    sx={{
                        width: "30%"
                    }}
                  >
                    {dsSanPham.map((pro) => (
                      <MenuItem key={`${pro._id}`} value={pro._id}>
                        {pro.tenSanPham}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="number"
                    label="Số lượng"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.soLuong}
                    name="soLuong"
                    error={Boolean(touched.soLuong) && Boolean(errors.soLuong)}
                    helperText={touched.soLuong && errors.soLuong}
                    sx={{
                        width: "8%"
                    }}
                  ></TextField>

                  <Box >
                    <Button
                      sx={{ width: '100%', height: '50px' }}
                      type="submit"
                    >
                      Thêm
                    </Button>
                  </Box>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
        <Box m="10px 0px">
          <Box>
            <Typography fontSize="25px" fontWeight="bold">
              Danh sách sản phẩm cần chuyển kho
            </Typography>
          </Box>
          <Box>
            <Box display="flex" gap={3} width="100%" sx={{
                padding: "10px",
                background: colors.greenAccent[500]
            }}>
              <Typography sx={{
                        width: "20%"
                    }}>Từ chi nhánh</Typography>
              <Typography sx={{
                        width: "20%"
                    }}>Đến chi nhánh</Typography>
              <Typography sx={{
                        width: "20%"
                    }}>Tên sản phẩm</Typography>
              <Typography sx={{
                        width: "10%"
                    }}>Số lượng</Typography>
            </Box>

            {dsSanPhamMuonChuyen.map((sp, index) => {
              let tenSP = '';
              let tuChiNhanh = '';
              let denChiNhanh = '';
              for (let i = 0; i < dsSanPham.length; i++) {
                if (dsSanPham[i]._id === sp.idSP)
                  tenSP = dsSanPham[i].tenSanPham;
              }
              for (let i = 0; i < chiNhanh.length; i++) {
                if (chiNhanh[i]._id === sp.idCNFrom)
                  tuChiNhanh = chiNhanh[i].tenChiNhanh;
                if (chiNhanh[i]._id === sp.idCNTo)
                  denChiNhanh = chiNhanh[i].tenChiNhanh;
              }

              return (
                <Box key={index} display="flex" gap={3} sx={{
                    padding: "10px",
                    background: index%2===0 ? colors.greenAccent[700] : colors.greenAccent[800]
                }}>
                  <Typography sx={{
                        width: "20%"
                    }}>{tuChiNhanh}</Typography>
                  <Typography sx={{
                        width: "20%"
                    }}>{denChiNhanh}</Typography>
                  <Typography sx={{
                        width: "20%"
                    }}>{tenSP}</Typography>
                  <Typography sx={{
                        width: "10%"
                    }}>{sp.soLuong}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChuyenKho;
