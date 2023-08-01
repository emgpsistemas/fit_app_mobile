import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Alert } from 'react-native';
import { FIREBASE_AUTH } from '../lib/firebase/config';
import { LoginFormData } from '../validations/common/Login';
import { UserRegisterFormData } from '../validations/common/UserRegister';

interface FirebaseAuthContextData {
  session: UserCredential | null;
  user: User | null;
  isLoading: boolean;
  signUpWithEmail({ email, password }: UserRegisterFormData): Promise<void>;
  signIn({ email, password }: LoginFormData): Promise<void>;
  signOut(): void;
  checkUserSession(): Promise<void>;
  recoveryPassword(email: string): Promise<void>;
  signInWithGoogle(): Promise<void>;
  signUpWithGoogle(): Promise<void>;
}

export const FirebaseAuthContext = createContext<FirebaseAuthContextData>(
  {} as FirebaseAuthContextData,
);

export const FirebaseAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<UserCredential | null>(null);

  async function signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    setIsLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password,
      );
      await saveUser(response.user);
      setUser(response.user);
      setSession(response);
    } catch (error: any) {
      if (error?.message.includes('wrong-password')) {
        Alert.alert('Erro!', 'Senha incorreta.');
      }
      if (error?.message.includes('user-not-found')) {
        Alert.alert('Erro!', 'Usuário não encontrado.');
      }
      console.error('signIn function error =>', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    setIsLoading(true);
    try {
      await FIREBASE_AUTH.signOut();
      setUser(null);
      setSession(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('signOut function error =>', error);
      Alert.alert('Erro!', 'Não foi possível fazer logout.');
    } finally {
      setIsLoading(false);
    }
  }

  async function signUpWithEmail({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      Alert.alert('Sucesso!', 'Usuário criado com sucesso!');
    } catch (error) {
      console.error('signUpWithEmail function error =>', error);
      Alert.alert('Erro!', 'Não foi possível criar o usuário.');
    } finally {
      setIsLoading(false);
    }
  }

  async function recoveryPassword(email: string) {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      Alert.alert('Sucesso!', 'Email de recuperação enviado!');
    } catch (error: any) {
      if (error?.message.includes('user-not-found')) {
        Alert.alert('Erro!', 'Usuário não encontrado.');
      }
      console.error('recoveryPassword function error =>', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveUser(user: User) {
    try {
      const jsonUser = JSON.stringify(user);
      await AsyncStorage.setItem('user', jsonUser);
    } catch (error) {
      console.error('saveUser function error =>', error);
    }
  }

  async function loadUser() {
    try {
      const jsonUser = await AsyncStorage.getItem('user');
      if (jsonUser) {
        const user = JSON.parse(jsonUser);
        setUser(user);
      }
    } catch (error) {
      console.error('loadUser function error =>', error);
    }
  }

  async function checkUserSession() {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (user && session && user.refreshToken !== session.user.refreshToken) {
        await AsyncStorage.removeItem('user');
      }
    } catch (error) {
      console.error('checkUserSession function error =>', error);
    }
  }

  async function signInWithGoogle() {
    setIsLoading(true);
    try {
      console.log('signInWithGoogle function');
    } catch (error) {
      console.error('signInWithGoogle function error =>', error);
      Alert.alert(
        'Erro!',
        'Não foi possível fazer login com a conta do Google.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function signUpWithGoogle() {
    setIsLoading(true);
    try {
      console.log('signUpWithGoogle function');
    } catch (error) {
      console.error('signUpWithGoogle function error =>', error);
      Alert.alert(
        'Erro!',
        'Não foi possível criar uma conta com a conta do Google.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <FirebaseAuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signIn,
        signOut,
        signUpWithEmail,
        checkUserSession,
        recoveryPassword,
        signInWithGoogle,
        signUpWithGoogle,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
};
