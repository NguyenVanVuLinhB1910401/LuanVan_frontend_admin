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
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
