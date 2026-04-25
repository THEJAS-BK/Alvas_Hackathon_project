document.addEventListener('DOMContentLoaded', () => {
  const employeeIdInput = document.getElementById('employeeId');
  const saveBtn = document.getElementById('saveBtn');
  const statusEl = document.getElementById('status');

  // Load existing ID
  chrome.storage.local.get(['employeeId'], (result) => {
    if (result.employeeId) {
      employeeIdInput.value = result.employeeId;
    }
  });

  // Save new ID
  saveBtn.addEventListener('click', () => {
    const employeeId = employeeIdInput.value.trim();
    if (employeeId) {
      chrome.storage.local.set({ employeeId }, () => {
        statusEl.style.display = 'block';
        setTimeout(() => {
          statusEl.style.display = 'none';
        }, 2000);
      });
    }
  });
});
