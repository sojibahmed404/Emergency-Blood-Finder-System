import api from './api'

export const requestService = {
  create:          (data)       => api.post('/requests', data).then(r => r.data),
  getMine:         ()           => api.get('/requests/mine').then(r => r.data),
  getIncoming:     ()           => api.get('/requests/incoming').then(r => r.data),
  updateStatus:    (id, status) => api.put(`/requests/${id}/status`, null, { params: { status } }).then(r => r.data),
}
