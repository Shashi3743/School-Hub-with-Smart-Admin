import * as React from 'react';
import {
  AppBar, Box, Toolbar, IconButton, Typography,
  Menu, Container, Button, MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import { Link } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { AuthContext } from '../../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const { authenticated, user } = React.useContext(AuthContext);
  const theme = useTheme();

  const handleOpenNavMenu = (e) => setAnchorElNav(e.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        padding: '20px 0',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link className="nav-list" to="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                alignItems: 'center',
              }}
              className="text-beautify"
            >
              <img
                src="./images/static/school_management_system.png"
                height="90px"
                width="90px"
                alt="Logo"
              />
              MULTIPLE SCHOOL MANAGEMENT SYSTEM
            </Typography>
          </Link>

          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {!authenticated ? (
                <>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link to="/login" className="nav-list">
                      <Button startIcon={<LoginIcon />} sx={{ color: 'black' }}>
                        Login
                      </Button>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link to="/register" className="nav-list">
                      <Button sx={{ color: 'black' }}>Register</Button>
                    </Link>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link to="/logout" className="nav-list">
                      <Button sx={{ color: 'black' }}>Log Out</Button>
                    </Link>
                  </MenuItem>
                  {user?.role && (
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Link to={`/${user.role.toLowerCase()}`} className="nav-list">
                        <Button sx={{ color: 'black' }}>Dashboard</Button>
                      </Link>
                    </MenuItem>
                  )}
                </>
              )}
            </Menu>
          </Box>

          {/* Mobile view short logo */}
          <Link className="nav-list" to="/">
            <Typography
              variant="h5"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
              className="text-beautify"
            >
              SMS
            </Typography>
          </Link>

          {/* Desktop view buttons */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'flex-end',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              {!authenticated ? (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    color="primary"
                    startIcon={<LoginIcon />}
                    size="medium"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: 1,
                      px: 3,
                      py: 1,
                      '&:hover': {
                        boxShadow: 3,
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    color="primary"
                    size="medium"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      '&:hover': { boxShadow: 1 },
                    }}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/logout"
                    variant="contained"
                    color="error"
                    size="medium"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: 1,
                      px: 3,
                      py: 1,
                      '&:hover': { boxShadow: 3 },
                    }}
                  >
                    Log Out
                  </Button>
                  {user?.role && (
                    <Button
                      component={Link}
                      to={`/${user.role.toLowerCase()}`}
                      variant="contained"
                      color="primary"
                      size="medium"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 2,
                        boxShadow: 1,
                        px: 3,
                        py: 1,
                        '&:hover': { boxShadow: 3 },
                      }}
                    >
                      Dashboard
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
