import api from './api'

export const donorService = {
  getAll:       ()         => api.get('/donors').then(r => r.data),
  search:       (params)   => api.get('/donors/search', { params }).then(r => r.data),
  getById:      (id)       => api.get(`/donors/${id}`).then(r => r.data),
  getMe:        ()         => api.get('/donors/me').then(r => r.data),
  saveProfile:  (data)     => api.post('/donors/profile', data).then(r => r.data),
  quickAdd:     (data)     => api.post('/donors/quick-add', data).then(r => r.data),
}
