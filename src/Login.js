import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View,Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth ,db} from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword ,} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Home from './Home';
const Login = () => {
    const [email, setEmail]=useState('')
    const [password, setPassword]= useState('')
    const [isLoading, setIsLoading] = useState(false); // État pour l'indicateur de chargement
    const [errorMessage, setErrorMessage] = useState(null)
    const navigation=useNavigation();
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user){
                navigation.navigate("Home")
                console.log('User is signed in:', user.email);
                // setTimeout(() => {
                //     setIsLoading(false);
                //     navigation.navigate("Home");
                // }, 5000); // 5000 ms = 5 secondes

            }
            
        })
        return unsubscribe
    },[])


    const handleSignup = () => {
        navigation.navigate("Register"); // Navigate to Register screen
    };
    const HandelLogin = async () => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Retrieve additional user data from Firestore
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log('User data:', userData);

                // Check user type and navigate accordingly
                if (userData.userType === 'avocat') {
                    console.log('User is avocat');
                    navigation.navigate('Home', { userType: 'avocat' });
                } else {
                    console.log('User is normal user');
                    navigation.navigate('Home', { userType: 'user' });
                }
            } else {
                console.log('User document does not exist');
                // Handle case where user data document doesn't exist
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setErrorMessage(error.message);
            console.error('Login error:', error);
        }
    };
  return (
    <KeyboardAvoidingView
    style={styles.contenaire}
    behavior='padding'
    
    >
     
        <View style={styles.square}></View>
        <View style={styles.square3}></View>

          <View style={styles.Cont}>
            <Text style={styles.contText}>Mon Avocat</Text>
            <Image    source={require('../assets/Logo.png')}
        style={styles.image}/>
        </View>
        <View style={styles.square2}></View>
      <View style={styles.inputContenaire}>

        <TextInput
         placeholder='E-mail'
         value={email}
         onChangeText={text=>setEmail (text)}
            style={styles.input}
        
        >

        </TextInput>
        <TextInput
         placeholder='Passwrod'
          value={password}
         onChangeText={text =>setPassword (text)}
    
            style={styles.input}
            secureTextEntry
        
        >
           
        </TextInput>
        {errorMessage && (
                <View style={styles.errorMessage}>
                    <Text style={styles.error}>{errorMessage}</Text>
                </View>
            )}
      </View>
      <View style ={styles.buttonContenaire}>
        {isLoading ? (
              <ActivityIndicator size='large' color='#1ABC9C' style={styles.loadingIndicator} />
             ) : (
                    <TouchableOpacity onPress={HandelLogin} style={styles.button}>
                        <Text style={styles.buttonText}>Se connecter</Text>
                    </TouchableOpacity>
                        )}
        {/* </TouchableOpacity> */}
        <TouchableOpacity
        onPress={handleSignup}
        style={[styles.button, styles.buttonOutline]}

        >
            <Text style={styles.buttonOutlineText}>
                S'inscrire
            </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Login

const styles = StyleSheet.create({
    contenaire:{
        justifyContent:"center",
        alignItems:"center",
        flex:1

    },
    inputContenaire:{
        width:'80%', 
        marginTop:-80
       

    },
    input:{
        backgroundColor:'white',
        padding:'5%',
        borderRadius:15,
        marginTop:13,
        height:70,
        fontSize:16,
        color:'black',


    },
    button:{
        backgroundColor:'#1ABC9C',
        width:'100%',
        borderRadius:15,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        fontSize:'50px'

    },
    buttonText:{
        color:'white',
        fontWeight:'700',
        fontSize:16
    },
    buttonContenaire:{
        width:'80%',
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
    },
    buttonOutline:{
        backgroundColor:'white',
        marginTop:10,
        borderColor:'#1ABC9C',
        borderWidth:2,

    },
    loadingIndicator: {
        marginTop: 20,
    }, 
    buttonOutlineText:{
        color:'#1ABC9C',
        fontWeight:'700',
        fontSize:16
    },
    square: {
        width: 100,
        height: 100,
        backgroundColor: '#1ABC9C',
        borderRadius:100,
        marginRight:300,
        marginTop:-20,
        opacity:0.5
      },
      square2: {
        width: 80,
        height: 80,
        backgroundColor: '#1ABC9C',
        borderRadius:100,
        marginLeft:400,
       
        opacity:0.6
      },
      square3: {
        width: 60,
        height: 60,
        backgroundColor: '#1ABC9C',
        borderRadius:100,
        marginLeft:250,
       marginBottom:-15,
        opacity:0.4
      },
    errorMessage:{
        height:5,
        alignContent:"center",
        justifyContent:"center",
        marginVertical: 10,
        marginBottom:-10,

    },
    error:{
        color:"red",
        fontSize:5,
        fontWeight:'600',
    },
    cont:{
        width:"50%",
        justifyContent:'center',
        flex:1,
        marginTop:-50
    },
    contText:{
        fontSize:40,
        color:'#1ABC9C',
        fontWeight: 'bold',
        fontFamily: 'Cochin', 
        // marginLeft:10
        
    },
    image:{
        width:180,
        height:180,
        marginTop:15,
        marginLeft:14,
        zIndex:2,
        
    }


})