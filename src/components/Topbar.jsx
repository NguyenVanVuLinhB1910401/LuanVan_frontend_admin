import { Box, IconButton, useTheme, Typography } from '@mui/material';
import { useContext } from 'react';
import { useDispatch } from "react-redux";
import { setLogout } from '../state';

import { ColorModeContext } from '../theme';
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon  from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';



const Topbar = () => {
  const theme = useTheme();
  //const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch();
  //const user = useSelector((state) => state.user);
  //console.log(user);
  return (
    <Box display="flex" justifyContent="end" p={2}>
      {/* SEARCH BAR */}
      {/* <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1}} placeholder="Search" />
        <IconButton type="button" sx={{p: 1}}>
            <SearchIcon />
        </IconButton>
      </Box> */}

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
            ) : (<LightModeOutlinedIcon />)}
            
        </IconButton>
        <IconButton>
            <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
            <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
            <PersonOutlineIcon />
        </IconButton>

        <Box p={1}>
          <Typography 
          sx={{
            "&:hover": {
              color: "#ffa366",
              cursor: "pointer"
            }
          }} 
          fontSize="17px" onClick={() => dispatch(setLogout())}>Đăng xuất</Typography>
        </Box>

        
      </Box>
    </Box>
  );
};

export default Topbar;
