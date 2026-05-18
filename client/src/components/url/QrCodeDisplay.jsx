import { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'framer-motion';
import { HiOutlineDownload } from 'react-icons/hi';

export default function QrCodeDisplay({ url, size = 200 }) {
  const [qrImageUrl, setQrImageUrl] = useState('');
  const canvasContainerRef = useRef();

  useEffect(() => {
    // Generate high-resolution canvas data URL
    const canvas = canvasContainerRef.current?.querySelector('canvas');
    if (canvas) {
      setQrImageUrl(canvas.toDataURL('image/png'));
    }
  }, [url, size]);

  const downloadQR = () => {
    if (!qrImageUrl) return;
    const link = document.createElement('a');
    link.download = `sniplink-qr-${Date.now()}.png`;
    link.href = qrImageUrl;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 flex flex-col items-center gap-4"
    >
      <h3 className="text-sm font-semibold text-dark-300">QR Code</h3>

      {/* Hidden container for rendering canvas at high quality */}
      <div ref={canvasContainerRef} style={{ display: 'none' }}>
        <QRCodeCanvas
          value={url}
          size={size * 2} // Double size for crystal-clear high-definition rendering
          bgColor="#020617" // Dark slate background matching the card design
          fgColor="#a5b4fc" // Premium light indigo color scheme
          level="H"
          includeMargin={true}
        />
      </div>

      {/* Visible Draggable & Right-Clickable Image */}
      <div
        className="p-4 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        {qrImageUrl ? (
          <img
            src={qrImageUrl}
            alt="QR Code"
            width={size}
            height={size}
            className="draggable-qr rounded-lg transition-transform hover:scale-105 duration-200"
            style={{ display: 'block', cursor: 'grab' }}
            draggable="true"
          />
        ) : (
          <div style={{ width: size, height: size }} className="animate-pulse bg-white/5 rounded-lg" />
        )}
      </div>

      <button
        onClick={downloadQR}
        className="btn-secondary"
        style={{ padding: '8px 16px', fontSize: '0.8rem' }}
      >
        <HiOutlineDownload />
        Download PNG
      </button>
    </motion.div>
  );
}
