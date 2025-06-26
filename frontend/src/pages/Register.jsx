import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Link as MuiLink,
} from '@mui/material';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('developer');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError('Registration failed. The email may already be in use.');
      console.error(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 6,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 4, fontWeight: '700', color: 'text.primary' }}
        >
          Create Your Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 4 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Full Name"
                required
                fullWidth
                autoFocus
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                required
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type="password"
                required
                fullWidth
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="developer">Developer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 5, mb: 3, borderRadius: 2, fontWeight: '600' }}
          >
            Sign Up
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <MuiLink
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{ fontWeight: '500' }}
              >
                Already have an account? Sign in
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
