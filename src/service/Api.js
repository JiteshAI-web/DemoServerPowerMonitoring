import axios from "axios";


const apiUrl = import.meta.env.VITE_API_URL;
const getToken = () => {
    const storedData = localStorage.getItem("loggedData");
    const userData = storedData ? JSON.parse(storedData) : null;
    return userData?.token;
}
export const createSession = async (data) => {
    try {
        const token = getToken();
        const response = await axios.post(`${apiUrl}/api/sessions/`,data,
            {
                headers:{
                    Authorization:`Token ${token}`,
                    "Content-Type":"application/json",
                },
            }
        );
        return response.data;
    }
     catch(error) {
        throw error.response?.data || error.message;
    }

}

export const getSessionById = async (id) => {
    try {
        const token = getToken();
        const response = await axios.get(`${apiUrl}/api/sessions/${id}`, {
            headers:{
                Authorization:`Token ${token}`
            },
        });
        console.log(response)
        return response.data;
    } catch(error) {
        throw error.response?.data || error.message;
    }
}

//Abort Api

export const abortSession = async (sessionId) => {
    try{
        const token = getToken();
        const res = await axios.post(`${apiUrl}/api/abort-session/`, {
            "session_id": sessionId
        }, {
            headers:{
                Authorization:`Token ${token}`,
                "Content-Type": "application/json" ,
            },
        });
        return res.data;
    } catch(error) {
        console.error(error)
    }
}