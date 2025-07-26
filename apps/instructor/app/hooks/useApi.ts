'use client'
import { useEffect, useRef } from "react";
import axios from "axios"

const useApi = () => {

  const getRequest = async(endpoint: string)=>{
        try{
            const response = await axios.get(endpoint)
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
      })
      return response.data
    }catch(error){
        throw error
    }
  }

  const putRequest = async()=>{

  }

  const deleteRequest =async()=>{

  }

  

  return { get:getRequest, post:postRequest, put:putRequest, delete:deleteRequest };
};

export default useApi;
