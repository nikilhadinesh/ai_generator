import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clapperboard, User, Mail, Lock } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/signup', { name, email, password });
      login(res.data.token, res.data.user);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={styles.card}
      >
        <div style={styles.iconWrap}>
          <Clapperboard size={22} strokeWidth={1.6} color="#4fd1a5" />
        </div>
        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>Start generating with AI Video Studio</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <User size={16} strokeWidth={1.8} style={styles.inputIcon} />
            <input
              style={styles.input}
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <Mail size={16} strokeWidth={1.8} style={styles.inputIcon} />
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <Lock size={16} strokeWidth={1.8} style={styles.inputIcon} />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <motion.button
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            style={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </motion.button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/signin" style={styles.link}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0c0c14',
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },
  card: {
    background: '#14141f',
    border: '1px solid rgba(255,255,255,0.07)',
    padding: '40px',
    borderRadius: '18px',
    width: '380px',
    textAlign: 'center',
  },
  iconWrap: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(79,209,165,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  title: { fontSize: '22px', fontWeight: 600, color: 'white', marginBottom: '6px', letterSpacing: '-0.3px' },
  subtitle: { color: '#8f8fa8', marginBottom: '28px', fontSize: '13.5px' },
  inputGroup: { position: 'relative', marginBottom: '12px' },
  inputIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b6b85' },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: '#0c0c14',
    color: 'white',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#4fd1a5',
    color: '#0c0c14',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14.5px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: { color: '#f87171', fontSize: '13px', marginBottom: '10px' },
  footer: { marginTop: '20px', fontSize: '13.5px', color: '#8f8fa8' },
  link: { color: '#4fd1a5', fontWeight: 600, textDecoration: 'none' },
};

export default SignUp;