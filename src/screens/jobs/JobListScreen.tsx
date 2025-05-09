import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Text,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../config/theme';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import { COLORS } from '../../constants/colors';

// You can replace this with your actual job type from types folder
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  postedDate: string;
  deadline?: string;
  salary?: string;
}

const JobListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  // Mock data for demonstration
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Construction Worker',
      company: 'ABC Construction',
      location: 'New York, NY',
      status: 'PENDING',
      postedDate: '2023-05-01',
      deadline: '2023-05-15',
      salary: '$25/hr'
    },
    {
      id: '2',
      title: 'Warehouse Assistant',
      company: 'Global Logistics',
      location: 'Chicago, IL',
      status: 'IN_PROGRESS',
      postedDate: '2023-04-28',
      salary: '$22/hr'
    },
    {
      id: '3',
      title: 'Office Cleaner',
      company: 'CleanCo Services',
      location: 'Los Angeles, CA',
      status: 'COMPLETED',
      postedDate: '2023-04-20',
      salary: '$20/hr'
    },
    {
      id: '4',
      title: 'Event Staff',
      company: 'EventMasters',
      location: 'Miami, FL',
      status: 'CANCELLED',
      postedDate: '2023-04-15',
      deadline: '2023-04-30',
      salary: '$18/hr'
    },
    {
      id: '5',
      title: 'Security Guard',
      company: 'SecureWatch',
      location: 'Dallas, TX',
      status: 'PENDING',
      postedDate: '2023-05-02',
      deadline: '2023-05-20',
      salary: '$23/hr'
    }
  ];

  // Simulating API fetch
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const handleJobPress = (jobId: string) => {
    // @ts-ignore - You'll need to add proper navigation types
    navigation.navigate('JobDetail', { jobId });
  };

  const filterJobs = (statusFilter: string | null) => {
    setFilter(statusFilter);
  };

  const getFilteredJobs = () => {
    if (!filter) return jobs;
    return jobs.filter(job => job.status === filter);
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

  const renderFilterChips = () => {
    const filters = [
      { label: 'All', value: null },
      { label: 'Pending', value: 'PENDING' },
      { label: 'In Progress', value: 'IN_PROGRESS' },
      { label: 'Completed', value: 'COMPLETED' },
      { label: 'Cancelled', value: 'CANCELLED' },
    ];

    return (
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={filters}
          keyExtractor={(item) => item.label}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                filter === item.value && styles.activeFilterChip
              ]}
              onPress={() => filterJobs(item.value)}
            >
              <Text 
                style={[
                  styles.filterChipText,
                  filter === item.value && styles.activeFilterChipText
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <TouchableOpacity onPress={() => handleJobPress(item.id)}>
      <Card style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
          </View>
        </View>
        
        <View style={styles.jobDetails}>
          <View style={styles.detailRow}>
            <Icon name="office-building" size={16} color={theme.colors.secondaryText} />
            <Text style={styles.detailText}>{item.company}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="map-marker" size={16} color={theme.colors.secondaryText} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="currency-usd" size={16} color={theme.colors.secondaryText} />
            <Text style={styles.detailText}>{item.salary}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color={theme.colors.secondaryText} />
            <Text style={styles.detailText}>Posted: {item.postedDate}</Text>
          </View>
          
          {item.deadline && (
            <View style={styles.detailRow}>
              <Icon name="timer-sand" size={16} color={theme.colors.secondaryText} />
              <Text style={styles.detailText}>Deadline: {item.deadline}</Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderAddButton = () => (
    <TouchableOpacity 
      style={styles.fabButton}
      // @ts-ignore - You'll need to add proper navigation types
      onPress={() => navigation.navigate('CreateJob')}
    >
      <Icon name="plus" size={24} color={theme.colors.white} />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Jobs" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Jobs" />
      <View style={styles.content}>
        {renderFilterChips()}
        
        <FlatList
          data={getFilteredJobs()}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="briefcase-outline" size={64} color={theme.colors.secondaryText} />
              <Text style={styles.emptyText}>No jobs found</Text>
              <Text style={styles.emptySubtext}>
                {filter ? 'Try changing your filter' : 'Jobs will appear here'}
              </Text>
            </View>
          }
        />
      </View>
      {renderAddButton()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.secondary,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary,
  },
  filterChipText: {
    color: theme.colors.secondaryText,
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: theme.colors.white,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra space for FAB button
  },
  jobCard: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  jobDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginLeft: 8,
  },
  fabButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default JobListScreen;