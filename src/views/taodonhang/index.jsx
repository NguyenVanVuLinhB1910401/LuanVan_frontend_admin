import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  useTheme,
} from '@mui/material';
import { Field, Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import { toast } from 'react-toastify';
const initialValues = {
  hoTen: '',
  sdt: '',
  email: '',
  diaChi: '',
  ghiChu: '',
  httt: "Khi nhận hàng",
  htnh: "NTCH"
};

const thanhToanSchema = yup.object().shape({
  hoTen: yup.string().required('Không được để trống'),
  sdt: yup.string().required('Không được để trống'),
  //   email: yup.string().required('Không được để trống'),
  //   diaChi: yup.string().required('Không được để trống'),
  // idCN: yup.string().required('Không được để trống'),
  //   httt: yup.string().required('Không được để trống'),
});

const TaoDonHang = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const [idCNNH, setIdCNNH] = useState("");
  const [dsChiNhanh, setDSChiNhanh] = useState([]);

  const [idCN, setIdCN] = useState("");
  const [idLoai, setIdLoai] = useState("");
  const [idHang, setIdHang] = useState("");
  const [listProduct, setListProduct] = useState([]);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(0);
  const getAllChiNhanh = () => {
    axios
      .get('http://localhost:3000/api/chinhanhs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data.result;
          setDSChiNhanh(data);
        }
      })
      .catch((err) => console.log(err));
  };

  const getTotal = () => {
    let totalQuantity = 0;
    let totalPrice = 0;
    dsSanPham.forEach((item) => {
      totalPrice += parseInt(item.giaBan) * parseInt(item.soLuong);
    });
    return { totalPrice, totalQuantity };
  };
  const handleFormSubmit = async (values, onSubmitProps) => {
    if (listProduct.length > 0) {
      values.cart = listProduct;
      values.status = "Đã hoàn thành";
      values.total = listProduct.reduce((total , p) => (p.soLuong * p.gia) + total, 0);
      values.idKH = "";
      values.idCNDH = idCN;
      values.idCNNH = idCN;
      values.ngayDat = new Date();
      // console.log(values);
      axios
        .post(`http://localhost:3000/api/thanhtoans/thanhtoan`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data.code === 1) {
            //console.log(response.data.result);
            toast.success('Tạo đơn hàng hàng thành công.');
            navigate("/donhang");
            onSubmitProps.resetForm();
          } else if (response.status === 200 && response.data.code === 0) {
            //console.log(response.data);
            toast.error(response.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.warning("Danh sách sản phẩm rỗng!!!")
    }
  };
  const [dsSanPham, setDSSanPham] = useState([]);
  const [sanPham, setSanPham] = useState([]);
  const getAllSanPham = async () => {
      const response = await axios.get(`http://localhost:3000/api/sanphamskhtheocn/${idCN}?idLoai=${idLoai}&&idHang=${idHang}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setSanPham(response.data.result);
      }
   
  };
  const handleFormSubmitSanPham = (values, onSubmitProps) => {
    const sp = sanPham.find((pro) => pro._id === values.idSP);
    sp.soLuong = values.soLuong;
    const checkDSSanPham = dsSanPham.find((sanpham) => sanpham._id === values.idSP);
    if (checkDSSanPham) {
      checkDSSanPham.soLuong += values.soLuong;
      setDSSanPham([...dsSanPham]);
    } else {
      setDSSanPham([...dsSanPham, sp]);
    }
    onSubmitProps.resetForm();
  };
  const [loaiSanPham, setLoaiSanPham] = useState([]);
  const [hangDienThoai, setHangDienThoai] = useState([]);
  const getAllLoaiSP = async () => {
    const response = await axios.get(`http://localhost:3000/api/loaisanphams`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      setLoaiSanPham(response.data.result);
    }
  };
  const getAllHangDT = () => {
    axios
      .get(`http://localhost:3000/api/hangdienthoais`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setHangDienThoai(response.data.result);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllChiNhanh();
    getAllLoaiSP();
    getAllHangDT();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const handleFormSubmitProduct = async (values, onSubmitProps) => {
    if (product === "") {
      toast.warning("Danh sách sản phẩm rỗng");
      return;
    }
    if (quantity <= 0) {
      toast.warning("Số lượng phải lớn hơn 0");
      return;
    }
    const sp = sanPham.find((pro) => pro._id === product);
    setListProduct([...listProduct, {
      id: sp.sanpham._id,
      tenSanPham: sp.sanpham.tenSanPham,
      gia: sp.sanpham.giaBan * (1 - sp.sanpham.khuyenMai / 100),
      idCN: sp.idCN,
      soLuong: quantity
    }]);
  }
  return (
    <Box
      // display="flex"
      // alignItems="center"
      // justifyContent="center"
      minHeight="84vh"
    //   sx={{ background: '#fff' }}
    >
      <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
          TẠO ĐƠN HÀNG
        </Typography>
      <Box m="10px" p="10px" display="flex" sx={{background: colors.primary[400],}}>
        
        <TextField
          select
          label="Chi nhánh"
          value={idCN}
          onChange={(e) => {
            setIdCN(e.target.value);
          }}
          sx={{
            width: "30%",
            
            marginRight: "15px"
          }}
        >
          <MenuItem value="">
            <em>Chọn chi nhánh đặt hàng</em>
          </MenuItem>
          {dsChiNhanh.map((chiNhanh) => (
            <MenuItem key={`${chiNhanh._id}`} value={chiNhanh._id}>
              {chiNhanh.tenChiNhanh +
                '( địa chỉ: ' +
                chiNhanh.diaChiChiNhanh +
                ' )'}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Loại sản phẩm"
          value={idLoai}
          onChange={(e) => setIdLoai(e.target.value)}
          sx={{
            width: "30%",
            
            marginRight: "15px"
          }}
        >
          <MenuItem value="">
            <em>Chọn loại sản phẩm</em>
          </MenuItem>
          {loaiSanPham.map((loai) => (
            <MenuItem key={`${loai._id}`} value={loai._id}>
              {loai.tenLoaiSP}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Hãng điện thoại"
          value={idHang}
          onChange={(e) => setIdHang(e.target.value)}
          sx={{
            width: "30%",
            
            marginRight: "15px"
          }}
        >
          <MenuItem value="">
            <em>Chọn hãng điện thoại</em>
          </MenuItem>
          {hangDienThoai.map((hang) => (
            <MenuItem key={hang._id} value={hang._id}>
              {hang.tenHang}
            </MenuItem>
          ))}
        </TextField>
        <Button onClick={()=> getAllSanPham()}>Tìm sản phẩm</Button>
      </Box>
      <Box display="flex" p="10px" width="100%" gap={2}>
        <Box
          sx={{
            width: '30%',
            padding: '10px',
            // border: '1px solid #e0e0e0',
            background: colors.primary[400],
          }}
        >
          <Box>
            <Typography fontSize="30px" fontWeight="bold">
              Thông tin đặt hàng
            </Typography>
          </Box>

          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={thanhToanSchema}
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
                <TextField
                  label="Họ tên"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.hoTen}
                  name="hoTen"
                  error={Boolean(touched.hoTen) && Boolean(errors.hoTen)}
                  helperText={touched.hoTen && errors.hoTen}
                  sx={{
                    width: '100%',
                    marginBottom: '10px',
                  }}
                />
                <TextField
                  label="Số điện thoại"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.sdt}
                  name="sdt"
                  error={Boolean(touched.sdt) && Boolean(errors.sdt)}
                  helperText={touched.sdt && errors.sdt}
                  sx={{
                    width: '100%',
                    marginBottom: '10px',
                  }}
                />
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{
                    width: '100%',
                    marginBottom: '10px',
                  }}
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
                  sx={{
                    width: '100%',
                    marginBottom: '10px',
                  }}
                />
                <TextField
                  label="Ghi chú"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.ghiChu}
                  name="ghiChu"
                  error={Boolean(touched.ghiChu) && Boolean(errors.ghiChu)}
                  helperText={touched.ghiChu && errors.ghiChu}
                  sx={{
                    width: '100%',
                    marginBottom: '10px',
                  }}
                />

                <Box
                  display="flex"
                  m="10px 0px"
                  gap={3}
                  sx={{ gridColumn: 'span 1' }}
                >
                  <Typography fontSize="20px">
                    Hình thức thanh toán:{' '}
                  </Typography>
                  <Typography fontSize="20px">Khi nhận hàng</Typography>
                </Box>
                <Button
                  sx={{
                    width: '100%',
                    padding: '10px 0px',
                    fontSize: '15px',
                    background: '#4cceac',
                    ':hover': {
                      background: '#3da58a',
                      color: '#fff',
                    },
                  }}
                  type="submit"
                >
                  Thanh toán
                </Button>
              </form>
            )}
          </Formik>
        </Box>
        {sanPham.length > 0 &&
          (
            <Box
              sx={{
                width: '70%',
                padding: '10px',
                background: colors.primary[400],
              }}
            >
              <Box>
                <Typography fontSize="30px" fontWeight="bold">
                  Danh sách sản phẩm
                </Typography>
              </Box>

              <Box m="10px 0px" >
                <form >
                  <Box
                    display="flex"
                    gap={3}
                    width="100%"
                  >
                    <TextField
                      select
                      fullWidth
                      label="Tên sản phẩm"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                    >
                      {sanPham.map((pro) => (
                        <MenuItem key={`${pro._id}`} value={pro._id}>
                          {pro.sanpham?.tenSanPham}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      type="number"
                      label="Số lượng"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    ></TextField>
                    <Box >
                      <Button
                        sx={{ width: '100%', height: '50px' }}
                        onClick={handleFormSubmitProduct}
                      >
                        Thêm
                      </Button>
                    </Box>
                    <Box >
                      <Button
                        sx={{ width: '100%', height: '50px' }}
                        onClick={() => setListProduct([])}
                      >
                        Xóa tất cả sản phẩm
                      </Button>
                    </Box>
                  </Box>
                </form>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                sx={{
                  borderBottom: '1px solid #e0e0e0',
                  padding: '10px',
                }}
              >
                <Box
                  width="300px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Box>
                    <Typography fontSize="20px">Tên sản phẩm</Typography>
                  </Box>
                </Box>
                <Box
                  width="100px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box>
                    <Typography fontSize="20px">Số lượng</Typography>
                  </Box>
                </Box>
                <Box
                  width="150px"
                  display="flex"
                  flexDirection="column"
                  alignItems="end"
                  justifyContent="center"
                >
                  <Box>
                    <Typography fontSize="20px">Giá</Typography>
                  </Box>
                </Box>
                <Box
                  width="150px"
                  display="flex"
                  flexDirection="column"
                  alignItems="end"
                  justifyContent="center"
                >
                  <Box>
                    <Typography fontSize="20px">Thành tiền</Typography>
                  </Box>
                </Box>
              </Box>
              {listProduct !== undefined &&
                listProduct.map((sp, index) => {
                  return (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="space-between"
                      sx={{
                        borderBottom: '1px solid #e0e0e0',
                        padding: '10px',
                      }}
                    >
                      <Box
                        width="300px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                      >
                        <Box>
                          <Typography fontSize="20px">{sp.tenSanPham}</Typography>
                        </Box>
                      </Box>
                      <Box
                        width="100px"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Box>
                          <Typography fontSize="20px">{sp.soLuong}</Typography>
                        </Box>
                      </Box>
                      <Box
                        width="150px"
                        display="flex"
                        flexDirection="column"
                        alignItems="end"
                        justifyContent="center"
                      >
                        <Box>
                          <Typography fontSize="20px">{sp.gia}</Typography>
                        </Box>
                      </Box>
                      <Box
                        width="150px"
                        display="flex"
                        flexDirection="column"
                        alignItems="end"
                        justifyContent="center"
                      >
                        <Box>
                          <Typography fontSize="20px">
                            {sp.gia * sp.soLuong}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              <Box display="flex" justifyContent="end" p="10px">
                <Box display="flex" justifyContent="space-between" width="250px">
                  <Box>
                    <Typography fontSize="20px" fontWeight="bold">
                      Tổng tiền:{' '}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontSize="20px">{listProduct.reduce((total , p) => (p.soLuong * p.gia) + total, 0)}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
      </Box>
    </Box>
  );
};

export default TaoDonHang;
