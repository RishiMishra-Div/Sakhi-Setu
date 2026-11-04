const API_BASE = '/api';

export const getHeaders = () => {
  const token = localStorage.getItem('sakhisetu_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  register: async (registrationData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData)
    });
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : null;
    if (!res.ok) throw new Error(data?.message || `Server error (${res.status}). Please try again later.`);
    if (!data) throw new Error('The server returned an unexpected response. Please try again later.');
    return data;
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : null;
    if (!res.ok) throw new Error(data?.message || `Server error (${res.status}). Please try again later.`);
    if (!data) throw new Error('The server returned an unexpected response. Please try again later.');
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch user session');
    return await res.json();
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to change password');
    return data;
  },

  // Group
  getGroup: async () => {
    const res = await fetch(`${API_BASE}/group`);
    return await res.json();
  },

  updateGroup: async (groupData) => {
    const res = await fetch(`${API_BASE}/group`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(groupData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update group');
    return data;
  },

  // Dashboard & Reports
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/reports/dashboard`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load dashboard data');
    return await res.json();
  },

  getMonthlyReport: async (month, type) => {
    const res = await fetch(`${API_BASE}/reports/monthly?month=${month}&type=${type || 'all'}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load report data');
    return await res.json();
  },

  // Members
  getMembers: async (search = '', status = 'all') => {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (status) query.append('status', status);

    const res = await fetch(`${API_BASE}/members?${query.toString()}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch members');
    return await res.json();
  },

  getMemberById: async (id) => {
    const res = await fetch(`${API_BASE}/members/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch member details');
    return await res.json();
  },

  createMember: async (memberData) => {
    const res = await fetch(`${API_BASE}/members`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(memberData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create member');
    return data;
  },

  updateMember: async (id, memberData) => {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(memberData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update member');
    return data;
  },

  toggleMemberStatus: async (id) => {
    const res = await fetch(`${API_BASE}/members/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to toggle status');
    return data;
  },

  // Meetings
  getMeetings: async (status = 'all') => {
    const res = await fetch(`${API_BASE}/meetings?status=${status}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch meetings');
    return await res.json();
  },

  getMeetingById: async (id) => {
    const res = await fetch(`${API_BASE}/meetings/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch meeting');
    return await res.json();
  },

  createMeeting: async (meetingData) => {
    const res = await fetch(`${API_BASE}/meetings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(meetingData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create meeting');
    return data;
  },

  saveMeetingAttendance: async (meetingId, records) => {
    const res = await fetch(`${API_BASE}/meetings/${meetingId}/attendance`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ records })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save attendance');
    return data;
  },

  // Savings
  getSavings: async (memberId = '', monthYear = '') => {
    const query = new URLSearchParams();
    if (memberId) query.append('memberId', memberId);
    if (monthYear) query.append('monthYear', monthYear);

    const res = await fetch(`${API_BASE}/savings?${query.toString()}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch savings');
    return await res.json();
  },

  createSavings: async (savingsData) => {
    const res = await fetch(`${API_BASE}/savings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(savingsData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to record savings');
    return data;
  },

  getSavingsSummary: async () => {
    const res = await fetch(`${API_BASE}/savings/summary`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch savings summary');
    return await res.json();
  },

  // Loans
  getLoans: async (status = 'all') => {
    const res = await fetch(`${API_BASE}/loans?status=${status}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch loans');
    return await res.json();
  },

  createLoan: async (loanData) => {
    const res = await fetch(`${API_BASE}/loans`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(loanData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create loan');
    return data;
  },

  recordRepayment: async (loanId, repaymentData) => {
    const res = await fetch(`${API_BASE}/loans/${loanId}/repayments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(repaymentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to record repayment');
    return data;
  },

  // Products
  getProducts: async (category = 'All', search = '') => {
    const query = new URLSearchParams();
    if (category && category !== 'All' && category !== 'सर्व') query.append('category', category);
    if (search) query.append('search', search);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  },

  createProduct: async (productData) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add product');
    return data;
  },

  deleteProduct: async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete product');
    return data;
  },

  sendProductInquiry: async (inquiryData) => {
    const res = await fetch(`${API_BASE}/products/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit inquiry');
    return data;
  },

  // Announcements
  getAnnouncements: async (status = 'active') => {
    const res = await fetch(`${API_BASE}/announcements?status=${status}`);
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return await res.json();
  },

  createAnnouncement: async (announcementData) => {
    const res = await fetch(`${API_BASE}/announcements`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(announcementData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create announcement');
    return data;
  },

  deleteAnnouncement: async (id) => {
    const res = await fetch(`${API_BASE}/announcements/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete announcement');
    return data;
  }
};
