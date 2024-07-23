import React from 'react';
import styles from './styles/Avatar.module.css';

const Avatar = React.forwardRef(({ src, height = 45, text }, ref) => {
  return (
    <span ref={ref} className={styles.Avatar}>
      <img
        className={styles.Icon}
        src={src}
        height={height}
        width={height}
        alt="Avatar"
      />
      {text && <span className={styles.Text}>{text}</span>}
    </span>
  );
});

export default Avatar;
