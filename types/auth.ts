export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface LoginError {
  message: string;
}

export interface SignupParams {
  email: string;
  password: string;
  name: string;
}

export interface SignupResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface LoginError {
  message: string;
}

export interface ResetPasswordParams {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  ResetPassword: undefined;
  ResetPassword2: undefined;
  Home: undefined;
};

export interface ResetPasswordLinkParams {
  email: string;
}

export interface ResetPasswordLinkResponse {
  message: string;
}

export type AuthState = {
  token: string | null;
  logout: () => Promise<void>;
  saveToken: (token: string) => Promise<void>;
  // removeToken: () => void;
};

export interface LikeType {
  id: string;
  userId: string;
  videoId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profile_pic: string;
  };
}

export interface VideoType {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  user?: any;
  // user(user: any)?: unknown;
  name: string;
  email: string;
  mobileNumber: string;
  profile_pic: string;
}

export interface UserType {
  id: string;
  email: string;
  name: string;
  profile_pic: string;
  dob: string | null;
  mobileNumber: string | null;
  location: string | null;
  status: "active" | "inactive";
  resetToken: string | null;
  resetTokenExpiry: string | null;
  createdAt: string;
  updatedAt: string;
  comments: any[];
  likes: LikeType[];
  videos: VideoType[];
}

export interface UserState {
  userData: UserType | null;
  setUserData: (data: UserType) => void;
  loadUserData: () => Promise<void>;
  clearUserData: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  token: string;
}

export interface Game {
  description: any;
  bookings: any;
  endDate: any;
  startDate: any;
  id: string;
  name: string;
  category: string;
  address: string;
  capacity: number;
  hourlyPrice: number;
  location: {
    area: string[];
    city: string[];
  };
}

export interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  userMobile: string;
  nets: number;
  createdAt: string;
  updatedAt: string;
  gameId: string;
  user: {
    id: string;
    name: string;
    profile_pic: string | null;
  };
}

// Add these types at the top of your file
export interface BookingFormData {
  name: string;
  phone: string;
  amount: string;
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
}

export interface BookingRequest {
  name: string;
  number: string; // This matches your API's expected 'number' field
  amount: number;
  date: string;
  startTime: string;
  endTime: string;
  nets: number;
  gameId: string | null;
  totalAmount: number;
}
