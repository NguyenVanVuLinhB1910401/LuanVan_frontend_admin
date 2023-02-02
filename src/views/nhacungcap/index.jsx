import { Box, Typography, Button } from '@mui/material';
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from '@mui/x-data-grid';
import FormDialog from './FormDialog';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useSelector } from 'react-redux';
const NhaCungCap = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const token = useSelector((state) => state.token);
    const columns = [
        { field: '_id', headerName: 'ID', flex: 2 },
        { field: 'tenNCC', headerName: 'Tên nhà cung cấp', flex: 1 },
        { field: 'sdtNCC', headerName: "Số điện thoại", flex: 1},
        { field: 'emailNCC', headerName: "Email", flex: 1},
        { field: 'diaChiNCC', headerName: "Địa chỉ nhà cung cấp", flex: 2},
        {
          field: 'action',
          headerName: 'Hành động',
          flex: 1,
          
          renderCell: (cellValues) => (
            <Box display="flex" gap={2}>
              {/* <Button
                sx={{
                  backgroundColor: colors.greenAccent[600],
                  '&:hover': {
                    backgroundColor: colors.greenAccent[500],
                  },
                }}
              >
                Cập nhật
              </Button> */}
              <Button
              sx={{
                backgroundColor: colors.redAccent[600],
                '&:hover': {
                  backgroundColor: colors.redAccent[500],
                },
              }}
              onClick={() => handleDeleteNhaCungCap(cellValues.row._id)}
              >Xóa</Button>
            </Box>
          ),
        },
      ];
      const [data, setData] = useState([]);
      //API GET DATA BACKEND
  const getAllNhaCungCap = () => {
    axios.get("http://localhost:3000/api/nhacungcaps", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
        if(response.status === 200){
            // const data = response.data.result.map((res) => {
            //     return {id: res._id, tenLoaiSP: res.tenLoaiSP};
            // })
            const data = response.data.result;
            setData(data);
        }
    }).catch((err) => console.log(err))
  };
  const handleDeleteNhaCungCap = async (id) => {
        axios.delete("http://localhost:3000/api/nhacungcaps/"+id,  {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then((res) => {
            if(res.status === 200){
                alert("Xóa nhà cung cấp thành công");
                setData(data.filter((dt) => dt._id !== id))
                
            }
        }).catch((err) => console.log(err))
  };

  useEffect(() => {
    getAllNhaCungCap();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <Box m="15px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
            DANH SÁCH NHÀ CUNG CẤP
          </Typography>
        </Box>
        <Box>
          <FormDialog data={data} setData={setData}/>
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

export default NhaCungCap;