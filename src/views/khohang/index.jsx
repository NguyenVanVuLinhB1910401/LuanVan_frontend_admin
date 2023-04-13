import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const KhoHang = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const columns = [
    { field: '_id', headerName: 'ID', flex: 2 },
    {
      field: 'idSP',
      headerName: 'Tên sản phẩm',
      flex: 2.5,
      valueGetter: (params) => params.row.idSP.tenSanPham,
    },
    {
      field: 'idCN',
      headerName: 'Chi nhánh',
      flex: 2.5,
      valueGetter: (params) => params.row.idCN.tenChiNhanh,
    },
    {
      field: 'soLuong',
      headerName: 'Số lượng',
      headerAlign: 'center',
      align: 'center',
      flex: 1.5,
    },
    {
      field: 'daBan',
      headerName: 'Đã bán',
      headerAlign: 'center',
      align: 'center',
      flex: 1.5,
    },
    {
      field: 'tonKho',
      headerName: 'Tồn kho',
      headerAlign: 'center',
      align: 'center',
      flex: 1.5,
      valueGetter: (params) =>
        parseInt(params.row.soLuong) - parseInt(params.row.daBan),
    },
  ];
  const [data, setData] = useState([]);
  //API GET DATA BACKEND
  const getAllSanPhamTrongKho = () => {
    axios
      .get('http://localhost:3000/api/nhapxuatkho/tonkho', {
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
          setData(data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllSanPhamTrongKho();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Box m="15px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
            QUẢN LÝ KHO
          </Typography>
        </Box>
        <Box>
          <Button onClick={() => navigate('/thongtinchuyenkho')}>Thông tin chuyển kho</Button>
          <Button onClick={() => navigate('/chuyenkho')}>Chuyển kho</Button>
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
            console.log(ids);
          }}
        />
      </Box>
    </Box>
  );
};

export default KhoHang;
