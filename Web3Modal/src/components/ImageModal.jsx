import React, { useState, forwardRef, useImperativeHandle } from 'react';

const ImageModal = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  const openModal = () => {
    setIsVisible(true);
  };

  const closeModal = () => {
    if (e.target === e.currentTarget) {
      setIsVisible(false);
    }
  };

  useImperativeHandle(ref, () => ({
    openModal,
  }));

  if (!isVisible) return null;
 
  return (
    <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
    onClick={closeModal}
  >
    <div onClick={(e) => e.stopPropagation()}>
      <img
        src="https://www.move-app.com/staking/importNFT.png"
        alt=""
        style={{ maxWidth: '100%', maxHeight: '90%', borderStyle: 'solid' }}
      />
      <span style={{ color: 'white', textAlign: 'center' }}>
        NFT address: 0x9E3CE1b7Ea3999983eCB65ee100dd4E86705EdD4
      </span>
    </div>
  </div>
  );
});

export default ImageModal;
