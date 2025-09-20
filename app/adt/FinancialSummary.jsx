"use client";
import React, { useState, useEffect } from 'react';
import { Alert } from '@mui/material';
import { TrendingUp, People, LocalHospital, Bed, AccountBalance, MonetizationOn } from '@mui/icons-material';
import { getWards, getDoctors, getPatients, getAdmissions, getTransactions } from './adtService';
import styles from './ADTDashboard.module.css';

const StatCard = ({ icon: Icon, title, value, gradient, delay = 0, trend, trendValue }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible && typeof value === 'number') {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    } else if (isVisible) {
      setAnimatedValue(value);
    }
  }, [isVisible, value]);

  const formatValue = (val) => {
    if (typeof val === 'number' && val > 999999) {
      return `UGX ${val.toLocaleString()}`;
    }
    return typeof val === 'number' ? val.toLocaleString() : val;
  };

  return (
    <div 
      className={`${styles.statCard} ${isVisible ? styles.statCardVisible : ''}`}
      style={{ 
        animationDelay: `${delay}ms`,
        background: gradient 
      }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          <Icon className={styles.cardIcon} />
          <div className={styles.iconGlow}></div>
        </div>
        {trend && (
          <div className={`${styles.trendIndicator} ${trend === 'up' ? styles.trendUp : styles.trendDown}`}>
            <TrendingUp className={styles.trendIcon} />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.valueContainer}>
          <span className={styles.mainValue}>
            {formatValue(animatedValue)}
          </span>
        </div>
        <p className={styles.cardTitle}>{title}</p>
      </div>
      
      <div className={styles.cardFooter}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: isVisible ? '100%' : '0%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default function FinancialSummary() {
  const [summary, setSummary] = useState({
    totalWards: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAdmissions: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    totalRevenue: 0,
    totalExpenses: 0,
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setIsLoading(true);
        const [wards, doctors, patients, admissions, transactions] = await Promise.all([
          getWards(),
          getDoctors(),
          getPatients(),
          getAdmissions(),
          getTransactions(),
        ]);

        const totalBeds = wards.reduce((sum, ward) => sum + ward.totalBeds, 0);
        const occupiedBeds = wards.reduce((sum, ward) => sum + ward.occupiedBeds, 0);
        const totalRevenue = transactions
          .filter((t) => t.type === 'Revenue')
          .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions
          .filter((t) => t.type === 'Expense')
          .reduce((sum, t) => sum + t.amount, 0);

        setSummary({
          totalWards: wards.length,
          totalDoctors: doctors.length,
          totalPatients: patients.length,
          totalAdmissions: admissions.length,
          totalBeds,
          occupiedBeds,
          totalRevenue,
          totalExpenses,
        });
      } catch (error) {
        console.error('Error fetching summary data:', error);
        setError('Failed to load financial summary');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  const cardData = [
    {
      icon: LocalHospital,
      title: "Total Wards",
      value: summary.totalWards,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      trend: "up",
      trendValue: "+5%"
    },
    {
      icon: People,
      title: "Total Doctors",
      value: summary.totalDoctors,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      trend: "up",
      trendValue: "+12%"
    },
    {
      icon: People,
      title: "Total Patients",
      value: summary.totalPatients,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      trend: "up",
      trendValue: "+8%"
    },
    {
      icon: TrendingUp,
      title: "Total Admissions",
      value: summary.totalAdmissions,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      trend: "up",
      trendValue: "+15%"
    },
    {
      icon: Bed,
      title: "Total Beds",
      value: summary.totalBeds,
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      trend: "up",
      trendValue: "+3%"
    },
    {
      icon: Bed,
      title: "Occupied Beds",
      value: summary.occupiedBeds,
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      trend: "down",
      trendValue: "-2%"
    },
    {
      icon: MonetizationOn,
      title: "Total Revenue",
      value: summary.totalRevenue,
      gradient: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
      trend: "up",
      trendValue: "+22%"
    },
    {
      icon: AccountBalance,
      title: "Total Expenses",
      value: summary.totalExpenses,
      gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
      trend: "down",
      trendValue: "-5%"
    }
  ];

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.headerSection}>
        <div className={styles.titleContainer}>
          <h1 className={styles.dashboardTitle}>
            <span className={styles.titleGradient}>ADT Financial Dashboard</span>
          </h1>
          <p className={styles.subtitle}>Real-time hospital management insights</p>
        </div>
        <div className={styles.headerDecoration}></div>
      </div>

      {error && (
        <Alert severity="error" className={styles.errorAlert}>
          {error}
        </Alert>
      )}

      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading dashboard data...</p>
        </div>
      )}

      <div className={styles.statsGrid}>
        {cardData.map((card, index) => (
          <StatCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            value={card.value}
            gradient={card.gradient}
            delay={index * 100}
            trend={card.trend}
            trendValue={card.trendValue}
          />
        ))}
      </div>

      <div className={styles.backgroundEffects}>
        <div className={styles.floatingShape1}></div>
        <div className={styles.floatingShape2}></div>
        <div className={styles.floatingShape3}></div>
      </div>
    </div>
  );
}