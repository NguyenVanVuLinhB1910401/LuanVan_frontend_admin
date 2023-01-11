import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';

import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SanPham = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const handleClickThemSanPham = () => {
    navigate('/sanpham/them');
  };
  const columns = [
    { field: 'tenSanPham', headerName: 'Tên sản phẩm', flex: 1 },
    { field: 'loaiSanPham', headerName: 'Loại sản phẩm', flex: 1, valueGetter: (params) => params.row?.idLoaiSP[0]?.tenLoaiSP },
    { field: 'hangDienThoai', headerName: 'Hãng điện thoại', flex: 1, valueGetter: (params) => params.row?.idHangDT[0]?.tenHang  },
    { field: 'giaBan', headerName: 'Giá bán', flex: 1, valueGetter: (params) => {
      let giaBan = null;
      if(params.row.idGiaBan.giaBan){
        giaBan = parseInt(params.row?.idGiaBan?.giaBan).toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
      }
      return giaBan ?? "Chưa nhập giá";
    }},
    { field: 'trangThai', headerName: 'Trạng thái', flex: 1, valueGetter: (params) => params.row?.trangThai === "1" ? "Đang bán" : "Tạm dừng"  },
    {
      field: 'action',
      headerName: 'Hành động',
      flex: 1,

      renderCell: (cellValues) => (
        <Box display="flex" gap={2}>
          <Button
            sx={{
              backgroundColor: colors.greenAccent[600],
              '&:hover': {
                backgroundColor: colors.greenAccent[500],
              },
            }}
            onClick={() => navigate("/sanpham/them?idSP="+cellValues.row._id)}
          >
            Cập nhật
          </Button>
          <Button
            sx={{
              backgroundColor: colors.redAccent[600],
              '&:hover': {
                backgroundColor: colors.redAccent[500],
              },
            }}
            onClick={() => handleDeleteSanPham(cellValues.row._id)}
          >
            Xóa
          </Button>
        </Box>
      ),
    },
  ];

  //API GET DATA BACKEND
  const getAllSanPham = () => {
    axios
      .get('http://localhost:3000/api/sanphams', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // const data = response.data.result.map((res) => {
          //     return {id: res._id, tenLoaiSP: res.tenLoaiSP};
          // })
          const data = response.data.result;
          //console.log(data);
          setData(data);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleDeleteSanPham = async (id) => {
    axios
      .delete('http://localhost:3000/api/sanphams/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          alert('Xóa sản phẩm thành công');
          setData(data.filter((dt) => dt._id !== id));
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getAllSanPham();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <Box m="15px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
            DANH SÁCH SẢN PHẨM
          </Typography>
        </Box>
        <Box>
          <Button variant="outlined" onClick={handleClickThemSanPham}>
            Thêm Sản Phẩm
          </Button>
        </Box>
      </Box>

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
            // console.log(ids);
          }}
        />
      </Box>
    </Box>
  );
};

export default SanPham;
