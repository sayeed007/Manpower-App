import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

// Jobs Stack
export type JobsStackParamList = {
  JobList: undefined;
  JobDetail: { jobId: string };
  CreateJob: undefined;
  EditJob: { jobId: string };
};

// Home Tab Navigator
export type HomeTabParamList = {
  Dashboard: undefined;
  Jobs: NavigatorScreenParams<JobsStackParamList>;
  Profile: undefined;
  Settings: undefined;
};

// Main App Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Home: NavigatorScreenParams<HomeTabParamList>;
  Notifications: undefined;
  JobApplication: { jobId: string };
  UserDetail: { userId: string };
};

// Use this type for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}