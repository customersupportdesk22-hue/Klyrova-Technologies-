'use strict';
(() => {
  const $ = (id) => document.getElementById(id);
  const KEY = 'klyrova_command_centre_session_secret';
  const loginPanel = $('loginPanel');
  const dashboard = $('dashboard');
  const form = $('loginForm');
  const secretInput = $('adminSecret');
  let secret = sessionStorage.getItem(KEY) || '';

  function showDashboard(show) {
    loginPanel.classList.toggle('hidden', show);
    dashboard.classList.toggle('hidden', !show);
  }
  function duration(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return days ? days + 'd ' + hours + 'h' : hours ? hours + 'h ' + minutes + 'm' : minutes + 'm';
  }
  function setValue(id, value, state) {
    const el = $(id);
    el.textContent = value;
    el.className = state || '';
  }
  async function checkSystems(candidate = secret) {
    $('refreshButton').disabled = true;
    $('overallStatus').textContent = 'Checking systems…';
    try {
      const response = await fetch('/api/admin/system-health', {
        headers: { Authorization: 'Bearer ' + candidate },
        cache: 'no-store'
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 503) {
        throw new Error(data.error || 'Access could not be verified.');
      }
      if (!response.ok) throw new Error(data.error || 'Health check failed.');
      secret = candidate;
      sessionStorage.setItem(KEY, secret);
      showDashboard(true);
      setValue('appStatus', 'Running', 'metric-value good');
      setValue('dbStatus', data.database.status === 'connected' ? 'Connected' : 'Unavailable', 'metric-value ' + (data.database.status === 'connected' ? 'good' : 'bad'));
      setValue('uptime', duration(data.application.uptimeSeconds), 'metric-value');
      setValue('memory', data.memory.rssMb + ' MB', 'metric-value');
      setValue('runtime', data.application.nodeVersion, 'metric-value');
      const date = new Date(data.checkedAt);
      setValue('lastCheck', date.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), 'metric-value');
      setValue('appCheck', 'Operational', 'good');
      setValue('dbCheck', data.database.status === 'connected' ? 'Connected' : 'Unavailable', data.database.status === 'connected' ? 'good' : 'bad');
      const healthy = data.database.status === 'connected';
      $('overallStatus').innerHTML = '<span class="dot"></span>' + (healthy ? 'All monitored systems operational' : 'Database needs attention');
      $('overallStatus').style.color = healthy ? '#8ef0c9' : '#ff9aa6';
      $('overallStatus').style.borderColor = healthy ? '#286b59' : '#8a3d4a';
      $('overallStatus').style.background = healthy ? '#123c38' : '#48232d';
      $('loginError').textContent = '';
    } catch (error) {
      if (candidate === secret) {
        sessionStorage.removeItem(KEY);
        secret = '';
        showDashboard(false);
      }
      $('loginError').textContent = error.message || 'Unable to verify access.';
    } finally {
      $('refreshButton').disabled = false;
      $('loginButton').disabled = false;
    }
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const candidate = secretInput.value.trim();
    if (candidate.length < 24) {
      $('loginError').textContent = 'Enter the administrator secret configured in hosting.';
      return;
    }
    $('loginButton').disabled = true;
    $('loginError').textContent = 'Verifying access…';
    await checkSystems(candidate);
    secretInput.value = '';
  });
  $('refreshButton').addEventListener('click', () => checkSystems());
  $('logoutButton').addEventListener('click', () => {
    sessionStorage.removeItem(KEY);
    secret = '';
    showDashboard(false);
    $('loginError').textContent = '';
  });
  if (secret) checkSystems(secret);
})();
