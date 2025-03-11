import { publicClient, protectedClient } from "./api";

export const resourceApi = {
  // Public Routes
  public: {
    // Get facilities with filters
    getFacilities: async (params) => {
      const response = await publicClient.get("/resources/facilities", { params });
      return response.data;
    },
    
    // Get guides with filters
    getGuides: async (params) => {
      const response = await publicClient.get("/resources/guides", { params });
      return response.data;
    },
    
    // Get emergency contacts
    getEmergencyContacts: async (params) => {
      const response = await publicClient.get("/resources/emergency-contacts", { params });
      return response.data;
    },
    
    // Get nearby facilities
    getNearbyFacilities: async (params) => {
      const response = await publicClient.get("/resources/facilities/nearby", { params });
      return response.data;
    },
    
    // Get resource by ID
    getResourceById: async (id) => {
      const response = await publicClient.get(`/resources/${id}`);
      return response.data;
    }
  },
  
  // Protected Routes (require authentication)
  protected: {
    // Get all resources (verified users only)
    getAllResources: async () => {
      const response = await protectedClient.get("/resources");
      return response.data;
    },
    
    // Get resources verified in the last month
    getLastMonthVerifiedResources: async () => {
      const response = await protectedClient.get("/resources/verified/last-month");
      return response.data;
    },
    
    // Create a new resource
    createResource: async (resourceData) => {
      const response = await protectedClient.post("/resources", resourceData);
      return response.data;
    },
    
    // Update a resource
    updateResource: async (id, updateData) => {
      const response = await protectedClient.put(`/resources/${id}`, updateData);
      return response.data;
    },
    
    // Delete a resource
    deleteResource: async (id) => {
      const response = await protectedClient.delete(`/resources/${id}`);
      return response.data;
    }
  }
};