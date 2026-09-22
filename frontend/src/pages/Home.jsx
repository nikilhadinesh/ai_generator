import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Video, Images, ImagePlus, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  {
    title: 'Text to Video',
    desc: 'Describe a scene in a few words and generate a short AI video from scratch.',
    path: '/text-to-video',
    icon: Video,
    accent: '#8b8bf5',
  },
  {
    title: 'Image to Video',
    desc: 'Upload a set of photos and turn them into a smooth captioned slideshow video.',
    path: '/image-to-video',
    icon: Images,
    accent: '#f5a15e',
  },
  {
    title: 'Text to Image',
    desc: 'Turn a written idea into a high quality AI generated image in seconds.',
    path: '/text-to-image',
    icon: ImagePlus,
    accent: '#4fd1a5',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.header}
      >
        <div style={styles.badge}>
          <Sparkles size={13} strokeWidth={1.8} />
          <span>AI generation toolkit</span>
        </div>
        <h1 style={styles.heading}>Create videos and images with AI</h1>
        <p style={styles.subheading}>
          Choose a tool below. Every generation can be downloaded straight to your device.
        </p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" style={styles.grid}>
        {features.map(({ title, desc, path, icon: Icon, accent }) => (
          <motion.div
            key={path}
            variants={item}
            whileHover={{ y: -6 }}
            onClick={() => navigate(path)}
            style={styles.card}
          >
            <div style={{ ...styles.iconWrap, background: `${accent}1a`, color: accent }}>
              <Icon size={22} strokeWidth={1.6} />
            </div>
            <h2 style={styles.cardTitle}>{title}</h2>
            <p style={styles.cardDesc}>{desc}</p>
            <span style={{ ...styles.cta, color: accent }}>
              Open <ArrowRight size={14} strokeWidth={2} />
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '90vh',
    padding: '80px 40px',
    background: '#0c0c14',
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    color: 'white',
  },
  header: { textAlign: 'center', maxWidth: '620px', margin: '0 auto 64px' },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#b8b8d0',
    fontSize: '12.5px',
    fontWeight: 500,
    marginBottom: '22px',
  },
  heading: {
    fontSize: '38px',
    fontWeight: 600,
    letterSpacing: '-0.8px',
    marginBottom: '14px',
    lineHeight: 1.2,
  },
  subheading: { color: '#8f8fa8', fontSize: '15.5px', lineHeight: 1.6 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  card: {
    background: '#14141f',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    padding: '28px 24px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'border-color 0.2s ease',
  },
  iconWrap: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '18px',
  },
  cardTitle: { fontSize: '17px', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.2px' },
  cardDesc: { color: '#9494ab', fontSize: '13.5px', lineHeight: 1.6, marginBottom: '20px' },
  cta: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 600 },
};

export default Home;