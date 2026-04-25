const API_BASE_URL = 'http://localhost:5000/api';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_VISIT') {
    handlePageVisit(message.data);
  }
  return true;
});

async function handlePageVisit(data) {
  try {
    const result = await chrome.storage.local.get(['employeeId']);
    const employeeId = result.employeeId;

    if (!employeeId) {
      console.warn('Vigil: No Employee ID configured');
      return;
    }

    const payload = {
      employeeId: employeeId,
      description: `Visited: ${data.title} (${data.url})`,
      status: 'Normal'
    };

    // Check for obvious "suspicious" patterns locally as well to set Critical status
    const suspiciousKeywords = ['hacking', 'malware', 'exploit', 'restricted', 'attack', 'illegal'];
    const isSuspicious = suspiciousKeywords.some(keyword => 
      data.url.toLowerCase().includes(keyword) || data.title.toLowerCase().includes(keyword)
    );

    if (isSuspicious) {
      payload.status = 'Critical';
      payload.reason = 'Accessing Restricted Content';
    }

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('Vigil: Failed to send event to backend', await response.text());
    } else {
      console.log('Vigil: Event tracked successfully');
    }
  } catch (error) {
    console.error('Vigil: Error in background script', error);
  }
}
