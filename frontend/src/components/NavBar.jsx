import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'error';
            case 'manager': return 'warning';
            case 'developer': return 'info';
            default: return 'default';
        }
    };

    const getRoleLabel = (role) => {
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Productivity Dashboard
                    </Link>
                </Typography>
                {isAuthenticated && user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2">
                            Welcome, {user.name}
                        </Typography>
                        <Chip 
                            label={getRoleLabel(user.role)} 
                            color={getRoleColor(user.role)}
                            size="small"
                            variant="outlined"
                        />
                        {user.team && (
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Team: {user.team}
                            </Typography>
                        )}
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </Box>
                ) : (
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;