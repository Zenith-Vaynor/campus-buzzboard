import React, { useState, useEffect } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, RefreshControl } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://campus-buzzboard.onrender.com';

// --- Feed Screen ---
function FeedScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [activeStream, setActiveStream] = useState('events');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Bonus Features
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBuzzData = async (isSilentRefresh = false) => {
    if (isSilentRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const [eventsRes, noticesRes] = await Promise.all([
        fetch('${API_URL}/api/events/'),
        fetch('${API_URL}/api/notices/')
      ]);

      if (!eventsRes.ok || !noticesRes.ok) {
        throw new Error('Uplink failed. Data streams corrupted.');
      }

      setEvents(await eventsRes.json());
      setNotices(await noticesRes.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBuzzData();
  }, []);

  // High-Sensitivity Heat Spectrum
  const getHeatColor = (score) => {
    if (score >= 90) return '#ff003c'; // Neon Red (Nuclear)
    if (score >= 70) return '#ff5500'; // Deep Orange (Critical)
    if (score >= 50) return '#ffaa00'; // Yellow-Orange (Warming)
    if (score >= 30) return '#00ffcc'; // Teal (Baseline)
    if (score >= 10) return '#0088aa'; // Dark Teal (Cool)
    return '#444444';                  // Grey (Absolute Zero)
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00ffcc" />
        <Text style={styles.statusText}>Establishing BuzzBoard Uplinks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>CONNECTION LOST: {error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => fetchBuzzData(false)}>
          <Text style={styles.buttonText}>RETRY UPLINKS</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Determine active stream and apply the search filter
  const currentData = activeStream === 'events' ? events : notices;
  const filteredData = currentData.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      
      {/* Stream Toggle UI */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeStream === 'events' && styles.activeTab]}
          onPress={() => setActiveStream('events')}
        >
          <Text style={[styles.tabText, activeStream === 'events' && styles.activeTabText]}>EVENTS_STREAM</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeStream === 'notices' && styles.activeTab]}
          onPress={() => setActiveStream('notices')}
        >
          <Text style={[styles.tabText, activeStream === 'notices' && styles.activeTabText]}>NOTICE_STREAM</Text>
        </TouchableOpacity>
      </View>

      {/* Terminal Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="> input search query..."
        placeholderTextColor="#555555"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        // Pull-to-Refresh Configuration
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchBuzzData(true)}
            tintColor="#00ffcc" // Color for the loading spinner on iOS
            colors={['#00ffcc']} // Color for Android
          />
        }
        renderItem={({ item }) => {
          const isEvent = activeStream === 'events';
          const dynamicColor = getHeatColor(item.heat_score);
          
          return (
            <TouchableOpacity 
              style={[styles.card, { borderLeftColor: dynamicColor }]}
              onPress={() => {
                if (isEvent) navigation.navigate('EventDetails', { eventId: item.id });
              }}
              disabled={!isEvent}
            >
              {/* ure visual heat indicator dot, no numbers */}
              <View style={[styles.heatDot, { backgroundColor: dynamicColor, shadowColor: dynamicColor }]} />
              
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={[styles.cardCategory, { color: dynamicColor }]}>[{item.category.toUpperCase()}]</Text>
              
              {isEvent && (
                <>
                  <Text style={styles.cardSub}>Date: {new Date(item.startTime).toLocaleDateString()}</Text>
                  <Text style={styles.cardSub}>Venue: {item.venue}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        }}
        
        ListEmptyComponent={
          <Text style={styles.statusText}>No active data matching query.</Text>
        }
      />
    </View>
  );
}

// --- Event Details Screen ---
function EventDetailsScreen({ route }) {
  // Catch the ID passed from the previous screen
  const { eventId } = route.params;
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the specific event data
  useEffect(() => {
    const fetchSingleEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events/${eventId}/`);
        if (!response.ok) throw new Error('Failed to retrieve full data payload.');
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleEvent();
  }, [eventId]);

  // Render States
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00ffcc" />
        <Text style={styles.statusText}>Decrypting payload...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>DATA CORRUPTION: {error}</Text>
      </View>
    );
  }

  // Render the Full Data
  return (
    <View style={styles.container}>
      <View style={styles.detailCard}>
        <View style={styles.heatIndicator}>
          <Text style={styles.heatText}>CURRENT HEAT: {event.heat_score}</Text>
        </View>
        <Text style={styles.detailTitle}>{event.title}</Text>
        <Text style={styles.detailCategory}>CATEGORY: {event.category}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.detailText}>HOST: {event.organizer}</Text>
        <Text style={styles.detailText}>VENUE: {event.venue}</Text>
        <Text style={styles.detailText}>START: {new Date(event.startTime).toLocaleString()}</Text>
        <Text style={styles.detailText}>END: {new Date(event.endTime).toLocaleString()}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.detailDescription}>{event.description}</Text>
      </View>
    </View>
  );
}

// --- Navigation Setup ---
const Stack = createNativeStackNavigator();

const BuzzBoardTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0a0a0a',
    card: '#171717',
    text: '#00ffcc',
    border: '#333333',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={BuzzBoardTheme}>
      <Stack.Navigator 
        initialRouteName="Feed"
        screenOptions={{
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'monospace',
          },
          headerTintColor: '#00ffcc',
        }}
      >
        <Stack.Screen 
          name="Feed" 
          component={FeedScreen} 
          options={{ title: 'BUZZBOARD // LIVE FEED' }} 
        />
        <Stack.Screen 
          name="EventDetails" 
          component={EventDetailsScreen} 
          options={{ title: 'DATA // DETAILS' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#00ffcc',
    fontFamily: 'monospace',
    marginTop: 15,
  },
  errorText: {
    color: '#ff4444',
    fontFamily: 'monospace',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    borderColor: '#00ffcc',
    borderWidth: 1,
    padding: 10,
  },
  buttonText: {
    color: '#00ffcc',
    fontFamily: 'monospace',
  },
  card: {
    backgroundColor: '#171717',
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00ffcc',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  cardSub: {
    color: '#888888',
    fontFamily: 'monospace',
    marginTop: 5,
  },
  heatDot: {
    alignSelf: 'flex-end',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3, 
  },
  detailCard: {
    backgroundColor: '#171717',
    padding: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333333',
  },
  detailTitle: {
    color: '#00ffcc',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 10,
    marginBottom: 5,
  },
  detailCategory: {
    color: '#ffaa00',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 15,
  },
  detailText: {
    color: '#cccccc',
    fontFamily: 'monospace',
    marginBottom: 8,
    fontSize: 14,
  },
  detailDescription: {
    color: '#ffffff',
    fontFamily: 'monospace',
    lineHeight: 22,
    fontSize: 14,
  },
  // Add these inside your styles object:
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  activeTab: {
    backgroundColor: '#171717',
    borderBottomWidth: 2,
    borderBottomColor: '#00ffcc',
  },
  tabText: {
    color: '#555555',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#00ffcc',
  },
  cardCategory: {
    color: '#ffaa00',
    fontFamily: 'monospace',
    marginTop: 5,
    fontSize: 12,
  },
  searchInput: {
    backgroundColor: '#111111',
    color: '#00ffcc',
    fontFamily: 'monospace',
    borderWidth: 1,
    borderColor: '#333333',
    padding: 12,
    marginBottom: 15,
    borderRadius: 4,
  }
});
