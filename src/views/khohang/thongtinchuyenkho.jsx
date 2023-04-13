import { Box, Typography, Button } from '@mui/material';
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useSelector } from 'react-redux';
const ThongTinChuyenKho = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const token = useSelector((state) => state.token);
    const columns = [
        { field: '_id', headerName: 'ID', flex: 1 },
        { field: 'idCNFrom', headerName: 'Từ chi nhánh', flex: 2, valueGetter: (params) => params.row.idCNFrom.tenChiNhanh },
        { field: 'idCNTo', headerName: 'Đến chi nhánh', flex: 2, valueGetter: (params) => params.row.idCNTo.tenChiNhanh },
        { field: 'idSP', headerName: 'Tên sản phẩm', flex: 2, valueGetter: (params) => params.row.idSP.tenSanPham },
        { field: 'soLuong', headerName: 'Số lượng', flex: 1 },
        { field: 'ngayChuyen', headerName: 'Ngày chuyển', flex: 2 },
        { field: 'idNV', headerName: 'Nhân viên', flex: 2, valueGetter: (params) => params.row.idNV.hoTen },
      ];
      const [data, setData] = useState([]);
      //API GET DATA BACKEND
  const getAllTTCK = () => {
    axios.get("http://localhost:3000/api/nhapxuatkho/thongtinchuyenkho", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
        if(response.status === 200){
            const data = response.data;
            setData(data);
        }
    }).catch((err) => console.log(err))
  };
  

  useEffect(() => {
    getAllTTCK();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Box m="15px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
            THÔNG TIN CHUYỂN KHO
          </Typography>
        </Box>
      </Box>

      {/* Hien thi table data-grid */}
      <Box
        m="20px 0 15px 0"
        height="550px"
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

export default ThongTinChuyenKho;
