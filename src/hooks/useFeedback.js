import { useState } from 'react';
import apiClient from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useFeedback() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const submitFeedback = async (feedbackData) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/feedback', feedbackData);
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
      
      return response.data;
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "Failed to submit feedback",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page?.toString() || '1',
        limit: filters.limit?.toString() || '10',
        ...filters
      });

      const response = await apiClient.get(`/feedback?${queryParams}`);
      
      setFeedbacks(response.data.feedbacks);
      setPagination({
        currentPage: parseInt(filters.page || 1),
        totalPages: Math.ceil(response.data.total / (filters.limit || 10)),
        total: response.data.total
      });

      return response.data;
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch feedbacks",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/feedback/my');
      setFeedbacks(response.data);
      return response.data;
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch your feedbacks",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFeedback = async (feedbackId, updateData) => {
    try {
      setLoading(true);
      const response = await apiClient.patch(`/feedback/${feedbackId}`, updateData);
      
      toast({
        title: "Feedback Updated",
        description: "The feedback has been updated successfully.",
      });
      
      return response.data;
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update feedback",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (feedbackId) => {
    try {
      setLoading(true);
      await apiClient.delete(`/feedback/${feedbackId}`);
      
      toast({
        title: "Feedback Deleted",
        description: "The feedback has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: error.response?.data?.message || "Failed to delete feedback",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    feedbacks,
    pagination,
    loading,
    submitFeedback,
    fetchFeedbacks,
    fetchMyFeedbacks,
    updateFeedback,
    deleteFeedback
  };
} 