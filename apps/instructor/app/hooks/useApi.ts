'use client'
import { apiClient, api } from "../utils/apiClient";

/**
 * Hook for API operations using the centralized apiClient
 * This hook provides a convenient interface while using the centralized
 * apiClient with automatic token handling
 */
const useApi = () => {

  const getRequest = async (endpoint: string) => {
    try {
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const postRequest = async (endpoint: string, data: any, isFormData: boolean = false) => {
    try {
      const response = await api.post(endpoint, data, {
        isJson: !isFormData,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  const putRequest = async (endpoint: string, data: any) => {
    try {
      const response = await api.put(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  const deleteRequest = async (endpoint: string) => {
    try {
      const response = await api.delete(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  return { 
    get: getRequest, 
    post: postRequest, 
    put: putRequest, 
    delete: deleteRequest,
    // Also provide direct access to the centralized API client
    apiClient,
    api,
  };
};

export default useApi;