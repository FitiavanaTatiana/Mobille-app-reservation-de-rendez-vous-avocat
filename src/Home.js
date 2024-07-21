import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';


const Home = ({ userType }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'avocats');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => user.role === 'chercheur');

  const normalUsers = users.filter(user => user.role !== 'avocat');

  const sortedUsers = [...filteredUsers, ...normalUsers];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Avocats</Text>
      <FlatList
        data={sortedUsers}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            {item.role === 'avocat' && (
              <Text style={styles.userCabinet}>{item.cabinetName}</Text>
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userCard: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: '100%',
    backgroundColor:'white',
    marginTop:10,
    borderColor:'#1ABC9C',
    borderWidth:2,
    
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: 'gray',
  },
  userCabinet: {
    fontStyle: 'italic',
  },
});

export default Home;
