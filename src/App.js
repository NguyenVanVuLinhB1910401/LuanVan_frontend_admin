import { ColorModeContext, useMode} from "./theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector} from "react-redux";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./views/dashboard";
import Login from "./views/login";
import LoaiSanPham from "./views/loaisanpham";
import SanPham from "./views/sanpham";
import FormSanPham from "./views/sanpham/FormSanPham";
import HangDienThoai from "./views/hangdienthoai";
import ChiNhanh from "./views/chinhanh";
import NhaCungCap from "./views/nhacungcap";
import KhachHang from "./views/khachhang";
import KhoHang from "./views/khohang";
import PhieuNhap from "./views/nhapkho/index";
import NhapKho from "./views/nhapkho/nhapkho";
import DSSPDaNhap from "./views/nhapkho/danhsachsanphamdanhap";
import PhieuXuat from "./views/xuatkho/index";
import XuatKho from "./views/xuatkho/xuatkho";
import DSSPDaXuat from "./views/xuatkho/danhsachsanphamdaxuat";
import DonHang from "./views/donhang";
function App() {
  const [theme, colorMode] = useMode();
  //console.log(useSelector((state) => state.token));
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          { isAuth && <Box><Sidebar /></Box>}
          <main className="content">
            { isAuth && <Topbar />}
            <Routes>
              <Route path="/login" element={isAuth ? <Navigate to="/" /> : <Login />} />
              <Route path="/" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/loaisp" element={isAuth ? <LoaiSanPham /> : <Navigate to="/login" />} />
              <Route path="/sanpham" element={isAuth ? <SanPham /> : <Navigate to="/login" />} />
              <Route path="/sanpham/them" element={isAuth ? <FormSanPham /> : <Navigate to="/login" />} />
              <Route path="/hangdt" element={isAuth ? <HangDienThoai /> : <Navigate to="/login" />} />
              <Route path="/chinhanh" element={isAuth ? <ChiNhanh /> : <Navigate to="/login" />} />
              <Route path="/nhacungcap" element={isAuth ? <NhaCungCap /> : <Navigate to="/login" />} />
              <Route path="/khachhang" element={isAuth ? <KhachHang /> : <Navigate to="/login" />} />
              <Route path="/khohang" element={isAuth ? <KhoHang /> : <Navigate to="/login" />} />
              <Route path="/phieunhap" element={isAuth ? <PhieuNhap /> : <Navigate to="/login" />} />
              <Route path="/phieunhap/nhapkho" element={isAuth ? <NhapKho /> : <Navigate to="/login" />} />
              <Route path="/phieunhap/dsspdanhap" element={isAuth ? <DSSPDaNhap /> : <Navigate to="/login" />} />
              <Route path="/phieuxuat" element={isAuth ? <PhieuXuat /> : <Navigate to="/login" />} />
              <Route path="/phieuxuat/xuatkho" element={isAuth ? <XuatKho /> : <Navigate to="/login" />} />
              <Route path="/phieuxuat/dsspdaxuat" element={isAuth ? <DSSPDaXuat /> : <Navigate to="/login" />} />
              <Route path="/donhang" element={isAuth ? <DonHang /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
