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
import Dropzone from 'react-dropzone';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { toast } from 'react-toastify';
let initialValues = {
  idSP: '',
  idNCC: '',
  idCN: '',
  soLuong: '',
  gia: '',
};

const sanPhamSchema = yup.object().shape({
  idSP: yup.string().required('Không thể để trống'),
  idNCC: yup.string().required('Không thể để trống'),
  idCN: yup.string().required('Không thể để trống'),
  soLuong: yup.number().required('Không thể để trống'),
  gia: yup.number().required('Không thể để trống'),
});
const NhapKho = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const [dsSanPham, setDSSanPham] = useState([]);
  const [noiDung, setNoiDung] = useState('');
  const [sanPham, setSanPham] = useState([]);
  const [chiNhanh, setChiNhanh] = useState([]);
  const [nhaCungCap, setNhaCungCap] = useState([]);
  const [total, setTotal] = useState(0);
  const getAllSanPham = async () => {
    const response = await axios.get(`http://localhost:3000/api/sanphams`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      setSanPham(response.data.result);
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
  const getAllNhaCungCap = () => {
    axios
      .get(`http://localhost:3000/api/nhacungcaps`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setNhaCungCap(response.data.result);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleFormSubmit = (values, onSubmitProps) => {
    let checkDS = 0;
    for(let i=0;i<dsSanPham.length;i++){
      
      if(dsSanPham[i].idSP === values.idSP && dsSanPham[i].idNCC === values.idNCC && dsSanPham[i].idCN === values.idCN) {
        dsSanPham[i].soLuong += values.soLuong;
        checkDS = 1;
      }
    }
    if(checkDS === 0) setDSSanPham([...dsSanPham, values]);
    else setDSSanPham([...dsSanPham]);
    setTotal(total + values.soLuong * values.gia);
    onSubmitProps.resetForm();
  };

  const handleDelete = (index) => {
    //console.log(index);
    setTotal(total - dsSanPham[index].soLuong * dsSanPham[index].gia);
    setDSSanPham(dsSanPham.filter((pro) => pro.idSP !== dsSanPham[index].idSP));
  };

  

  const handleNhapKho = () => {
    const data = {
      idUser: user._id,
      noiDung: '',
      dsSanPham: [],
      total: 0,
    }
    if(dsSanPham.length > 0) {
      data.noiDung = noiDung;
      data.dsSanPham = dsSanPham;
      data.total = total;
      data.dateTime = new Date();
      //console.log(data);
      axios
      .post(`http://localhost:3000/api/nhapxuatkho/nhapkho`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 201 && response.data.code === 1) {
          toast.success(response.data.msg);
        }else {
          toast.error("Nhập hàng thất bại");
        }
      })
      .catch((err) => console.log(err));
    }
  }

  useEffect(() => {
    getAllSanPham();
    getAllChiNhanh();
    getAllNhaCungCap();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m="15px">
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
          NHẬP KHO
        </Typography>
        <Button onClick={handleNhapKho}>Lưu</Button>
      </Box>
      <Box m="20px 5px">
        <Box>
          <TextField
                label="Nội dung nhập hàng"
                multiline
                value={noiDung}
                onChange={(e) => setNoiDung(e.target.value)}
                rows="3"
                sx={{
                  width: '100%',
                }}
          />
        </Box>
        <Box m="10px 0px">
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
                <Box
                  display="grid"
                  gap="15px"
                  gridTemplateColumns="repeat(12, minmax(0, 1fr))"
                  sx={{
                    '& > div': 'span 12',
                  }}
                >
                  <>
                    <TextField
                      select
                      fullWidth
                      label="Tên sản phẩm"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.idSP}
                      name="idSP"
                      error={Boolean(touched.idSP) && Boolean(errors.idSP)}
                      helperText={touched.idSP && errors.idSP}
                      sx={{ gridColumn: 'span 3' }}
                    >
                      {sanPham.map((pro) => (
                        <MenuItem key={`${pro._id}`} value={pro._id}>
                          {pro.tenSanPham}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label="Chi nhánh"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.idCN}
                      name="idCN"
                      error={Boolean(touched.idCN) && Boolean(errors.idCN)}
                      helperText={touched.idCN && errors.idCN}
                      sx={{ gridColumn: 'span 2' }}
                    >
                      {chiNhanh.map((chiNhanh) => (
                        <MenuItem key={chiNhanh._id} value={chiNhanh._id}>
                          {chiNhanh.tenChiNhanh}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label="Nhà cung cấp"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.idNCC}
                      name="idNCC"
                      error={Boolean(touched.idNCC) && Boolean(errors.idNCC)}
                      helperText={touched.idNCC && errors.idNCC}
                      sx={{ gridColumn: 'span 2' }}
                    >
                      {nhaCungCap.map((nhaCungCap) => (
                        <MenuItem key={nhaCungCap._id} value={nhaCungCap._id}>
                          {nhaCungCap.tenNCC}
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
                      error={
                        Boolean(touched.soLuong) && Boolean(errors.soLuong)
                      }
                      helperText={touched.soLuong && errors.soLuong}
                      sx={{ gridColumn: 'span 2' }}
                    ></TextField>
                    <TextField
                      type="number"
                      label="Giá"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.gia}
                      name="gia"
                      error={Boolean(touched.gia) && Boolean(errors.gia)}
                      helperText={touched.gia && errors.gia}
                      sx={{ gridColumn: 'span 2' }}
                    ></TextField>
                    <Box sx={{ gridColumn: 'span 1' }}>
                      <Button
                        sx={{ width: '100%', height: '50px' }}
                        type="submit"
                      >
                        Thêm
                      </Button>
                    </Box>
                  </>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
        <Box m="10px 0px">
          <Box>
            <Typography fontSize="25px" fontWeight="bold">
              Danh sách sản phẩm nhập kho
            </Typography>
          </Box>
          <Box>
            <Box
              display="grid"
              gap="15px"
              gridTemplateColumns="repeat(12, minmax(0, 1fr))"
              sx={{
                background: '#6870fa',
                padding: '10px 5px',
                '& > div': 'span 12',
              }}
            >
              <>
                <Typography sx={{ gridColumn: 'span 2' }}>
                  Tên sản phẩm
                </Typography>
                <Typography sx={{ gridColumn: 'span 2' }}>
                  Tên chi nhánh
                </Typography>
                <Typography sx={{ gridColumn: 'span 2' }}>
                  Tên nhà cung cấp
                </Typography>
                <Typography sx={{ gridColumn: 'span 1', textAlign: 'center' }}>
                  Số lượng
                </Typography>
                <Typography sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
                  Giá nhập
                </Typography>
                <Typography sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
                  Thành tiền
                </Typography>
              </>
            </Box>

            {dsSanPham.map((sp, index) => {
              let tenSP = '';
              let tenNCC = '';
              let tenCN = '';
              for (let i = 0; i < sanPham.length; i++) {
                if (sanPham[i]._id === sp.idSP)
                  tenSP =
                    sanPham[i].tenSanPham + ' ' + sanPham[i].dungLuong + 'GB';
              }
              for (let i = 0; i < nhaCungCap.length; i++) {
                if (nhaCungCap[i]._id === sp.idNCC)
                  tenNCC = nhaCungCap[i].tenNCC;
              }
              for (let i = 0; i < chiNhanh.length; i++) {
                if (chiNhanh[i]._id === sp.idCN)
                  tenCN = chiNhanh[i].tenChiNhanh;
              }
              return (
                <Box
                  key={index}
                  display="grid"
                  gap="15px"
                  gridTemplateColumns="repeat(12, minmax(0, 1fr))"
                  sx={{
                    padding: '10px 5px',
                    background: colors.primary[400],
                    '& > div': 'span 12',
                  }}
                >
                  <>
                    <Typography
                      sx={{
                        gridColumn: 'span 2',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {tenSP}
                    </Typography>
                    <Typography
                      sx={{
                        gridColumn: 'span 2',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {tenCN}
                    </Typography>
                    <Typography
                      sx={{
                        gridColumn: 'span 2',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {tenNCC}
                    </Typography>
                    <Typography
                      sx={{
                        gridColumn: 'span 1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {sp.soLuong}
                    </Typography>
                    <Typography
                      sx={{
                        gridColumn: 'span 2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end',
                      }}
                    >
                      {parseInt(sp.gia).toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Typography>
                    <Typography
                      sx={{
                        gridColumn: 'span 2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end',
                      }}
                    >
                      {parseInt(sp.gia * sp.soLuong).toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Typography>
                    <IconButton
                    onClick={() => handleDelete(index)}
                      sx={{
                        gridColumn: 'span 1',
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <DeleteIcon  sx={{ color: 'red' }} />
                    </IconButton>
                  </>
                </Box>
              );
            })}
            {total !== 0 && (<Box
              display="grid"
              gap="15px"
              gridTemplateColumns="repeat(12, minmax(0, 1fr))"
              sx={{
                padding: '10px 5px',
                '& > div': 'span 12',
              }}
            >
              <>
                <Typography sx={{ gridColumn: 'span 9', textAlign: 'end' }}>
                  Tổng tiền:
                </Typography>
                <Typography sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
                  {parseInt(total).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Typography>
              </>
            </Box>)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NhapKho;
