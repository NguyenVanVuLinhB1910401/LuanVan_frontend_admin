import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  MenuItem,
} from '@mui/material';
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
import { toast } from 'react-toastify';
const DonHang = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector((state) => state.token);
  const [open, setOpen] = useState(false);
  let nf = new Intl.NumberFormat('vi-VN');
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
        console.log(response);
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
    if(window.confirm("Bạn có chắc muốn xóa đơn hàng?")){
      axios
      .delete('http://localhost:3000/api/donhangs/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200 && res.data.code === 1) {
          toast.success('Xóa đơn hàng thành công');
          setData(data.filter((dt) => dt._id !== id));
        }else {
          toast.error('Xóa đơn hàng thất bại')
        }
      })
      .catch((err) => console.log(err));
    }
  };
  const updateStatus = async (id, status) => {
    const result = await axios.put(
      'http://localhost:3000/api/donhangs/' + id,
      { status: status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (result.status === 200) {
      const donHang = data.find((item) => item._id === id);
      donHang.status = result.data.donHang.status;
      //apiRef.current.updateRows(donHang);

      // console.log(donHang);
      // console.log(data);
      setData(data);
      //setData(data.filter((dt) => dt._id !== id));
      toast.success('Cập nhật trạng thái đơn hàng thành công');
    }
  };
  const columns = [
    { field: 'idCNDH', headerName: 'Chi nhánh', flex: 1.5, valueGetter: (params) => params.row.idCNDH.tenChiNhanh },
    { field: 'hoTen', headerName: 'Họ tên', flex: 2 },
    { field: 'sdt', headerName: 'Số điện thoại', flex: 1 },
    // { field: 'email', headerName: "Email", flex: 1.5},
    { field: 'total', headerName: 'Tổng tiền', flex: 1.3, valueGetter: (params) =>nf.format(params.row.total) },
    { field: 'htnh', headerName: 'HTNH', flex: 1.2, valueGetter: (params) => params.row.htnh  === "GHTN" ? "Giao hàng tận nơi" : "Nhận tại cửa hàng" },
    { field: 'httt', headerName: 'HTTT', flex: 1.2 },
    { field: 'ngayDat', headerName: 'Ngày đặt', flex: 1.7, valueGetter: (params) => new Date(params.row.ngayDat).toLocaleString('en-GB', {
      hour12: false,
    })},
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 1.5,
      renderCell: (cellValues) => {
        if (
          cellValues.row.status === 'Chưa xử lý' ||
          cellValues.row.status === 'Đã thanh toán'
        ) {
          return (
            <Button
              variant="contained"
              onClick={() => updateStatus(cellValues.row._id, 'Đã xử lý')}
              sx={{
                width: '130px',
                background: '#66ffb3',
                ':hover': {
                  cursor: 'pointer',
                  background: '#33ff99',
                },
              }}
            >
              Chưa xử lý
            </Button>
          );
        } else if (cellValues.row.status === 'Đã xử lý') {
          return (
            <Button
              variant="contained"
              onClick={() => updateStatus(cellValues.row._id, 'Đang giao hàng')}
              sx={{
                width: '130px',
                background: '#66ffb3',
                ':hover': {
                  cursor: 'pointer',
                  background: '#33ff99',
                },
              }}
            >
              Đã xử lý
            </Button>
          );
        } else if (cellValues.row.status === 'Đang giao hàng') {
          return (
            <Button
              variant="contained"
              onClick={() => updateStatus(cellValues.row._id, 'Đã hoàn thành')}
              sx={{
                width: '130px',
                background: '#66ffb3',
                ':hover': {
                  cursor: 'pointer',
                  background: '#33ff99',
                },
              }}
            >
              Đang giao hàng
            </Button>
          );
        } else if (cellValues.row.status === 'Đã hoàn thành') {
          return (
            <Button variant="contained" color="success" sx={{ width: '130px' }}>
              {cellValues.row.status}
            </Button>
          );
        } else if (cellValues.row.status === 'Đã hủy') {
          return (
            <Box>
              <Button
                variant="contained"
                sx={{
                  width: '130px',
                }}
              >
                {cellValues.row.status}
              </Button>
            </Box>
          );
        } else {
          return (
            <Button
              variant="contained"
              sx={{
                width: '130px',
              }}
            >
              {cellValues.row.status}
            </Button>
          );
        }
      },
    },
    {
      field: 'action',
      headerName: 'Hành động',
      flex: 1,

      renderCell: (cellValues) => (
        <Box display="flex">
          <IconButton
            onClick={() => {
              handleClickOpen();
              getDonHang(cellValues.row._id+"?htnh="+cellValues.row.htnh);
            }}
          >
            <DetailsIcon />
          </IconButton>
          <IconButton onClick={() => {
            if(cellValues.row.status === "Đã hủy"){
              deleteDonHang(cellValues.row._id)
            }else {
              toast.warning("Chỉ xóa được các đơn hàng đã hủy!!!")
            }
            
          }}>
            <DeleteIcon
              sx={{
                color: colors.redAccent[600],
                '&:hover': {
                  color: colors.redAccent[500],
                },
              }}
            />
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
        //console.log(response);
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
                  {donHang.donHang?.htnh === "NTCH" ? donHang.donHang?.idCNNH.tenChiNhanh +" "+ donHang.donHang?.idCNNH.diaChiChiNhanh : donHang.donHang?.diaChi}
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
          '& .MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
        }}
      >
        <DataGrid
          disableSelectionOnClick
          checkboxSelection={false}
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
