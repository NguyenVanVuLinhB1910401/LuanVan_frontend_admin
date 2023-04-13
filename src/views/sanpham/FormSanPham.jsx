import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Field, Formik } from 'formik';
import * as yup from 'yup';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
let initialValuesSanPham = {
  tenSanPham: '',
  manHinh: '',
  heDieuHanh: '',
  cameraTruoc: '',
  cameraSau: '',
  chip: '',
  ram: '',
  dungLuong: '',
  sim: '',
  pin: '',
  sac: '',
  // moTa: '',
  picture: '',
  idLoaiSP: '',
  idHangDT: '',
  giaBan: '',
  giaGoc: '',
  khuyenMai: 0,
  dsAnh: [],
  spMoi: 1,
  spNoiBat: 1,
  trangThai: 1,
};

const sanPhamSchema = yup.object().shape({
  tenSanPham: yup.string().required('Không được để trống'),
  // manHinh: yup.string().required('Không được để trống'),
  // heDieuHanh: yup.string().required('Không được để trống'),
  // cameraTruoc: yup.string().required('Không được để trống'),
  // cameraSau: yup.string().required('Không được để trống'),
  // chip: yup.string().required('Không được để trống'),
  // ram: yup.string().required('Không được để trống'),
  // dungLuong: yup.string().required('Không được để trống'),
  // sim: yup.string().required('Không được để trống'),
  // pin: yup.string().required('Không được để trống'),
  // sac: yup.string().required('Không được để trống'),
  idLoaiSP: yup.string().required('Không được để trống'),
  idHangDT: yup.string().required('Không được để trống'),
});
const FormSanPham = () => {
  const [moTa, setMoTa] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idSP = searchParams.get('idSP');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector((state) => state.token);
  const [initialValues, setInitialValuesSanPham] =
    useState(initialValuesSanPham);
  const [loaiSanPham, setLoaiSanPham] = useState([]);
  const [hangDienThoai, setHangDienThoai] = useState([]);
  const [oldAnhDaiDien, setOldAnhDaiDien] = useState('undefined');
  const handleFormSubmit = (values, onSubmitProps) => {
    const formData = new FormData();
    if (idSP) {
      for (let value in values) {
        formData.append(value, values[value]);
      }
      formData.append('oldAnhDaiDien', oldAnhDaiDien);
      formData.append('newAnhDaiDien', values.picture.name);
      formData.append('moTa', moTa);
      //Post data update san pham
      axios
        .put(`http://localhost:3000/api/sanphams/${idSP}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            //console.log(response.data.result);
            toast.success('Cập nhật sản phẩm thành công.');
            navigate('/sanpham');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      for (let value in values) {
        formData.append(value, values[value]);
        //console.log(value);
      }
      formData.append('anhDaiDien', values.picture.name);
      formData.append('moTa', moTa);
      // console.log(moTa);
      //console.log(values);
      //Post data them san pham
      axios
        .post(`http://localhost:3000/api/sanphams`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 201) {
            //console.log(response.data.result);
            toast.success('Thêm sản phẩm thành công.');
            navigate('/sanpham');
          }
        })
        .catch((err) => {
          console.log(err);
        });

      onSubmitProps.resetForm();
    }
  };
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
  const getOneSanPham = async (id) => {
    const response = await axios.get(
      `http://localhost:3000/api/sanphams/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    //console.log(response.data.result);
    if (response.status === 200) {
      let data = {
        tenSanPham: response.data.result.tenSanPham,
        manHinh: response.data.result.manHinh,
        heDieuHanh: response.data.result.heDieuHanh,
        cameraTruoc: response.data.result.cameraTruoc,
        cameraSau: response.data.result.cameraSau,
        chip: response.data.result.chip,
        ram: response.data.result.ram,
        dungLuong: response.data.result.dungLuong,
        sim: response.data.result.sim,
        pin: response.data.result.pin,
        sac: response.data.result.sac,
        picture: '',
        idLoaiSP: response.data.result.idLoaiSP,
        idHangDT: response.data.result.idHangDT,
        giaBan: response.data.result.giaBan ?? '',
        giaGoc: response.data.result.giaGoc ?? '',
        khuyenMai: response.data.result.khuyenMai ?? 0,
        dsAnh: [],
        spMoi: response.data.result.spMoi,
        spNoiBat: response.data.result.spNoiBat,
        trangThai: response.data.result.trangThai,
      };
      if (response.data.result.moTa) {
        setMoTa(response.data.result.moTa)
      }
      if (response.data.result.anhDaiDien) {
        setOldAnhDaiDien(response.data.result.anhDaiDien);
      }
      setInitialValuesSanPham(data);
    }
  };

  useEffect(() => {
    getAllLoaiSP();
    getAllHangDT();
    if (idSP) getOneSanPham(idSP);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Box m="15px">
      <Box>
        <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
          {idSP ? 'CẬP NHẬT SẢN PHẨM' : 'THÊM SẢN PHẨM'}
        </Typography>
      </Box>
      <Box m="20px 5px">
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={sanPhamSchema}
          values={initialValues}
          enableReinitialize
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
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  '& > div': 'span 4',
                }}
              >
                <>
                  <TextField
                    label="Tên sản phẩm"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.tenSanPham}
                    name="tenSanPham"
                    error={
                      Boolean(touched.tenSanPham) && Boolean(errors.tenSanPham)
                    }
                    helperText={touched.tenSanPham && errors.tenSanPham}
                    sx={{ gridColumn: 'span 1' }}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Loại sản phẩm"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.idLoaiSP}
                    name="idLoaiSP"
                    error={
                      Boolean(touched.idLoaiSP) && Boolean(errors.idLoaiSP)
                    }
                    helperText={touched.idLoaiSP && errors.idLoaiSP}
                    sx={{ gridColumn: 'span 1' }}
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
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.idHangDT}
                    name="idHangDT"
                    error={
                      Boolean(touched.idHangDT) && Boolean(errors.idHangDT)
                    }
                    helperText={touched.idHangDT && errors.idHangDT}
                    sx={{ gridColumn: 'span 1' }}
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
                  {idSP && (
                    <Box
                      display="flex"
                      gap={3}
                      alignItems="center"
                      sx={{ gridColumn: 'span 1' }}
                    >
                      <Typography>Ảnh hiện tại: </Typography>
                      {oldAnhDaiDien !== 'undefined' ? (
                        <img
                          width="70px"
                          src={`http://localhost:3000/assets/${oldAnhDaiDien}`}
                          alt="img"
                        />
                      ) : (
                        <Typography>Chưa có ảnh</Typography>
                      )}
                    </Box>
                  )}
                  <Box
                    gridColumn="span 1"
                    border={`1px solid ${colors.blueAccent[500]}`}
                    borderRadius="5px"
                    p="0.1rem"
                    height="52px"
                  >
                    <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) =>
                        setFieldValue('picture', acceptedFiles[0])
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${colors.blueAccent[700]}`}
                          sx={{
                            '&:hover': { cursor: 'pointer' },
                            height: '100%',
                          }}
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <p>Chọn ảnh sản phẩm</p>
                          ) : (
                            <Box
                              display="flex"
                              p="10px 0"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography>{values.picture.name}</Typography>
                              <EditOutlinedIcon />
                            </Box>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                  </Box>
                  <TextField
                    label="Màn hình"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.manHinh}
                    name="manHinh"
                    error={Boolean(touched.manHinh) && Boolean(errors.manHinh)}
                    helperText={touched.manHinh && errors.manHinh}
                    sx={{ gridColumn: 'span 1' }}
                  />
                  <TextField
                    label="Hệ điều hành"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.heDieuHanh}
                    name="heDieuHanh"
                    error={
                      Boolean(touched.heDieuHanh) && Boolean(errors.heDieuHanh)
                    }
                    helperText={touched.heDieuHanh && errors.heDieuHanh}
                    sx={{ gridColumn: 'span 1' }}
                  />
                  <TextField
                    label="Camera trước"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.cameraTruoc}
                    name="cameraTruoc"
                    error={
                      Boolean(touched.cameraTruoc) &&
                      Boolean(errors.cameraTruoc)
                    }
                    helperText={touched.cameraTruoc && errors.cameraTruoc}
                    sx={{ gridColumn: 'span 1' }}
                  />
                  <TextField
                    label="Camera sau"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.cameraSau}
                    name="cameraSau"
                    error={
                      Boolean(touched.cameraSau) && Boolean(errors.cameraSau)
                    }
                    helperText={touched.cameraSau && errors.cameraSau}
                    sx={{ gridColumn: 'span 1' }}
                  />
                  <TextField
                    label="Chip"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.chip}
                    name="chip"
                    error={Boolean(touched.chip) && Boolean(errors.chip)}
                    helperText={touched.chip && errors.chip}
                    sx={{ gridColumn: 'span 1' }}
                  />
                  <TextField
                    label="RAM"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.ram}
                    name="ram"
                    error={Boolean(touched.ram) && Boolean(errors.ram)}
                    helperText={touched.ram && errors.ram}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">GB</InputAdornment>
                      ),
                    }}
                    sx={{ gridColumn: 'span 1' }}
                  />
                  <TextField
                    label="Dung lượng"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.dungLuong}
                    name="dungLuong"
                    error={
                      Boolean(touched.dungLuong) && Boolean(errors.dungLuong)
                    }
                    helperText={touched.dungLuong && errors.dungLuong}
                    sx={{ gridColumn: 'span 1' }}
                  />
                  <TextField
                    label="SIM"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sim}
                    name="sim"
                    error={Boolean(touched.sim) && Boolean(errors.sim)}
                    helperText={touched.sim && errors.sim}
                    sx={{ gridColumn: 'span 1' }}
                  />
                  <TextField
                    label="Pin"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.pin}
                    name="pin"
                    error={Boolean(touched.pin) && Boolean(errors.pin)}
                    helperText={touched.pin && errors.pin}
                    sx={{ gridColumn: 'span 1' }}
                  />
                  <TextField
                    label="Sạc"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sac}
                    name="sac"
                    error={Boolean(touched.sac) && Boolean(errors.sac)}
                    helperText={touched.sac && errors.sac}
                    sx={{ gridColumn: 'span 1' }}
                  />
                  <TextField
                    type="number"
                    label="Giá gốc"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.giaGoc}
                    name="giaGoc"
                    error={Boolean(touched.giaGoc) && Boolean(errors.giaGoc)}
                    helperText={touched.giaGoc && errors.giaGoc}
                    sx={{ gridColumn: 'span 1' }}
                  />

                  <TextField
                    type="number"
                    label="Giá bán"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.giaBan}
                    name="giaBan"
                    error={Boolean(touched.giaBan) && Boolean(errors.giaBan)}
                    helperText={touched.giaBan && errors.giaBan}
                    sx={{ gridColumn: 'span 1' }}
                  />

                  <TextField
                    type="number"
                    label="Khuyến mãi"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.khuyenMai}
                    name="khuyenMai"
                    error={Boolean(touched.khuyenMai) && Boolean(errors.khuyenMai)}
                    helperText={touched.khuyenMai && errors.khuyenMai}
                    sx={{ gridColumn: 'span 1' }}
                  />

                  <FormControl
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Box display="flex" gap={3} alignItems="center">
                      <FormLabel>Trạng thái:</FormLabel>
                      <Field
                        as={RadioGroup}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.trangThai}
                        name="trangThai"
                      >
                        <Box display="flex">
                          <FormControlLabel
                            value={1}
                            control={<Radio />}
                            label="Đang bán"
                          />
                          <FormControlLabel
                            value={0}
                            control={<Radio />}
                            label="Tạm dừng"
                          />
                        </Box>
                      </Field>
                    </Box>
                  </FormControl>

                  <FormControl
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Box display="flex" gap={3} alignItems="center">
                      <FormLabel>Sản phẩm mới:</FormLabel>
                      <Field
                        as={RadioGroup}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.spMoi}
                        name="spMoi"
                      >
                        <Box display="flex">
                          <FormControlLabel
                            value={1}
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value={0}
                            control={<Radio />}
                            label="No"
                          />
                        </Box>
                      </Field>
                    </Box>
                  </FormControl>

                  <FormControl
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Box display="flex" gap={3} alignItems="center">
                      <FormLabel>Sản phẩm nổi bật:</FormLabel>
                      <Field
                        as={RadioGroup}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.spNoiBat}
                        name="spNoiBat"
                      >
                        <Box display="flex">
                          <FormControlLabel
                            value={1}
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value={0}
                            control={<Radio />}
                            label="No"
                          />
                        </Box>
                      </Field>
                    </Box>
                  </FormControl>

                  {/* <TextField
                    label="Thông tin sản phẩm"
                    multiline
                    rows="4"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.moTa}
                    name="moTa"
                    error={Boolean(touched.moTa) && Boolean(errors.moTa)}
                    helperText={touched.moTa && errors.moTa}
                    sx={{ gridColumn: 'span 4' }}
                  /> */}
                  <Box sx={{ gridColumn: 'span 4' }}>
                    <CKEditor
                      id="editor"
                      editor={ClassicEditor}
                      data={moTa}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            'height',
                            '200px',
                            editor.editing.view.document.getRoot()
                          );
                        });
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setMoTa(data);
                        //console.log( { event, editor, data } );
                      }}
                      onBlur={(event, editor) => {
                        //console.log('Blur.', editor);
                      }}
                      onFocus={(event, editor) => {
                        //console.log('Focus.', editor);
                      }}
                    />
                  </Box>
                  {/* {moTa} */}
                  {/* {<div dangerouslySetInnerHTML={{ __html: moTa }} />} */}
                  <Box sx={{ gridColumn: 'span 4', margin: '10px auto' }}>
                    <Button
                      type="submit"
                      sx={{
                        width: '200px',
                        padding: '20px 30px',
                        background: colors.greenAccent[600],
                        ':hover': {
                          background: colors.greenAccent[400],
                          color: 'black',
                        },
                      }}
                    >
                      {idSP ? 'Cập nhật' : 'Thêm'}
                    </Button>
                  </Box>
                </>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default FormSanPham;
