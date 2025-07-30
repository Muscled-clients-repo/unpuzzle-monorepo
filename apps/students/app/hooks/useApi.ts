'use client'
import axios from "axios"

const useApi = () => {

  const getRequest = async(endpoint: string)=>{
        try{
            const response = await axios.get(endpoint, {
                withCredentials: true
            })
            return response.data
        }catch(error){
            throw error
        }
  };

  const postRequest = async(endpoint: string, formData:FormData)=> {
    try{
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      })
      return response.data
    }catch(error){
        throw error
    }
  }

  const putRequest = async(endpoint: string, data: unknown) => {
    try {
      const response = await axios.put(endpoint, data, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const deleteRequest = async(endpoint: string) => {
    try {
      const response = await axios.delete(endpoint, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  return { get:getRequest, post:postRequest, put:putRequest, delete:deleteRequest };
};

export default useApi;
