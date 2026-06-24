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
import { post, patch } from '../services/api';

const ACCENT = '#FF6B00';
const DARK = '#1A1A2E';
const GRAY = '#8E8E93';
const LIGHT_GRAY = '#F2F2F7';
const WHITE = '#FFFFFF';

/**
 * Modal for creating or editing a product.
 * @param {boolean} visible - Modal visibility.
 * @param {function} onClose - Callback to close modal.
 * @param {string} restaurantId - The ID of the restaurant this product belongs to.
 * @param {object} [product] - If provided, edits this product. Otherwise creates new.
 * @param {function} onSuccess - Callback when creation/update is successful.
 */
export default function ProductFormModal({ visible, onClose, restaurantId, product, onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (visible && product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price ? String(product.price) : '');
      setImageUri(product.image || null);
    } else if (visible && !product) {
      setName('');
      setDescription('');
      setPrice('');
      setImageUri(null);
    }
  }, [visible, product]);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for products
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handleSubmit() {
    if (!name || !price || !imageUri) {
      Alert.alert('Validation Error', 'Please provide a name, price, and image.');
      return;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Validation Error', 'Price must be a valid positive number.');
      return;
    }

    setIsLoading(true);

    const payload = {
      name,
      description,
      price: priceNum,
      image: imageUri,
    };

    try {
      if (product) {
        // Update existing
        await patch(`/api/restaurants/${restaurantId}/products/${product.id}`, payload);
      } else {
        // Create new
        await post(`/api/restaurants/${restaurantId}/products`, payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save product.');
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
            <Ionicons name="close" size={24} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.title}>{product ? 'Edit Product' : 'New Product'}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          
          {/* Image Picker */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={32} color={GRAY} />
                <Text style={styles.imagePlaceholderText}>Add Product Image *</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Form Fields */}
          <Text style={styles.label}>Product Name *</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Classic Cheeseburger" />

          <Text style={styles.label}>Price (₪) *</Text>
          <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="e.g. 58" keyboardType="numeric" />

          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Ingredients, size, etc." multiline />

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.submitBtn, isLoading && styles.disabledBtn]} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color={WHITE} /> : <Text style={styles.submitBtnText}>Save Product</Text>}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK,
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
    color: DARK,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: LIGHT_GRAY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: DARK,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    width: 140,
    height: 140,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
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
    color: GRAY,
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  bottomSpace: {
    height: 40,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  submitBtn: {
    backgroundColor: ACCENT,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
});
