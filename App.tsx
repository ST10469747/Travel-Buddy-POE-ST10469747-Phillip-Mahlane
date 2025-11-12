import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

type MenuItem = { name: string; price: number; category: string };

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [screen, setScreen] = useState<'home' | 'manage' | 'filter'>('home');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // ADD ITEM FUNCTION
  const addItem = () => {
    if (newName.trim() === '' || newPrice.trim() === '' || newCategory.trim() === '') {
      Alert.alert('Please fill in all fields.');
      return;
    }

    const newItem = {
      name: newName,
      price: parseFloat(newPrice),
      category: newCategory.toLowerCase(),
    };

    setMenuItems([...menuItems, newItem]);
    setNewName('');
    setNewPrice('');
    setNewCategory('');
    Alert.alert('Item added!');
  };

  // REMOVE ITEM FUNCTION
  const removeItem = (index: number) => {
    const updated = [...menuItems];
    updated.splice(index, 1);
    setMenuItems(updated);
  };

  // GET ITEMS BY CATEGORY
  const getItemsByCategory = (category: string) =>
    menuItems.filter((item) => item.category === category.toLowerCase());

  // CALCULATE AVERAGE PRICE PER CATEGORY
  const getAveragePrice = (category: string) => {
    const items = getItemsByCategory(category);
    if (items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + item.price, 0);
    return (total / items.length).toFixed(2);
  };

  // ---------- SCREENS ----------

  // HOME SCREEN
  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chef Christoffel’s Menu</Text>

        <ScrollView style={styles.list}>
          {['starter', 'main', 'drink', 'dessert'].map((category) => {
            const items = getItemsByCategory(category);
            if (items.length === 0) return null;

            return (
              <View key={category} style={styles.categoryBox}>
                <Text style={styles.categoryTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} — Average Price: R
                  {getAveragePrice(category)}
                </Text>

                {items.map((item, index) => (
                  <View key={index} style={styles.itemBox}>
                    <Text style={styles.itemText}>
                      {item.name} - R{item.price.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}

          {menuItems.length === 0 && (
            <Text style={styles.noItems}>No menu items yet.</Text>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={() => setScreen('manage')}>
          <Text style={styles.buttonText}>Go to Manage Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FFA500' }]}
          onPress={() => setScreen('filter')}
        >
          <Text style={styles.buttonText}>Go to Filter Page</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // MANAGE SCREEN
  if (screen === 'manage') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Manage Menu</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter food or drink name"
          value={newName}
          onChangeText={setNewName}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter price (e.g. 25.99)"
          keyboardType="numeric"
          value={newPrice}
          onChangeText={setNewPrice}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter category (e.g. Starter, Main, Drink, Dessert)"
          value={newCategory}
          onChangeText={setNewCategory}
        />

        <TouchableOpacity style={styles.button} onPress={addItem}>
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Remove Item from Menu</Text>
        <ScrollView>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.itemBox, { backgroundColor: '#f9d6d5' }]}
              onPress={() => removeItem(index)}
            >
              <Text style={styles.itemText}>
                {item.name} - R{item.price.toFixed(2)} ({item.category})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ADD8E6', marginTop: 10 }]}
          onPress={() => setScreen('home')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // FILTER SCREEN
  if (screen === 'filter') {
    const filteredItems = getItemsByCategory(filterCategory);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Filter Menu by Category</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter category to view (e.g. Starter, Main)"
          value={filterCategory}
          onChangeText={setFilterCategory}
        />

        <TouchableOpacity style={styles.button} onPress={() => setFilterCategory(filterCategory)}>
          <Text style={styles.buttonText}>Show Items</Text>
        </TouchableOpacity>

        <ScrollView style={styles.list}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <View key={index} style={styles.itemBox}>
                <Text style={styles.itemText}>
                  {item.name} - R{item.price.toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noItems}>No items in this category.</Text>
          )}
        </ScrollView>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ADD8E6' }]}
          onPress={() => setScreen('home')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 18, marginVertical: 10, fontWeight: 'bold' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 5,
    padding: 10, marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50', padding: 12, borderRadius: 8,
    alignItems: 'center', marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  list: { marginBottom: 20 },
  categoryBox: { marginBottom: 15 },
  categoryTitle: {
    fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#333',
  },
  itemBox: {
    padding: 10, borderBottomWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 5,
  },
  itemText: { fontSize: 16 },
  noItems: { textAlign: 'center', color: 'gray', marginVertical: 10 },
})

