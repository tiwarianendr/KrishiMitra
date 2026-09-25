export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  preferred_language: string;
  state?: string;
  district?: string;
  created_at?: string;
}

export interface PredictionResult {
  id?: number;
  disease_key: string;
  crop: string;
  crop_hi?: string;
  disease: string;
  disease_hi?: string;
  confidence: number;
  is_healthy: boolean;
  severity: string;
  description: string;
  description_hi?: string;
  symptoms: string[];
  symptoms_hi?: string[];
  treatment: {
    organic: string[];
    chemical: string[];
  };
  prevention: string[];
  next_steps: string;
  top_predictions?: {
    key: string;
    crop: string;
    disease: string;
    confidence: number;
  }[];
  image_url?: string;
  created_at?: string;
}

export interface WeatherData {
  source: string;
  location: string;
  latitude: number;
  longitude: number;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather_condition: string;
  weather_condition_hi?: string;
  weather_code?: number;
  weather_icon?: string;
  rainfall_mm: number;
  rain_probability?: number | null;
  last_updated: string;
}

export interface AgriResource {
  id: string;
  name: string;
  category: string;
  category_key: string;
  phone: string;
  address: string;
  distance_km?: number;
  latitude?: number;
  longitude?: number;
  is_verified_hotline: boolean;
  action_url: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("krishimitra_token");
    const headers: HeadersInit = {
      "Accept": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      ...this.getAuthHeaders(),
      ...(options.headers || {})
    };

    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
  }

  // Authentication
  async login(identifier: string, password: string):Promise<ApiResponse<{ token: string; user: User }>> {
    return this.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_or_phone: identifier, password })
    });
  }

  async signup(payload: {
    name: string;
    email_or_phone: string;
    password: string;
    preferred_language?: string;
    state?: string;
    district?: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.request("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request("/api/auth/me");
  }

  async updateProfile(payload: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return this.request("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  // Disease Prediction
  async predictDisease(imageFile: File, cropHint?: string): Promise<ApiResponse<PredictionResult>> {
    const formData = new FormData();
    formData.append("image", imageFile);
    if (cropHint) {
      formData.append("crop_hint", cropHint);
    }

    const token = localStorage.getItem("krishimitra_token");
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch("/api/predict", {
      method: "POST",
      headers,
      body: formData
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.error || "Failed to analyze leaf image.");
    }
    return data;
  }

  async getSupportedCrops(): Promise<ApiResponse<{ total_crops: number; total_conditions: number; crops: any[] }>> {
    return this.request("/api/predict/crops");
  }

  // History
  async getHistory(page: number = 1, perPage: number = 20): Promise<ApiResponse<{ predictions: PredictionResult[]; total: number; pages: number }>> {
    return this.request(`/api/history?page=${page}&per_page=${perPage}`);
  }

  async getPredictionDetails(id: number): Promise<ApiResponse<PredictionResult>> {
    return this.request(`/api/history/${id}`);
  }

  async deletePrediction(id: number): Promise<ApiResponse<void>> {
    return this.request(`/api/history/${id}`, {
      method: "DELETE"
    });
  }

  // Weather
  async getWeather(lat?: number, lon?: number, locationName?: string): Promise<ApiResponse<WeatherData>> {
    const params = new URLSearchParams();
    if (lat !== undefined && lon !== undefined) {
      params.append("lat", lat.toString());
      params.append("lon", lon.toString());
    }
    if (locationName) {
      params.append("location_name", locationName);
    }
    return this.request(`/api/weather?${params.toString()}`);
  }

  // Location
  async reverseGeocode(lat: number, lon: number): Promise<ApiResponse<{
    formatted_address: string;
    city: string;
    district: string;
    state: string;
    country: string;
  }>> {
    return this.request(`/api/location/reverse?lat=${lat}&lon=${lon}`);
  }

  // Nearby Resources
  async getNearbyResources(lat?: number, lon?: number, radiusKm: number = 25, category: string = "all"): Promise<ApiResponse<{
    latitude: number;
    longitude: number;
    search_radius_km: number;
    overpass_connected: boolean;
    nearby_establishments: AgriResource[];
    count_nearby: number;
    official_helplines: AgriResource[];
  }>> {
    const params = new URLSearchParams();
    if (lat !== undefined && lon !== undefined) {
      params.append("lat", lat.toString());
      params.append("lon", lon.toString());
    }
    params.append("radius", radiusKm.toString());
    params.append("category", category);
    return this.request(`/api/resources?${params.toString()}`);
  }

  // Assistant
  async sendAssistantMessage(message: string, sessionId: string, language: string): Promise<ApiResponse<{
    response: string;
    language: string;
    session_id: string;
    source: string;
  }>> {
    return this.request("/api/assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: sessionId, language })
    });
  }

  async getAssistantHistory(sessionId: string): Promise<ApiResponse<{ session_id: string; messages: any[] }>> {
    return this.request(`/api/assistant/history/${sessionId}`);
  }

  async clearAssistantHistory(sessionId: string): Promise<ApiResponse<void>> {
    return this.request(`/api/assistant/history/${sessionId}`, {
      method: "DELETE"
    });
  }
}

export const api = new ApiService();
