import { Box, Typography, Button } from '@mui/material';
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
//import ChiTietPhieuNhap from './chitietphieunhap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const PhieuNhap = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();
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
        pdf.save('phieunhap.pdf');
      });
    };
    const [phieuNhap, setPhieuNhap] = useState({});
    const getPhieuNhap = (idPhieuNhap) => {
      axios
        .get('http://localhost:3000/api/nhapxuatkho/phieunhap/' + idPhieuNhap, {
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
            setPhieuNhap(data);
          }
        })
        .catch((err) => console.log(err));
    };
  
    const columns = [
        { field: '_id', headerName: 'ID', flex: 1 },
        { field: 'idUser', headerName: 'Người nhập', flex: 1.5, valueGetter: (params) => params.row.idUser[0].hoTen  },
        { field: 'noiDung', headerName: "Nội dung", flex: 3},
        { field: 'total', headerName: "Tổng tiền", flex: 1, valueGetter: (params) => parseInt(params.row.total).toLocaleString('it-IT', {
          style: 'currency',
          currency: 'VND',
        })},
        { field: 'dateTime', headerName: "Ngày nhập", flex: 1},
        {
          field: 'action',
          headerName: 'Hành động',
          flex: 1.5,
    
          renderCell: (cellValues) => (
            <Box display="flex" gap={2}>
              <Button variant="outlined" onClick={() => { handleClickOpen(); getPhieuNhap(cellValues.row._id)}}>
                Xem chi tiết
              </Button>
              <Button
                sx={{
                  backgroundColor: colors.redAccent[600],
                  '&:hover': {
                    backgroundColor: colors.redAccent[500],
                  },
                }}

              >
                Xóa
              </Button>
            </Box>
          ),
        },
      ];
      const [data, setData] = useState([]);
      //API GET DATA BACKEND
  const getAllPhieuNhap = () => {
    axios.get("http://localhost:3000/api/nhapxuatkho/phieunhap", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
        if(response.status === 200){
            const data = response.data.result;
            //console.log(data);
            setData(data);
        }
    }).catch((err) => console.log(err))
  };

  useEffect(() => {
    getAllPhieuNhap();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <Box m="15px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
            DANH SÁCH PHIẾU NHẬP
          </Typography>
        </Box>
        <Box display="flex">
          <Box>
          <Button variant="outlined" onClick={() => navigate("/phieunhap/dsspdanhap")}>
                Danh sách sản phẩm đã nhập
            </Button>
          </Box>
            <Box marginLeft="10px">
            <Button variant="outlined" onClick={() => navigate("/phieunhap/nhapkho")}>
                Nhập kho
            </Button>
            </Box>
        </Box>
      </Box>

      {/* Hien Dialog  */}
      <Dialog
        open={open}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '80%', 
              background: "#fff",
              color: "black"
            },
          },
        }}
      >
        <DialogContent id="chitietphieunhap">
          <Box >
          <Box>
              <Typography fontSize="30px" fontWeight="bold" textAlign="center">
                Chi Tiết Phiếu Nhập
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
            
            <Box display="flex" p="5px">
              <Box>
                <Typography fontSize="18px" fontWeight="bold">
                  Mã phiếu nhập:
                </Typography>
              </Box>
              <Box paddingLeft="10px">
                <Typography fontSize="18px">{phieuNhap.result?._id}</Typography>
              </Box>
            </Box>
            
            <Box display="flex" p="5px">
              <Box>
                <Typography fontSize="18px" fontWeight="bold">Ngày nhập:</Typography>
              </Box>
              <Box>
                <Typography fontSize="18px" paddingLeft="10px">{phieuNhap.result?.dateTime}</Typography>
              </Box>
            </Box>
            </Box>
            <Box display="flex" >
            <Box display="flex" p="5px" marginRight="10px">
              <Box>
                <Typography fontSize="18px" fontWeight="bold">
                  Người nhập hàng:
                </Typography>
              </Box>
              <Box paddingLeft="10px">
                <Typography fontSize="18px">
                  {phieuNhap.result?.idUser[0].hoTen}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" p="5px">
              <Box>
                <Typography fontSize="18px" fontWeight="bold">Nội dung nhập hàng:</Typography>
              </Box>
              <Box>
                <Typography fontSize="18px" paddingLeft="10px">{phieuNhap.result?.noiDung}</Typography>
              </Box>
            </Box>
            </Box>
            <Box>
              <Box
                display="grid"
                gap="15px"
                gridTemplateColumns="repeat(24, minmax(0, 1fr))"
                sx={{
                  padding: '10px 5px',
                  '& > div': 'span 24',
                }}
              >
                <>
                  <Typography fontSize="18px" fontWeight="bold" textAlign="center" sx={{ gridColumn: 'span 1' }}>STT</Typography>
                  <Typography fontSize="18px" fontWeight="bold" sx={{ gridColumn: 'span 5' }}>
                    Tên sản phẩm
                  </Typography>
                  <Typography fontSize="18px" fontWeight="bold" sx={{ gridColumn: 'span 4' }}>
                    Tên chi nhánh
                  </Typography>
                  <Typography  fontSize="18px" fontWeight="bold" sx={{ gridColumn: 'span 4' }}>
                    Tên nhà cung cấp
                  </Typography>
                  <Typography
                  fontSize="18px"
                  fontWeight="bold"
                    sx={{ gridColumn: 'span 2', textAlign: 'center' }}
                  >
                    Số lượng
                  </Typography>
                  <Typography fontSize="18px" fontWeight="bold" sx={{ gridColumn: 'span 4', textAlign: 'end' }}>
                    Giá nhập
                  </Typography>
                  <Typography fontSize="18px" fontWeight="bold" sx={{ gridColumn: 'span 4', textAlign: 'end' }}>
                    Thành tiền
                  </Typography>
                </>
              </Box>

              {phieuNhap.dsSanPham !== undefined &&
                phieuNhap.dsSanPham.map((sp, index) => {
                  return (
                    <Box
                      key={index}
                      display="grid"
                      gap="15px"
                      gridTemplateColumns="repeat(24, minmax(0, 1fr))"
                      sx={{
                        padding: '10px 5px',
                        '& > div': 'span 24',
                      }}
                    >
                      <>
                        <Typography
                           fontSize="18px"
                          sx={{
                            gridColumn: 'span 1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: "center"
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
                          {sp.idSP[0].tenSanPham}
                        </Typography>
                        <Typography
                        fontSize="18px"
                          sx={{
                            gridColumn: 'span 4',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {sp.idCN[0].tenChiNhanh}
                        </Typography>
                        <Typography
                        fontSize="18px"
                          sx={{
                            gridColumn: 'span 4',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {sp.idNCC[0].tenNCC}
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
                            gridColumn: 'span 4',
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
                            gridColumn: 'span 4',
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
                gridTemplateColumns="repeat(24, minmax(0, 1fr))"
                sx={{
                  padding: '10px 5px',
                  '& > div': 'span 24',
                }}
              >
                <>
                  <Typography fontSize="20px" fontWeight="bold" sx={{ gridColumn: 'span 20', textAlign: 'end' }}>
                    Tổng tiền:
                  </Typography>
                  <Typography  fontSize="20px" fontWeight="bold" sx={{ gridColumn: 'span 4', textAlign: 'end' }}>
                    {parseInt(phieuNhap.result?.total).toLocaleString('it-IT', {
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

export default PhieuNhap;