import api from './api'

export const bloodBankService = {
  getAll:   (params) => api.get('/bloodbanks', { params }).then(r => r.data),
  getById:  (id)     => api.get(`/bloodbanks/${id}`).then(r => r.data),
  create:   (data)   => api.post('/bloodbanks', data).then(r => r.data),
  update:   (id, d)  => api.put(`/bloodbanks/${id}`, d).then(r => r.data),
  delete:   (id)     => api.delete(`/bloodbanks/${id}`).then(r => r.data),
}
