import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5000/api' })

const setToken = (t) => {
  if (t) API.defaults.headers.common['Authorization'] = `Bearer ${t}`
  else delete API.defaults.headers.common['Authorization']
}

const register = async (data) => { const res = await API.post('/auth/register', data); setToken(res.data.token); return res.data }
const login = async (data) => { const res = await API.post('/auth/login', data); setToken(res.data.token); return res.data }
const getProfile = async () => { const res = await API.get('/profile'); return res.data }
const updateProfile = async (data) => { const res = await API.put('/profile', data); return res.data }
const getFoods = async () => { const res = await API.get('/foods'); return res.data }
const getMeals = async (date) => { const res = await API.get('/meals', { params: { date } }); return res.data }
const addMeal = async (payload) => { const res = await API.post('/meals', payload); return res.data }
const deleteMeal = async (id) => { const res = await API.delete(`/meals/${id}`); return res.data }
const getStats = async (date) => { const res = await API.get('/stats', { params: { date } }); return res.data }

export default { setToken, register, login, getProfile, updateProfile, getFoods, getMeals, addMeal, deleteMeal, getStats }
