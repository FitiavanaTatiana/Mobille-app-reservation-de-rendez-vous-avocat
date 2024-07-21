import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // Assurez-vous que le chemin vers votre firebase.js est correct
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
    const [userType, setUserType] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cabinetName, setCabinetName] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonsVisible, setButtonsVisible] = useState(true);
    const navigation = useNavigation();

    const handleRoleSelect = (role) => {
        setUserType(role);
        setButtonsVisible(false);
    };

    const handleRegister = async () => {
        setIsLoading(true);
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;

            // Ajouter des informations supplémentaires dans Firestore
            if (userType === 'avocat') {
                await addDoc(collection(db, 'avocats'), {
                    uid: user.uid,
                    firstName,
                    lastName,
                    email,
                    cabinetName,
                    userType,
                });
            } else {
                await addDoc(collection(db, 'users'), {
                    uid: user.uid,
                    firstName,
                    lastName,
                    email,
                    userType,
                });
            }

            console.log('User registered:', user.email);
            setIsLoading(false);
            // Naviguer vers l'écran approprié après l'enregistrement réussi
            navigation.navigate('Home');
        } catch (error) {
            setIsLoading(false);
            setErrorMessage(error.message);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <Text style={styles.title}>S'inscrire</Text>
            
            {/* Bouton Retour */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>

            {/* Choix de rôle */}
            {buttonsVisible && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => handleRoleSelect('avocat')} style={[styles.roleButton, userType === 'avocat' && styles.selectedRoleButton]}>
                        <Text style={styles.buttonText}>Je suis Avocat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleRoleSelect('chercheur')} style={[styles.roleButton, userType === 'chercheur' && styles.selectedRoleButton]}>
                        <Text style={styles.buttonText}>Je cherche un Avocat</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Affichage du formulaire en fonction du choix */}
            {!buttonsVisible && (
                <View style={styles.inputContainer}>
                    {userType === 'avocat' && (
                        <View>
                            <Text style={styles.introtext}>Je suis un Avocat</Text>
                            <TextInput
                                placeholder='Nom du cabinet'
                                value={cabinetName}
                                onChangeText={text => setCabinetName(text)}
                                style={styles.input}
                            />
                        </View>
                    )}

                    {userType === 'chercheur' && (
                        <View>
                            <Text style={styles.introtext}>Je cherche un Avocat</Text>
                        </View>
                    )}

                    {/* Champs communs pour les deux rôles */}
                    <TextInput
                        placeholder='Nom'
                        value={lastName}
                        onChangeText={text => setLastName(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder='Prénom'
                        value={firstName}
                        onChangeText={text => setFirstName(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder='Adresse e-mail'
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.input}
                        keyboardType='email-address'
                    />
                    <TextInput
                        placeholder='Mot de passe'
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={styles.input}
                        secureTextEntry
                    />
                    
                    {errorMessage && (
                        <View style={styles.errorMessage}>
                            <Text style={styles.error}>{errorMessage}</Text>
                        </View>
                    )}
                    {isLoading ? (
                        <ActivityIndicator size='large' color='#1ABC9C' style={styles.loadingIndicator} />
                    ) : (
                        <TouchableOpacity onPress={handleRegister} style={styles.button}>
                            <Text style={styles.buttonText}>S'inscrire</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    title: {
        fontSize: 40,
        color: '#1ABC9C',
        fontWeight: 'bold',
        fontFamily: 'Cochin',
    },
    inputContainer: {
        width: '80%',
        marginTop: 25,
    },
    input: {
        backgroundColor: 'white',
        padding: '5%',
        borderRadius: 20,
        marginTop: 8,
        height: 70,
        fontSize: 16,
        color: 'black',
    },
    buttonContainer: {
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    roleButton: {
        backgroundColor: '#1ABC9C',
        width: '90%',
        borderRadius: 15,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginLeft: 15,
    },
    selectedRoleButton: {
        backgroundColor: '#16A085',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#1ABC9C',
        width: '100%',
        borderRadius: 15,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    errorMessage: {
        height: 40,
        justifyContent: 'center',
        marginVertical: 10,
    },
    error: {
        color: 'red',
        fontSize: 12,
        fontWeight: '600',
    },
    loadingIndicator: {
        marginTop: 20,
    },
    introtext: {
        fontSize: 20,
        color: 'black',
        alignItems: 'center',
        margin: 2,
    },
});

export default Register;
