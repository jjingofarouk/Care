"use client";

import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.title}>Hospital Management System</h3>
          <p className={styles.text}>Providing comprehensive healthcare solutions since 2025.</p>
        </div>
        <div className={styles.section}>
          <h4 className={styles.subtitle}>Quick Links</h4>
          <ul className={styles.links}>
            <li><a href="/about" className={styles.link}>About Us</a></li>
            <li><a href="/contact" className={styles.link}>Contact</a></li>
            <li><a href="/privacy" className={styles.link}>Privacy Policy</a></li>
            <li><a href="/terms" className={styles.link}>Terms of Service</a></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4 className={styles.subtitle}>Contact Info</h4>
          <p className={styles.text}>123 Health St, Medical City</p>
          <p className={styles.text}>Email: support@hms.com</p>
          <p className={styles.text}>Phone: (123) 456-7890</p>
        </div>
      </div>
      <div className={styles.bottom}>
        <p className={styles.text}>&copy; {new Date().getFullYear()} HMS. All rights reserved.</p>
      </div>
    </footer>
  );
}