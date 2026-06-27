import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { post, patch, get } from '../services/api';
import { useTheme } from '../context/ThemeContext';

/**
 * Modal for creating or editing a restaurant.
 * @param {boolean} visible - Modal visibility.
 * @param {function} onClose - Callback to close modal.
 * @param {object} [restaurant] - If provided, edits this restaurant. Otherwise creates new.
 * @param {function} onSuccess - Callback when creation/update is successful.
 */
export default function RestaurantFormModal({ visible, onClose, restaurant, onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [deliveryPrice, setDeliveryPrice] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await get('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Populate form if editing
  useEffect(() => {
    if (visible && restaurant) {
      setName(restaurant.name || '');
      setDescription(restaurant.description || '');
      setCategory(restaurant.category || '');
      setDeliveryTime(restaurant.deliveryTime || '');
      setDeliveryPrice(restaurant.deliveryPrice !== undefined ? String(restaurant.deliveryPrice) : '');
      setLatitude(restaurant.location?.lat ? String(restaurant.location.lat) : '');
      setLongitude(restaurant.location?.lng ? String(restaurant.location.lng) : '');
      setImageUri(restaurant.image || null);
    } else if (visible && !restaurant) {
      // Reset form
      setName('');
      setDescription('');
      setCategory('');
      setDeliveryTime('');
      setDeliveryPrice('');
      setLatitude('');
      setLongitude('');
      setImageUri(null);
    }
  }, [visible, restaurant]);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      // For simplicity in this exercise, we use the local URI directly as the "uploaded" image
      setImageUri(result.assets[0].uri);
    }
  }

  async function handleSubmit() {
    if (!name || !category || !latitude || !longitude || !imageUri) {
      Alert.alert('Validation Error', 'Please fill in all required fields, including location and image.');
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Validation Error', 'Latitude and Longitude must be valid numbers.');
      return;
    }

    setIsLoading(true);

    const payload = {
      name,
      description,
      category: category.toLowerCase(),
      deliveryTime,
      deliveryPrice: deliveryPrice ? Number(deliveryPrice) : 0,
      location: { lat, lng },
      image: imageUri,
    };

    try {
      if (restaurant) {
        // Update existing
        await patch(`/api/restaurants/${restaurant.id}`, payload);
      } else {
        // Create new
        await post('/api/restaurants', payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save restaurant.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{restaurant ? 'Edit Restaurant' : 'New Restaurant'}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          
          {/* Image Picker */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={32} color={colors.subtext} />
                <Text style={styles.imagePlaceholderText}>Add Cover Image *</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Form Fields */}
          <Text style={styles.label}>Restaurant Name *</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Burger Room" placeholderTextColor={colors.subtext} />

          <Text style={styles.label}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  category === cat.id && styles.categoryChipActive
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={styles.categoryChipIcon}>{cat.icon}</Text>
                <Text style={[
                  styles.categoryChipText,
                  category === cat.id && styles.categoryChipTextActive
                ]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Briefly describe the restaurant..." multiline placeholderTextColor={colors.subtext} />

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Delivery Time</Text>
              <TextInput style={styles.input} value={deliveryTime} onChangeText={setDeliveryTime} placeholder="e.g. 20-30 min" placeholderTextColor={colors.subtext} />
            </View>
            <View style={styles.space} />
            <View style={styles.flex1}>
              <Text style={styles.label}>Delivery Price (₪)</Text>
              <TextInput style={styles.input} value={deliveryPrice} onChangeText={setDeliveryPrice} placeholder="e.g. 15" keyboardType="numeric" placeholderTextColor={colors.subtext} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Latitude *</Text>
              <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} placeholder="e.g. 32.0853" keyboardType="numeric" placeholderTextColor={colors.subtext} />
            </View>
            <View style={styles.space} />
            <View style={styles.flex1}>
              <Text style={styles.label}>Longitude *</Text>
              <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} placeholder="e.g. 34.7818" keyboardType="numeric" placeholderTextColor={colors.subtext} />
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.submitBtn, isLoading && styles.disabledBtn]} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitBtnText}>Save Restaurant</Text>}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accent,
  },
  categoryChipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: colors.accent,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  space: {
    width: 12,
  },
  imagePicker: {
    height: 180,
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: colors.subtext,
    fontWeight: '600',
  },
  bottomSpace: {
    height: 40,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  submitBtn: {
    backgroundColor: colors.accent,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
