import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const api = {
    getConfig: async () => {
        const response = await axios.get(`${API_URL}/config`);
        return response.data;
    },
    predict: async (data: any) => {
        const response = await axios.post(`${API_URL}/predict`, data);
        return response.data;
    },
    health: async () => {
        const response = await axios.get(`${API_URL}/health`);
        return response.data;
    }
};
