import { Box } from "@mui/material";
import Header from "../../components/Header";

const Dashboard = () => {
    return (
        <Box m="15px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="TRANG CHỦ" subtitle="Chào mừng đến với trang chủ" />
            </Box>
            
        </Box>
    );
}

export default Dashboard;