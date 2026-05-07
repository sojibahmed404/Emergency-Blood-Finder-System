import api from './api'

export const adminService = {
  getStats:       ()    => api.get('/admin/stats').then(r => r.data),
  getUsers:       ()    => api.get('/admin/users').then(r => r.data),
  toggleBlock:    (id)  => api.put(`/admin/users/${id}/block`).then(r => r.data),
  deleteUser:     (id)  => api.delete(`/admin/users/${id}`).then(r => r.data),
}
