import React from 'react';
import styles from './styles/Avatar.module.css';


const Avatar = React.forwardRef(({ src, height = 45, text }, ref) => {
  return (
    <span ref={ref}>
      <img
        className={styles.Icon}
        src={src}
        height={height}
        width={height}
        alt="Icon"
      />
      {text}
    </span>
  );
});

export default Avatar;