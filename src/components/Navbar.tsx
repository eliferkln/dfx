import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontSize: { xs: "0.9rem", sm: "1.25rem" } }}
        >
          Hazır Mesaj & Kullanıcı Yönetimi
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            "& .MuiButton-root": {
              display: { xs: "none", sm: "flex" },
            },
          }}
        >
          <Button
            color="inherit"
            onClick={() => navigate("/dashboard")}
            sx={{ minWidth: { sm: "auto" } }}
          >
            Mesajlar
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate("/users")}
            sx={{ minWidth: { sm: "auto" } }}
          >
            Kullanıcılar
          </Button>
          <IconButton size="large" onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem disabled>{user?.email}</MenuItem>
            <Divider />
            <Box sx={{ display: { sm: "none" } }}>
              <MenuItem
                onClick={() => {
                  navigate("/dashboard");
                  handleClose();
                }}
              >
                Mesajlar
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/users");
                  handleClose();
                }}
              >
                Kullanıcılar
              </MenuItem>
              <Divider />
            </Box>
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <LogoutIcon sx={{ mr: 1, color: "error.main" }} />
              Çıkış
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
