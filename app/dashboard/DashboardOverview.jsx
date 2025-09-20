"use client";
import React, { useState, useEffect } from 'react';
import { Alert } from '@mui/material';
import { PendingActions, MonetizationOn, Assessment, Analytics, AccountBalance } from '@mui/icons-material';
import AccountingChart from './AccountingChart';
import FinancialSummary from '../adt/FinancialSummary';
import { getDashboardData } from './dashboardService';
import styles from './DashboardOverview.module.css';

const MetricCard = ({ icon: Icon, title, value, subtitle, gradient, delay = 0, isLoading }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible && typeof value === 'number' && !isLoading) {
      const duration = 2500;
      const steps = 80;
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
    } else if (isVisible && !isLoading) {
      setAnimatedValue(value);
    }
  }, [isVisible, value, isLoading]);

  const formatValue = (val) => {
    if (typeof val === 'number' && val > 999999) {
      return `UGX ${val.toLocaleString()}`;
    }
    return typeof val === 'number' ? val.toLocaleString() : val || 0;
  };

  return (
    <div 
      className={`${styles.metricCard} ${isVisible ? styles.metricCardVisible : ''}`}
      style={{ 
        animationDelay: `${delay}ms`,
        background: gradient 
      }}
    >
      <div className={styles.cardGlow}></div>
      <div className={styles.cardHeader}>
        <div className={styles.iconContainer}>
          <Icon className={styles.metricIcon} />
          <div className={styles.iconRipple}></div>
        </div>
        <div className={styles.sparkline}></div>
      </div>
      
      <div className={styles.metricContent}>
        <div className={styles.mainMetric}>
          {isLoading ? (
            <div className={styles.loadingBar}></div>
          ) : (
            <span className={styles.metricValue}>
              {formatValue(animatedValue)}
            </span>
          )}
        </div>
        <h3 className={styles.metricTitle}>{title}</h3>
        {subtitle && <p className={styles.metricSubtitle}>{subtitle}</p>}
      </div>
      
      <div className={styles.cardFooter}>
        <div className={styles.metricProgress}>
          <div 
            className={styles.progressTrack}
            style={{ width: isVisible && !isLoading ? '100%' : '0%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const ChartSection = ({ data, isLoading }) => {
  return (
    <div className={`${styles.chartContainer} ${!isLoading ? styles.chartVisible : ''}`}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitleSection}>
          <Assessment className={styles.chartIcon} />
          <div>
            <h2 className={styles.chartTitle}>Financial Analytics</h2>
            <p className={styles.chartSubtitle}>Real-time financial performance overview</p>
          </div>
        </div>
        <div className={styles.chartControls}>
          <div className={styles.liveIndicator}>
            <div className={styles.liveDot}></div>
            <span>Live Data</span>
          </div>
        </div>
      </div>
      
      <div className={styles.chartContent}>
        {isLoading ? (
          <div className={styles.chartLoading}>
            <div className={styles.chartSkeleton}></div>
            <div className={styles.loadingText}>Loading analytics...</div>
          </div>
        ) : (
          <AccountingChart data={data.chartData || { labels: [], datasets: [] }} />
        )}
      </div>
    </div>
  );
};

export default function DashboardOverview() {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const metricsData = [
    {
      icon: Analytics,
      title: "Total Transactions",
      value: data.totalTransactions || 0,
      subtitle: "All time transactions",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      icon: PendingActions,
      title: "Pending Transactions",
      value: data.pendingTransactions || 0,
      subtitle: "Awaiting processing",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      icon: MonetizationOn,
      title: "Total Revenue",
      value: data.totalRevenue || 0,
      subtitle: "Current fiscal period",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.backgroundPattern}></div>
      
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <AccountBalance className={styles.headerIcon} />
            <div>
              <h1 className={styles.dashboardTitle}>
                <span className={styles.titleGradient}>Accounting Dashboard</span>
              </h1>
              <p className={styles.dashboardSubtitle}>
                Complete financial overview and analytics
              </p>
            </div>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.quickStat}>
              <span className={styles.statValue}>98.5%</span>
              <span className={styles.statLabel}>Uptime</span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.statValue}>2.3s</span>
              <span className={styles.statLabel}>Avg Response</span>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <Alert severity="error" className={styles.errorAlert}>
          {error}
        </Alert>
      )}

      <section className={styles.metricsSection}>
        <div className={styles.metricsGrid}>
          {metricsData.map((metric, index) => (
            <MetricCard
              key={metric.title}
              icon={metric.icon}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              gradient={metric.gradient}
              delay={index * 150}
              isLoading={isLoading}
            />
          ))}
        </div>
      </section>

      <section className={styles.analyticsSection}>
        <ChartSection data={data} isLoading={isLoading} />
      </section>

      <section className={styles.summarySection}>
        <FinancialSummary />
      </section>

      <div className={styles.floatingElements}>
        <div className={styles.floatingCircle1}></div>
        <div className={styles.floatingCircle2}></div>
        <div className={styles.floatingCircle3}></div>
      </div>
    </div>
  );
}