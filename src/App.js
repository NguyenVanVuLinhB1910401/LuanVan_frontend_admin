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
import TaoDonHang from "./views/taodonhang/index";
import ChuyenKho from "./views/khohang/chuyenkho";
import NhanVien from "./views/nhanvien/index";
import ThemNhanVien from "./views/nhanvien/themnhanvien";
import ThongTinChuyenKho from "./views/khohang/thongtinchuyenkho";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [theme, colorMode] = useMode();
  //console.log(useSelector((state) => state.token));
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          { isAuth && <Sidebar />}
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
              <Route path="/taodonhang" element={isAuth ? <TaoDonHang /> : <Navigate to="/login" />} />
              <Route path="/chuyenkho" element={isAuth ? <ChuyenKho /> : <Navigate to="/login" />} />
              <Route path="/thongtinchuyenkho" element={isAuth ? <ThongTinChuyenKho /> : <Navigate to="/login" />} />
              <Route path="/nhanvien" element={isAuth ? <NhanVien /> : <Navigate to="/login" />} />
              <Route path="/nhanvien/them" element={isAuth ? <ThemNhanVien /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme.palette.mode}
          />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
