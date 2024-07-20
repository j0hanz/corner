import React from 'react';
import styles from './styles/Avatar.module.css';

const Avatar = React.forwardRef(({ src, size, text }, ref) => (
  <span ref={ref}>
    <img
      className={styles.Icon}
      src={src}
      height={size}
      width={size}
      alt="Avatar"
    />
    {text && <span className={styles.text}>{text}</span>}
  </span>
));

export default Avatar;
