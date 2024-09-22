import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const Dashboard = () => {
  const [pageViews, setPageViews] = useState(0);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchPageViews = async () => {
      const storedPageViews = await AsyncStorage.getItem('pageViews');
      const initialPageViews = storedPageViews
        ? parseInt(storedPageViews, 10)
        : 0;
      setPageViews(initialPageViews);

      const newPageViews = initialPageViews + 1;
      await AsyncStorage.setItem('pageViews', newPageViews.toString());
      console.log('VISITED LOG', newPageViews);
      setPageViews(newPageViews);
    };

    fetchPageViews();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.timesText}>
          You have visited this page {pageViews}{' '}
          {pageViews === 1 ? 'time' : 'times'}.
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('ClientManagement');
        }}>
        <Text style={styles.navigationText}>
          Naviagte Client Management Screen
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    padding: 50,
    backgroundColor: '#f5f5f5',
    // marginTop: 40,
    borderRadius: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  timesText: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'white',
    elevation: 5,
    // flex: 1,

    // justifyContent: 'flex-end',
    paddingVertical: 20,
    // alignContent: 'flex-end',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  navigationText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
    fontSize: 15,
  },
});
