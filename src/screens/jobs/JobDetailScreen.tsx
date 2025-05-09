import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../config/theme';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { COLORS } from '../../constants/colors';

// Mock interface for job details, replace with actual interface from types folder
interface JobDetail {
  id: string;
  title: string;
  company: string;
  location: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  postedDate: string;
  deadline?: string;
  salary?: string;
  description: string;
  requirements: string[];
  contactPerson?: {
    name: string;
    phone: string;
    email: string;
  };
  companyLogo?: string;
  applicantCount: number;
  startDate?: string;
  endDate?: string;
  shifts?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
}

// Mock route params, replace with actual types from navigation/types.ts
type JobDetailRouteParams = {
  JobDetail: {
    jobId: string;
  };
};

const JobDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<JobDetailRouteParams, 'JobDetail'>>();
  const { jobId } = route.params;
  
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);

  // Mock job data
  const mockJobDetail: JobDetail = {
    id: jobId,
    title: 'Construction Worker',
    company: 'ABC Construction',
    location: 'New York, NY',
    status: 'PENDING',
    postedDate: '2023-05-01',
    deadline: '2023-05-15',
    salary: '$25/hr',
    description: 'We are seeking skilled construction workers for a commercial building project in downtown New York. The ideal candidate will have experience in general construction, including concrete work, framing, and finishing.',
    requirements: [
      'Minimum 2 years of construction experience',
      'Knowledge of construction tools and equipment',
      'Ability to follow safety protocols',
      'Physical stamina and strength',
      'Reliable transportation'
    ],
    contactPerson: {
      name: 'John Smith',
      phone: '(555) 123-4567',
      email: 'jobs@abcconstruction.com'
    },
    applicantCount: 12,
    startDate: '2023-05-20',
    endDate: '2023-08-15',
    shifts: [
      { day: 'Monday-Friday', startTime: '7:00 AM', endTime: '3:30 PM' },
      { day: 'Saturday', startTime: '8:00 AM', endTime: '12:00 PM' }
    ]
  };

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setJob(mockJobDetail);
      setLoading(false);
    }, 1000);
  }, [jobId]);

  const handleApply = () => {
    setApplyLoading(true);
    // Simulate API call
    setTimeout(() => {
      setApplyLoading(false);
      Alert.alert(
        'Application Submitted',
        'Your application has been submitted successfully.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return COLORS.PENDING;
      case 'IN_PROGRESS':
        return COLORS.IN_PROGRESS;
      case 'COMPLETED':
        return COLORS.COMPLETED;
      case 'CANCELLED':
        return COLORS.CANCELLED;
      default:
        return COLORS.PENDING;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Job Details" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Job Details" showBackButton />
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color={theme.colors.error} />
          <Text style={styles.errorText}>Job not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => navigation.goBack()} 
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Job Details" showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View style={styles.companyLogoContainer}>
            {job.companyLogo ? (
              <Image 
                source={{ uri: job.companyLogo }} 
                style={styles.companyLogo} 
                resizeMode="contain"
              />
            ) : (
              <View style={styles.companyInitial}>
                <Text style={styles.initialText}>{job.company[0]}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.companyName}>{job.company}</Text>
            
            <View style={styles.locationContainer}>
              <Icon name="map-marker" size={16} color={theme.colors.secondaryText} />
              <Text style={styles.locationText}>{job.location}</Text>
            </View>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
            <Text style={styles.statusText}>{job.status.replace('_', ' ')}</Text>
          </View>
        </View>
        
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="currency-usd" size={20} color={theme.colors.primary} />
              <Text style={styles.infoLabel}>Salary</Text>
              <Text style={styles.infoValue}>{job.salary || 'Not specified'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="calendar" size={20} color={theme.colors.primary} />
              <Text style={styles.infoLabel}>Posted</Text>
              <Text style={styles.infoValue}>{job.postedDate}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="account-group" size={20} color={theme.colors.primary} />
              <Text style={styles.infoLabel}>Applicants</Text>
              <Text style={styles.infoValue}>{job.applicantCount}</Text>
            </View>
          </View>
          
          {job.deadline && (
            <View style={styles.deadlineContainer}>
              <Icon name="timer-sand" size={16} color={theme.colors.warning} />
              <Text style={styles.deadlineText}>
                Application deadline: <Text style={styles.deadlineDate}>{job.deadline}</Text>
              </Text>
            </View>
          )}
        </Card>
      
        <Card style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.descriptionText}>{job.description}</Text>
        </Card>
        
        <Card style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirementsList}>
            {job.requirements.map((requirement, index) => (
              <View key={index} style={styles.requirementItem}>
                <Icon name="check-circle" size={16} color={theme.colors.success} />
                <Text style={styles.requirementText}>{requirement}</Text>
              </View>
            ))}
          </View>
        </Card>
        
        {job.shifts && job.shifts.length > 0 && (
          <Card style={styles.detailCard}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <View style={styles.scheduleContainer}>
              {job.startDate && job.endDate && (
                <View style={styles.dateRange}>
                  <Text style={styles.dateRangeText}>
                    {job.startDate} - {job.endDate}
                  </Text>
                </View>
              )}
              
              {job.shifts.map((shift, index) => (
                <View key={index} style={styles.shiftItem}>
                  <View style={styles.shiftDay}>
                    <Icon name="calendar-week" size={16} color={theme.colors.primary} />
                    <Text style={styles.shiftDayText}>{shift.day}</Text>
                  </View>
                  <View style={styles.shiftTime}>
                    <Icon name="clock-outline" size={16} color={theme.colors.secondaryText} />
                    <Text style={styles.shiftTimeText}>
                      {shift.startTime} - {shift.endTime}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        )}
        
        {job.contactPerson && (
          <Card style={styles.detailCard}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactContainer}>
              <View style={styles.contactItem}>
                <Icon name="account" size={16} color={theme.colors.secondaryText} />
                <Text style={styles.contactText}>{job.contactPerson.name}</Text>
              </View>
              
              <TouchableOpacity style={styles.contactItem}>
                <Icon name="phone" size={16} color={theme.colors.primary} />
                <Text style={styles.contactLink}>{job.contactPerson.phone}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.contactItem}>
                <Icon name="email" size={16} color={theme.colors.primary} />
                <Text style={styles.contactLink}>{job.contactPerson.email}</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
        
        <View style={styles.applyButtonContainer}>
          <Button
            title={applyLoading ? "Applying..." : "Apply Now"}
            onPress={handleApply}
            loading={applyLoading}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.error,
    marginVertical: 16,
  },
  errorButton: {
    marginTop: 16,
    width: 150,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  companyLogoContainer: {
    marginRight: 16,
  },
  companyLogo: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  companyInitial: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  titleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    color: theme.colors.secondaryText,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    marginTop: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 2,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  deadlineText: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginLeft: 8,
  },
  deadlineDate: {
    fontWeight: '600',
    color: theme.colors.warning,
  },
  detailCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.secondaryText,
  },
  requirementsList: {
    marginTop: 4,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginLeft: 8,
    flex: 1,
  },
  scheduleContainer: {
    marginTop: 4,
  },
  dateRange: {
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dateRangeText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  shiftItem: {
    marginBottom: 12,
  },
  shiftDay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shiftDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginLeft: 8,
  },
  shiftTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 24,
  },
  shiftTimeText: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginLeft: 8,
  },
  contactContainer: {
    marginTop: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginLeft: 8,
  },
  contactLink: {
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: 8,
  },
  applyButtonContainer: {
    marginTop: 8,
  },
});

export default JobDetailScreen;