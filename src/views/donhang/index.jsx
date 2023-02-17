import { Box, Typography, Button, IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DetailsIcon from '@mui/icons-material/Details';
import DeleteIcon from '@mui/icons-material/Delete';
const DonHang = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector((state) => state.token);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleHuy = () => {
    setOpen(false);
  };
  const generatePDF = () => {
    const input = document.getElementById('chitietphieunhap');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(
        imgData,
        'JPEG',
        0,
        0,
        208,
        (canvas.height * 208) / canvas.width
      );
      // pdf.output('dataurlnewwindow');
      pdf.save('hoadon.pdf');
    });
  };
  const [donHang, setDonHang] = useState({});
  const getDonHang = (idDonHang) => {
    axios
      .get('http://localhost:3000/api/donhangs/' + idDonHang, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // const data = response.data.result.map((res) => {
          //     return {id: res._id, tenLoaiSP: res.tenLoaiSP};
          // })
          const data = response.data;
          //console.log(data);
          setDonHang(data);
        }
      })
      .catch((err) => console.log(err));
  };
  const deleteDonHang = (id) => {
    axios
      .delete('http://localhost:3000/api/donhangs/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          alert('Xóa đơn hàng thành công');
          setData(data.filter((dt) => dt._id !== id));
        }
      })
      .catch((err) => console.log(err));
  };
  const columns = [
    {
      field: 'idCN',
      headerName: 'Chi nhánh',
      flex: 1.5,
      valueGetter: (params) => params.row.idCN.tenChiNhanh,
    },
    // { field: 'idKH', headerName: 'Tài khoản', flex: 2, valueGetter: (params) => params.row.idKH.hoTen },
    { field: 'hoTen', headerName: 'Họ tên', flex: 2 },
    { field: 'sdt', headerName: 'Số điện thoại', flex: 1.5 },
    // { field: 'email', headerName: "Email", flex: 1.5},
    { field: 'total', headerName: 'Tổng tiền', flex: 1.5 },
    { field: 'httt', headerName: 'HTTT', flex: 1.5 },
    { field: 'status', headerName: 'Trạng thái', flex: 1.5 },
    { field: 'ngayDat', headerName: 'Ngày đặt', flex: 2 },
    // {
    //   field: 'trangThai',
    //   headerName: 'Trạng thái',
    //   flex: 1.5,
    //   valueGetter: (params) => params.row?.trangThai === 1 ? "Đang dùng" : "Bị khóa"
    // },
    {
      field: 'action',
      headerName: 'Hành động',
      flex: 1.5,

      renderCell: (cellValues) => (
        <Box display="flex" gap={2}>
          <IconButton
            onClick={() => {
              handleClickOpen();
              getDonHang(cellValues.row._id);
            }}
          >
            <DetailsIcon />
          </IconButton>
          <IconButton
            
            onClick={() => deleteDonHang(cellValues.row._id)}
          >
            <DeleteIcon sx={{
              color: colors.redAccent[600],
              '&:hover': {
                color: colors.redAccent[500],
              },
            }} />
          </IconButton>
        </Box>
      ),
    },
  ];
  const [data, setData] = useState([]);
  //API GET DATA BACKEND
  const getAllDonHang = () => {
    axios
      .get('http://localhost:3000/api/donhangs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          // const data = response.data.result.map((res) => {
          //     return {id: res._id, tenLoaiSP: res.tenLoaiSP};
          // })
          const data = response.data.result;
          setData(data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllDonHang();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Box m="15px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
            DANH SÁCH ĐƠN HÀNG
          </Typography>
        </Box>
        <Box></Box>
      </Box>

      {/* THÔNG TIN ĐON HANG  */}
      {/* Hien Dialog  */}
      <Dialog
        open={open}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '60%',
              background: '#fff',
              color: 'black',
            },
          },
        }}
      >
        <DialogContent id="chitietphieunhap">
          <Box>
            <Box>
              <Typography fontSize="30px" fontWeight="bold" textAlign="center">
                Thông Tin Đơn Hàng
              </Typography>
            </Box>
            <Box display="flex">
              <Box display="flex" p="5px">
                <Box>
                  <Typography fontSize="18px" fontWeight="bold">
                    Mã đơn hàng:
                  </Typography>
                </Box>
                <Box paddingLeft="10px">
                  <Typography fontSize="18px">
                    {donHang.donHang?._id}
                  </Typography>
                </Box>
                <Box marginLeft="20px">
                  <Typography fontSize="18px" fontWeight="bold">
                    Họ tên:
                  </Typography>
                </Box>
                <Box paddingLeft="10px">
                  <Typography fontSize="18px">
                    {donHang.donHang?.hoTen}
                  </Typography>
                </Box>
                <Box marginLeft="20px">
                  <Typography fontSize="18px" fontWeight="bold">
                    Số điện thoại:
                  </Typography>
                </Box>
                <Box paddingLeft="10px">
                  <Typography fontSize="18px">
                    {donHang.donHang?.sdt}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box display="flex" p="5px">
              <Box display="flex">
                <Typography minWidth="70px" fontSize="18px" fontWeight="bold">
                  Địa chỉ:
                </Typography>
                <Typography maxWidth="280px" fontSize="18px">
                  {donHang.donHang?.diaChi}
                </Typography>
                <Typography fontSize="18px" fontWeight="bold">
                  Ghi chú:
                </Typography>
                <Typography fontSize="18px">
                  {donHang.donHang?.ghiChu}
                </Typography>
                <Typography fontSize="18px" fontWeight="bold">
                  Email:
                </Typography>
                <Typography fontSize="18px">
                  {donHang.donHang?.email}
                </Typography>
              </Box>
              {/* <Box paddingLeft="10px">
                  
                </Box> */}
              {/* <Box display="flex">
                  
                </Box> */}
              {/* <Box paddingLeft="10px">
                  
                </Box> */}
              {/* <Box display="flex">
                  
                </Box> */}
              {/* <Box paddingLeft="10px">
                  
                </Box> */}
            </Box>
            <Box display="flex" p="5px">
              <Box>
                <Typography fontSize="18px" fontWeight="bold">
                  Hình thức thanh toán:
                </Typography>
              </Box>
              <Box paddingLeft="10px">
                <Typography fontSize="18px">{donHang.donHang?.httt}</Typography>
              </Box>
              <Box marginLeft="20px">
                <Typography fontSize="18px" fontWeight="bold">
                  Status:
                </Typography>
              </Box>
              <Box paddingLeft="10px">
                <Typography fontSize="18px">
                  {donHang.donHang?.status}
                </Typography>
              </Box>
              <Box marginLeft="20px">
                <Typography fontSize="18px" fontWeight="bold">
                  Ngày đặt:
                </Typography>
              </Box>
              <Box paddingLeft="10px">
                <Typography fontSize="18px">
                  {donHang.donHang?.ngayDat}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Box
                display="grid"
                gap="15px"
                gridTemplateColumns="repeat(12, minmax(0, 1fr))"
                sx={{
                  padding: '10px 5px',
                  '& > div': 'span 12',
                }}
              >
                <>
                  <Typography
                    fontSize="18px"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{ gridColumn: 'span 1' }}
                  >
                    STT
                  </Typography>
                  <Typography
                    fontSize="18px"
                    fontWeight="bold"
                    sx={{ gridColumn: 'span 5' }}
                  >
                    Tên sản phẩm
                  </Typography>
                  <Typography
                    fontSize="18px"
                    fontWeight="bold"
                    sx={{ gridColumn: 'span 2', textAlign: 'center' }}
                  >
                    Số lượng
                  </Typography>
                  <Typography
                    fontSize="18px"
                    fontWeight="bold"
                    sx={{ gridColumn: 'span 2', textAlign: 'end' }}
                  >
                    Giá
                  </Typography>
                  <Typography
                    fontSize="18px"
                    fontWeight="bold"
                    sx={{ gridColumn: 'span 2', textAlign: 'end' }}
                  >
                    Thành tiền
                  </Typography>
                </>
              </Box>

              {donHang.dsSanPham !== undefined &&
                donHang.dsSanPham.map((sp, index) => {
                  return (
                    <Box
                      key={index}
                      display="grid"
                      gap="15px"
                      gridTemplateColumns="repeat(12, minmax(0, 1fr))"
                      sx={{
                        padding: '10px 5px',
                        '& > div': 'span 12',
                      }}
                    >
                      <>
                        <Typography
                          fontSize="18px"
                          sx={{
                            gridColumn: 'span 1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {index + 1}
                        </Typography>
                        <Typography
                          fontSize="18px"
                          sx={{
                            gridColumn: 'span 5',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {sp.idSP.tenSanPham}
                        </Typography>
                        <Typography
                          fontSize="18px"
                          sx={{
                            gridColumn: 'span 2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {sp.soLuong}
                        </Typography>
                        <Typography
                          fontSize="18px"
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
                          fontSize="18px"
                          sx={{
                            gridColumn: 'span 2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'end',
                          }}
                        >
                          {parseInt(sp.gia * sp.soLuong).toLocaleString(
                            'it-IT',
                            {
                              style: 'currency',
                              currency: 'VND',
                            }
                          )}
                        </Typography>
                      </>
                    </Box>
                  );
                })}

              <Box
                display="grid"
                gap="15px"
                gridTemplateColumns="repeat(12, minmax(0, 1fr))"
                sx={{
                  padding: '10px 5px',
                  '& > div': 'span 12',
                }}
              >
                <>
                  <Typography
                    fontSize="20px"
                    fontWeight="bold"
                    sx={{ gridColumn: 'span 10', textAlign: 'end' }}
                  >
                    Tổng tiền:
                  </Typography>
                  <Typography
                    fontSize="20px"
                    fontWeight="bold"
                    sx={{ gridColumn: 'span 2', textAlign: 'end' }}
                  >
                    {parseInt(donHang.donHang?.total).toLocaleString('it-IT', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </Typography>
                </>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <Box display="flex" justifyContent="end" p="10px 30px">
          <Button onClick={generatePDF} sx={{ marginRight: '10px' }}>
            Print
          </Button>
          <Button onClick={handleHuy}>Đóng</Button>
        </Box>
      </Dialog>

      {/* Hien thi table data-grid */}
      <Box
        m="20px 0 15px 0"
        height="580px"
        sx={{
          '& .MuiDataGrid-root': {
            fontSize: '15px',
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderBottom: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={data}
          columns={columns}
          getRowId={(row) => row._id}
          onSelectionModelChange={(ids) => {
            //console.log(ids);
          }}
        />
      </Box>
    </Box>
  );
};

export default DonHang;
