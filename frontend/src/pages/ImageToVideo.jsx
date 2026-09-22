import { useState } from 'react';
import { motion } from 'framer-motion';
import { Images, Download, Loader2, AlertCircle, UploadCloud } from 'lucide-react';
import api from '../services/api';

function ImageToVideo() {
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setLoading(true);
    setError('');
    setVideoUrl('');

    const formData = new FormData();
    images.forEach((img) => formData.append('images', img));
    formData.append('caption', caption);

    try {
      const response = await api.post('/api/image-to-video/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setVideoUrl(response.data.videoUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `ai-slideshow-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div style={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.container}
      >
        <div style={styles.header}>
          <div style={{ ...styles.iconWrap, background: 'rgba(245,161,94,0.12)', color: '#f5a15e' }}>
            <Images size={20} strokeWidth={1.6} />
          </div>
          <div>
            <h1 style={styles.title}>Image to Video</h1>
            <p style={styles.subtitle}>Upload photos to create a captioned slideshow video</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.uploadBox}>
            <UploadCloud size={22} strokeWidth={1.6} color="#71718a" />
            <span style={styles.uploadText}>
              {images.length > 0 ? `${images.length} image(s) selected` : 'Click to select images'}
            </span>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} style={styles.hiddenInput} />
          </label>

          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. My trip to Goa"
            style={styles.input}
          />

          <motion.button
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin" /> Creating video...
              </>
            ) : (
              'Generate Video'
            )}
          </motion.button>
        </form>

        {loading && <p style={styles.hint}>Processing and uploading your video, this can take 1-2 minutes.</p>}

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={16} strokeWidth={1.8} />
            <span>{error}</span>
          </div>
        )}

        {videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.resultBox}
          >
            <video src={videoUrl} controls autoPlay loop style={styles.media} />
            <button onClick={handleDownload} style={styles.downloadBtn}>
              <Download size={15} strokeWidth={1.8} />
              <span>Download Video</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '90vh',
    background: '#0c0c14',
    padding: '60px 24px',
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },
  container: { maxWidth: '560px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' },
  iconWrap: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: { fontSize: '20px', fontWeight: 600, color: 'white', letterSpacing: '-0.3px' },
  subtitle: { fontSize: '13.5px', color: '#8f8fa8', marginTop: '2px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  uploadBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '28px',
    borderRadius: '12px',
    border: '1.5px dashed rgba(255,255,255,0.15)',
    background: '#14141f',
    cursor: 'pointer',
    textAlign: 'center',
  },
  uploadText: { fontSize: '13.5px', color: '#8f8fa8' },
  hiddenInput: { display: 'none' },
  input: {
    padding: '13px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: '#14141f',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '13px',
    background: '#f5a15e',
    color: '#0c0c14',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14.5px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  hint: { marginTop: '14px', color: '#71718a', fontSize: '13px' },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '14px',
    padding: '12px 14px',
    borderRadius: '10px',
    background: 'rgba(248,113,113,0.1)',
    border: '1px solid rgba(248,113,113,0.25)',
    color: '#f87171',
    fontSize: '13.5px',
  },
  resultBox: { marginTop: '24px' },
  media: { width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' },
  downloadBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '14px',
    padding: '11px 18px',
    background: '#14141f',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'white',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: 500,
    cursor: 'pointer',
  },
};

export default ImageToVideo;