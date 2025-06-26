import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Alert,
  Grid,
  Link as MuiLink,
  Paper
} from '@mui/material';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
       
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, borderRadius: 2 }}
          >
            Sign In
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <MuiLink component={RouterLink} to="/register" variant="body2">
                Don&apos;t have an account? Sign Up
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
