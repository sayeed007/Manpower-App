import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Badge, Searchbar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../../redux/store';
import { colors } from '../../constants/colors';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  status: 'open' | 'in-progress' | 'completed';
  createdAt: Date;
  applicants?: number;
  jobType: 'full-time' | 'part-time' | 'contract';
  category: string;
  imageUrl?: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.profile);
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    'All',
    'Construction',
    'Cleaning',
    'Security',
    'Delivery',
    'Hospitality',
    'Manufacturing',
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchQuery, selectedCategory, jobs]);

  const fetchJobs = async () => {
    try {
      setRefreshing(true);
      const jobsSnapshot = await firestore()
        .collection('jobs')
        .where('status', '==', 'open')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();

      const jobsData = jobsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        } as Job;
      });

      setJobs(jobsData);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setRefreshing(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }
    
    setFilteredJobs(filtered);
  };

  const onRefresh = () => {
    fetchJobs();
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === 'All' ? null : category);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return colors.success;
      case 'in-progress':
        return colors.warning;
      case 'completed':
        return colors.error;
      default:
        return colors.textGray;
    }
  };

  const renderJobItem = ({ item }: { item: Job }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('JobDetail' as never, { jobId: item.id } as never)}
      >
        <Card style={styles.jobCard}>
          <Card.Content style={styles.jobCardContent}>
            <View style={styles.jobImageContainer}>
              {item.imageUrl ? (
                <Avatar.Image
                  source={{ uri: item.imageUrl }}
                  size={60}
                />
              ) : (
                <Avatar.Icon
                  icon="briefcase"
                  size={60}
                  color={colors.white}
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </View>
            <View style={styles.jobInfoContainer}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobCompany}>{item.company}</Text>
              <View style={styles.jobDetails}>
                <View style={styles.jobDetail}>
                  <Icon name="map-marker" size={16} color={colors.textGray} />
                  <Text style={styles.jobDetailText}>{item.location}</Text>
                </View>
                <View style={styles.jobDetail}>
                  <Icon name="clock-outline" size={16} color={colors.textGray} />
                  <Text style={styles.jobDetailText}>{item.jobType}</Text>
                </View>
              </View>
            </View>
            <View style={styles.jobStatus}>
              <Badge 
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {item.status}
              </Badge>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = ({ item }: { item: string }) => {
    const isSelected = (selectedCategory === item) || (item === 'All' && !selectedCategory);
    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isSelected && { backgroundColor: colors.primary },
        ]}
        onPress={() => handleCategorySelect(item)}
      >
        <Text style={[
          styles.categoryText,
          isSelected && { color: colors.white }
        ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search jobs..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={colors.primary}
      />
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <View style={styles.jobsContainer}>
        <View style={styles.jobsHeader}>
          <Text style={styles.jobsHeaderTitle}>
            {selectedCategory || 'All'} Jobs
          </Text>
          <Text style={styles.jobsCount}>
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </Text>
        </View>
        
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.jobsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="briefcase-search" size={64} color={colors.textGray} />
              <Text style={styles.emptyText}>No jobs found</Text>
              <Text style={styles.emptySubText}>
                Try adjusting your search or categories
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    margin: 16,
    elevation: 2,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.backgroundLight,
  },
  categoryText: {
    color: colors.textDark,
    fontWeight: '500',
  },
  jobsContainer: {
    flex: 1,
  },
  jobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  jobsHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  jobsCount: {
    fontSize: 14,
    color: colors.textGray,
  },
  jobsList: {
    padding: 16,
    paddingTop: 8,
  },
  jobCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  jobCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobImageContainer: {
    marginRight: 12,
  },
  jobInfoContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  jobCompany: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 4,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  jobDetailText: {
    fontSize: 12,
    color: colors.textGray,
    marginLeft: 4,
  },
  jobStatus: {
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textGray,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HomeScreen;