import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';

const Management = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('contacts');
      if (jsonValue != null) {
        setData(JSON.parse(jsonValue));
      }
    } catch (e) {
      Alert.alert('Error loading data');
    }
  };

  const saveData = async data => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('contacts', jsonValue);
    } catch (e) {
      Alert.alert('Error saving data');
    }
  };
  const handleEdit = item => {
    setCurrentItem(item);
    setName(item.name);
    setEmail(item.email);
    setPhone(item.phone);
    setIsEditing(true);
    setModalVisible(true);
  };
  const handleAdd = () => {
    setIsEditing(false);
    setName('');
    setEmail('');
    setPhone('');
    setModalVisible(true);
  };
  const handleSave = async () => {
    if (!name || !email || !phone) {
      Alert.alert('Validation Error', 'All fields are required!');
      return;
    }

    setModalVisible(false);

    if (isEditing) {
      const updatedData = data.map(item => {
        if (item.id === currentItem.id) {
          return {...item, name, email, phone};
        }
        return item;
      });

      setData(updatedData);
      await saveData(updatedData);
    } else {
      const newItem = {
        id: (data.length + 1).toString(),
        name,
        email,
        phone,
      };
      const updatedData = [...data, newItem];
      setData(updatedData);
      await saveData(updatedData);
    }
    setCurrentItem(null);
    setName('');
    setEmail('');
    setPhone('');
  };

  useEffect(() => {
    loadData();
  }, []);
  const handleDelete = async id => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    await saveData(updatedData);
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 15,
          paddingHorizontal: 15,
        }}>
        <View>
          <View style={styles.nameView}>
            <Text style={styles.nameText}>Name:</Text>
            <Text style={styles.title}>{item.name}</Text>
          </View>
          <View style={styles.emailView}>
            <Text style={styles.nameText}>Email:</Text>
            <Text style={styles.title}>{item.email}</Text>
          </View>
          <View style={styles.phoneView}>
            <Text style={styles.nameText}>Phone Number:</Text>
            <Text style={styles.title}>{item.phone}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.deleteButton}>
            <Text style={styles.editText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Modal transparent={true} visible={isModalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              keyboardType="email-address"
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              keyboardType="numeric"
              value={phone}
              onChangeText={setPhone}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.editText}>
                  {isEditing ? 'Save' : 'Add'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.saveButton}>
                <Text style={styles.editText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View>
        <TouchableOpacity style={styles.addFloatingView} onPress={handleAdd}>
          <Text style={styles.plusEffect}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    backgroundColor: 'white',
    borderRadius: 12,

    // borderWidth: 2,
  },
  title: {
    fontSize: 15,
    paddingLeft: 5,
    // borderWidth: 1,
    maxWidth: '70%',
    fontWeight: 'semibold',
    color: '#353935',
  },
  nameView: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-around',
  },
  nameText: {color: 'black', fontSize: 16, fontWeight: 'bold'},
  emailView: {
    flexDirection: 'row',
    paddingTop: 6,
  },
  phoneView: {
    flexDirection: 'row',
    paddingTop: 6,
  },
  editButton: {
    backgroundColor: 'powderblue',
    width: 100,
    paddingVertical: 15,
    borderRadius: 12,
    // height: 30,
  },
  deleteButton: {
    backgroundColor: 'powderblue',
    width: 100,
    borderRadius: 12,
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 15,
    // height: 30,
  },
  editText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  saveButton: {
    backgroundColor: 'powderblue',
    paddingVertical: 15,
    borderRadius: 12,
    paddingHorizontal: 35,
  },
  addFloatingView: {
    width: 50,
    height: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    borderRadius: 25,
  },
  plusEffect: {
    color: 'white',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
});

export default Management;
