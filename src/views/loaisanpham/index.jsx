import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';

import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FormDialog from './FormDialog';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const LoaiSanPham = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector((state) => state.token);
  const columns = [
    { field: '_id', headerName: 'ID', flex: 2 },
    { field: 'tenLoaiSP', headerName: 'Tên loại sản phẩm', flex: 3 },
    {
      field: 'action',
      headerName: 'Hành động',
      flex: 2,

      renderCell: (cellValues) => (
        <Box display="flex" gap={2}>
          <Button
            sx={{
              backgroundColor: colors.redAccent[600],
              '&:hover': {
                backgroundColor: colors.redAccent[500],
              },
            }}
            onClick={() => handleDeleteLoaiSP(cellValues.row._id, cellValues.row.tenLoaiSP)}
          >
            Xóa
          </Button>
        </Box>
      ),
    },
  ];
  const [data, setData] = useState([]);
  //API GET DATA BACKEND
  const getAllLoaiSP = () => {
    axios
      .get('http://localhost:3000/api/loaisanphams', {
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
  const handleDeleteLoaiSP = async (id, tenLoai) => {
    if(window.confirm(`Banj có chắc muốn xóa ${tenLoai}?`)){
      axios
      .delete('http://localhost:3000/api/loaisanphams/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success('Xóa loại sản phẩm thành công');
          setData(data.filter((dt) => dt._id !== id));
        }
      })
      .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    getAllLoaiSP();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m="15px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
            DANH SÁCH LOẠI SẢN PHẨM
          </Typography>
        </Box>
        <Box>
          <FormDialog data={data} setData={setData} />
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

export default LoaiSanPham;
