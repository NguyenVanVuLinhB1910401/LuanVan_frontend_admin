import { Box, Typography, TextField, MenuItem } from '@mui/material';
import Header from '../../components/Header';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import { fontWeight } from '@mui/system';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from "axios";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useSelector(state => state.token);
  const years = [2023, 2022, 2021, 2020, 2019, 2018];
  const [nam, setNam] = useState(2023);
  const [data, setData] = useState([]);
  const [soLuongKH, setSoLuongKH] = useState(0);
  const [soLuongNV, setSoLuongNV] = useState(0);
  const [soLuongLoai, setSoLuongLoai] = useState(0);
  const [soLuongHang, setSoLuongHang] = useState(0);
  const [soLuongSP, setSoLuongSP] = useState(0);
  const getDataThongKe = async (nam) => {
    const result = await axios.get("http://localhost:3000/api/thongke/"+nam, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (result.status === 200) {
      setSoLuongKH(result.data.soLuongKH);
      setSoLuongNV(result.data.soLuongNV);
      setSoLuongLoai(result.data.soLuongLoai);
      setSoLuongHang(result.data.soLuongHang);
      setSoLuongSP(result.data.soLuongSP);
      var newData = [
        {id: 1, total: 0, number: 0},
        {id: 2, total: 0, number: 0},
        {id: 3, total: 0, number: 0},
        {id: 4, total: 0, number: 0},
        {id: 5, total: 0, number: 0},
        {id: 6, total: 0, number: 0},
        {id: 7, total: 0, number: 0},
        {id: 8, total: 0, number: 0},
        {id: 8, total: 0, number: 0},
        {id: 9, total: 0, number: 0},
        {id: 10, total: 0, number: 0},
        {id: 11, total: 0, number: 0},
        {id: 12, total: 0, number: 0}
      ];
      for(let i= 0; i<result.data.dataThongKe.length; i++){
        //console.log(result.data[i].id - 1);
        newData[result.data.dataThongKe[i].id - 1] = result.data.dataThongKe[i];    
      }
      setData(newData);
    }
  }
  
  useEffect(() => {
    getDataThongKe(2023);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Box m="15px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="TRANG CHỦ" subtitle="Chào mừng đến với trang chủ" />
      </Box>
      <Box display="flex" gap={2}>
        <Box display="flex" justifyContent="center" width="25%" height="100px" sx={{ background: colors.greenAccent[500], borderRadius: "20px" }}>
          <Box>
            <Typography sx={{
              fontSize: "35px",
              fontWeight: "bold",
              textAlign: "center"
            }}>{soLuongKH}</Typography>
            <Typography sx={{
              fontSize: "25px",
              fontWeight: "bold",
              textAlign: "center"
            }}>Khách hàng</Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" width="25%" height="100px" sx={{ background: colors.greenAccent[500], borderRadius: "20px" }}>
          <Box>
            <Typography sx={{
              fontSize: "35px",
              fontWeight: "bold",
              textAlign: "center"
            }}>{soLuongNV}</Typography>
            <Typography sx={{
              fontSize: "25px",
              fontWeight: "bold",
              textAlign: "center"
            }}>Nhân viên</Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" width="25%" height="100px" sx={{ background: colors.greenAccent[500], borderRadius: "20px" }}>
          <Box>
            <Typography sx={{
              fontSize: "35px",
              fontWeight: "bold",
              textAlign: "center"
            }}>{soLuongLoai}</Typography>
            <Typography sx={{
              fontSize: "25px",
              fontWeight: "bold",
              textAlign: "center"
            }}>Loại sản phẩm</Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" width="25%" height="100px" sx={{ background: colors.greenAccent[500], borderRadius: "20px" }}>
          <Box>
            <Typography sx={{
              fontSize: "35px",
              fontWeight: "bold",
              textAlign: "center"
            }}>{soLuongHang}</Typography>
            <Typography sx={{
              fontSize: "25px",
              fontWeight: "bold",
              textAlign: "center"
            }}>Hãng điện thoại</Typography>
          </Box>
          
        </Box>

        <Box display="flex" justifyContent="center" width="25%" height="100px" sx={{ background: colors.greenAccent[500], borderRadius: "20px" }}>
          <Box>
            <Typography sx={{
              fontSize: "35px",
              fontWeight: "bold",
              textAlign: "center"
            }}>{soLuongSP}</Typography>
            <Typography sx={{
              fontSize: "25px",
              fontWeight: "bold",
              textAlign: "center"
            }}>Sản phẩm</Typography>
          </Box>
        </Box>
      </Box>
      <Box display="flex" m="10px" justifyContent="center" alignItems="center">
      <Typography sx={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", }}>Thông kê doanh thu và số lượng đơn hàng theo tháng của năm </Typography>
      <TextField
                    select
                    sx={{width: "100px"}}
                    label="Năm"
                    value={nam}
                    onChange={(e) => {
                      setNam(e.target.value);
                      getDataThongKe(e.target.value)}}
                  >
                    {years.map((y, index) => (
                      <MenuItem key={index} value={y} >{y}</MenuItem>
                    ))}
                  </TextField>
      </Box>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="number" fill="#8884d8" />
          <Bar dataKey="total" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Dashboard;
