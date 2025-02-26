import { apiClient } from "@/config/axiosconfig";
import { IUserProfile} from "@/entities/auth";

export const getProfile = async (token : string): Promise<IUserProfile> => {
   
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const response = await apiClient.get<IUserProfile>("auth/profile", config);
    return response.data; 
  
  };