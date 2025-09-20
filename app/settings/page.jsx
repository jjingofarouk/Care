// settings/page.jsx
import React from 'react';
import SettingsList from './SettingsList';
import SettingsForm from './SettingsForm';

const SettingsPage = () => {
  return (
    <div>
      <h1>Settings Management</h1>
      <SettingsForm />
      <SettingsList />
    </div>
  );
};

export default SettingsPage;
