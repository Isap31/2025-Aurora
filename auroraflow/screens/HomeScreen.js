import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, Alert, FlatList, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';

export default function HomeScreen() {
  const [glucoseLevel, setGlucoseLevel] = useState('');
  const [logs, setLogs] = useState([]);

  const handleLog = () => {
    if (!glucoseLevel) {
      Alert.alert('Missing Info', 'Please enter your glucose level.');
      return;
    }

    const now = new Date();
    const newEntry = {
      id: Date.now().toString(),
      level: glucoseLevel,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLogs([newEntry, ...logs]);
    setGlucoseLevel('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.header}>🌟 AuroraFlow</Text>
      <Text style={styles.subheader}>Log Your Glucose</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter mg/dL"
        value={glucoseLevel}
        onChangeText={setGlucoseLevel}
        placeholderTextColor="#888"
      />
      <Button title="Log Glucose" onPress={handleLog} color="#7B2CBF" />

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text style={styles.logText}>🩸 {item.level} mg/dL</Text>
            <Text style={styles.logTime}>
              {item.date} • {item.time}
            </Text>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5EDFF', padding: 20, paddingTop: 60 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#5A189A', marginBottom: 10, textAlign: 'center' },
  subheader: { fontSize: 18, marginBottom: 20, color: '#6A4C93', textAlign: 'center' },
  input: { height: 50, borderColor: '#D0BCFF', borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, backgroundColor: '#FFFFFF', marginBottom: 10 },
  list: { marginTop: 20 },
  logItem: { backgroundColor: '#EBDFFC', padding: 12, borderRadius: 8, marginBottom: 10 },
  logText: { fontSize: 16, color: '#3C096C', marginBottom: 4 },
  logTime: { fontSize: 14, color: '#9D4EDD' },
});

