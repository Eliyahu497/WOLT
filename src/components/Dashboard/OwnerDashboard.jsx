import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './OwnerDashboard.css';

export const OwnerDashboard = () => {
  const { user, token } = useAuth();
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedRestaurant = restaurants.find(r => r.id === restaurantId) || null;

  // Modals state
  const [showAddRestaurantModal, setShowAddRestaurantModal] = useState(false);
  const [showEditRestaurantModal, setShowEditRestaurantModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  
  // Forms state
  const [restaurantForm, setRestaurantForm] = useState({ name: '', description: '', lat: '', lng: '', image: '' });
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', image: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');

  const handleImageUpload = (e, formType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (formType === 'restaurant') {
          setRestaurantForm(prev => ({ ...prev, image: reader.result }));
        } else if (formType === 'product') {
          setProductForm(prev => ({ ...prev, image: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Fallback defaults for missing UI details in backend restaurant object
  const getUiRestaurant = (rest) => {
    return {
      ...rest,
      image: rest.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=60",
      rating: rest.rating || 5.0,
      deliveryTime: rest.deliveryTime || "25-35 min",
      deliveryPrice: rest.deliveryPrice || 15
    };
  };

  // Fetch all restaurants and filter by current owner
  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/restaurants');
      if (res.ok) {
        const data = await res.json();
        // Backend stores owner as 'owner', but mock has 'ownerId'
        const myRests = data.filter(r => r.owner === user.id || r.ownerId === user.id);
        setRestaurants(myRests.map(getUiRestaurant));
      }
    } catch (err) {
      console.error("Failed to load restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for the selected restaurant
  const loadProducts = async (restaurantId) => {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, [user.id]);

  useEffect(() => {
    if (restaurantId) {
      loadProducts(restaurantId);
    }
  }, [restaurantId]);

  // Restaurant Actions
  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    if (!restaurantForm.name.trim() || !restaurantForm.image.trim()) {
      setError('Restaurant name and image are required');
      return;
    }
    if (!restaurantForm.lat || !restaurantForm.lng || isNaN(Number(restaurantForm.lat)) || isNaN(Number(restaurantForm.lng))) {
      setError('Valid latitude and longitude are required');
      return;
    }

    try {
      setError('');
      const res = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: restaurantForm.name.trim(),
          description: restaurantForm.description.trim(),
          location: {
            lat: Number(restaurantForm.lat),
            lng: Number(restaurantForm.lng)
          },
          image: restaurantForm.image.trim()
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create restaurant');
      }

      setRestaurantForm({ name: '', description: '', lat: '', lng: '', image: '' });
      setShowAddRestaurantModal(false);
      await loadRestaurants();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditRestaurant = async (e) => {
    e.preventDefault();
    if (!restaurantForm.name.trim() || !restaurantForm.image.trim()) {
      setError('Restaurant name and image are required');
      return;
    }
    if (restaurantForm.lat || restaurantForm.lng) {
      if (isNaN(Number(restaurantForm.lat)) || isNaN(Number(restaurantForm.lng))) {
        setError('Latitude and longitude must be valid numbers');
        return;
      }
    }

    try {
      setError('');
      const res = await fetch(`/api/restaurants/${selectedRestaurant.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: restaurantForm.name.trim(),
          description: restaurantForm.description.trim(),
          location: restaurantForm.lat && restaurantForm.lng ? {
            lat: Number(restaurantForm.lat),
            lng: Number(restaurantForm.lng)
          } : undefined,
          image: restaurantForm.image.trim()
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update restaurant');
      }

      setRestaurantForm({ name: '', description: '', lat: '', lng: '', image: '' });
      setShowEditRestaurantModal(false);
      await loadRestaurants();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    if (!window.confirm('Are you sure you want to delete this restaurant and all its products?')) {
      return;
    }

    try {
      const res = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete restaurant');
      }

      navigate('/owner');
      await loadRestaurants();
    } catch (err) {
      alert(err.message);
    }
  };

  // Product Actions
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { name, description, price, image } = productForm;
    if (!name.trim() || !price || !image.trim()) {
      setError('Name, price and image are required');
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError('Price must be a positive number');
      return;
    }

    try {
      setError('');
      const res = await fetch(`/api/restaurants/${selectedRestaurant.id}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          image: image.trim()
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add product');
      }

      setProductForm({ name: '', description: '', price: '', image: '' });
      setShowAddProductModal(false);
      await loadProducts(selectedRestaurant.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    const { name, description, price, image } = productForm;
    if (!name.trim() || !price || !image.trim()) {
      setError('Name, price and image are required');
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError('Price must be a positive number');
      return;
    }

    try {
      setError('');
      const res = await fetch(`/api/restaurants/${selectedRestaurant.id}/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          image: image.trim()
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update product');
      }

      setProductForm({ name: '', description: '', price: '', image: '' });
      setEditingProduct(null);
      setShowEditProductModal(false);
      await loadProducts(selectedRestaurant.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const res = await fetch(`/api/restaurants/${selectedRestaurant.id}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      await loadProducts(selectedRestaurant.id);
    } catch (err) {
      alert(err.message);
    }
  };

  // Modal open triggers
  const openEditRestaurant = () => {
    setRestaurantForm({
      name: selectedRestaurant.name,
      description: selectedRestaurant.description || '',
      lat: selectedRestaurant.location?.lat?.toString() || '',
      lng: selectedRestaurant.location?.lng?.toString() || '',
      image: selectedRestaurant.image || ''
    });
    setError('');
    setShowEditRestaurantModal(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image: product.image || ''
    });
    setError('');
    setShowEditProductModal(true);
  };

  return (
    <div className="owner-dashboard">
      {!selectedRestaurant ? (
        // List of Owner's Restaurants
        <div className="dashboard-content">
          <div className="dashboard-header-row">
            <div>
              <h1 className="owner-title">Partner Dashboard</h1>
              <p className="owner-subtitle">Manage your stores, dishes, and culinary listings</p>
            </div>
            <button 
              className="add-restaurant-btn"
              onClick={() => {
                setRestaurantForm({ name: '', description: '', lat: '', lng: '', image: '' });
                setError('');
                setShowAddRestaurantModal(true);
              }}
            >
              + Create Restaurant
            </button>
          </div>

          {loading ? (
            <div className="owner-loading">Loading your stores...</div>
          ) : restaurants.length === 0 ? (
            <div className="owner-empty-state">
              <span className="empty-emoji">🏪</span>
              <h3>No restaurants registered yet</h3>
              <p>Get started by creating your first restaurant menu!</p>
            </div>
          ) : (
            <div className="restaurants-grid">
              {restaurants.map((rest) => (
                <div key={rest.id} className="restaurant-card owner-card">
                  <div className="card-image-wrapper" onClick={() => navigate(`/owner/restaurant/${rest.id}`)}>
                    <img src={rest.image} alt={rest.name} className="card-image" />
                  </div>
                  <div className="card-content">
                    <h3 className="card-name" onClick={() => navigate(`/owner/restaurant/${rest.id}`)}>{rest.name}</h3>
                    <p className="card-description">{rest.description}</p>
                    <div className="owner-card-actions">
                      <button 
                        className="owner-action-btn manage"
                        onClick={() => navigate(`/owner/restaurant/${rest.id}`)}
                      >
                        ⚙️ Manage Menu
                      </button>
                      <button 
                        className="owner-action-btn delete"
                        onClick={() => handleDeleteRestaurant(rest.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Specific Restaurant Menu Management
        <div className="restaurant-management-page">
          <button className="back-btn" onClick={() => navigate('/owner')}>
            ← Back to Stores
          </button>

          <div className="management-header-banner">
            <div className="banner-details-container">
              <h1 className="managed-title">{selectedRestaurant.name}</h1>
              <p className="managed-desc">{selectedRestaurant.description}</p>
              <div className="managed-meta">
                <span>⭐ {selectedRestaurant.rating}</span>
                <span>•</span>
                <span>🛵 Delivery: {selectedRestaurant.deliveryPrice} ILS</span>
              </div>
            </div>
            <div className="managed-header-actions">
              <button className="manage-ctrl-btn edit" onClick={openEditRestaurant}>
                ✏️ Edit Store Info
              </button>
              <button 
                className="manage-ctrl-btn add-product"
                onClick={() => {
                  setProductForm({ name: '', description: '', price: '', image: '' });
                  setError('');
                  setShowAddProductModal(true);
                }}
              >
                + Add Dish
              </button>
            </div>
          </div>

          <div className="menu-container">
            <h2 className="section-heading">Manage Menu Items</h2>
            
            {products.length === 0 ? (
              <p className="no-items-msg">No products found. Add a dish to your menu!</p>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product.id} className="product-card owner-product-card">
                    <div className="product-details">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-desc">{product.description}</p>
                      <span className="product-price">{product.price} ILS</span>
                      <div className="product-owner-actions">
                        <button className="prod-edit-btn" onClick={() => openEditProduct(product)}>
                          ✏️ Edit
                        </button>
                        <button className="prod-delete-btn" onClick={() => handleDeleteProduct(product.id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    {product.image && (
                      <div className="product-image-wrapper">
                        <img src={product.image} alt={product.name} className="product-thumbnail" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Restaurant Modal */}
      {showAddRestaurantModal && (
        <div className="modal-overlay" onClick={() => setShowAddRestaurantModal(false)}>
          <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Register New Restaurant</h2>
              <button className="modal-close-btn" onClick={() => setShowAddRestaurantModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddRestaurant} className="modal-form">
              {error && <div className="auth-error-message">{error}</div>}
              <div className="form-group">
                <label>Restaurant Name <span style={{ color: '#eb5757' }}>*</span></label>
                <input
                  type="text"
                  value={restaurantForm.name}
                  onChange={(e) => setRestaurantForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Pizza Prego"
                />
              </div>
              <div className="form-group">
                <label>Cuisine Description</label>
                <input
                  type="text"
                  value={restaurantForm.description}
                  onChange={(e) => setRestaurantForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Italian stone-baked pizza and pasta dishes"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Latitude <span style={{ color: '#eb5757' }}>*</span></label>
                  <input
                    type="number"
                    step="any"
                    value={restaurantForm.lat}
                    onChange={(e) => setRestaurantForm(prev => ({ ...prev, lat: e.target.value }))}
                    placeholder="e.g. 32.085"
                  />
                </div>
                <div className="form-group">
                  <label>Longitude <span style={{ color: '#eb5757' }}>*</span></label>
                  <input
                    type="number"
                    step="any"
                    value={restaurantForm.lng}
                    onChange={(e) => setRestaurantForm(prev => ({ ...prev, lng: e.target.value }))}
                    placeholder="e.g. 34.781"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Restaurant Image <span style={{ color: '#eb5757' }}>*</span></label>
                <label className="custom-file-upload">
                  📁 Choose Restaurant Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'restaurant')}
                  />
                </label>
                {restaurantForm.image && (
                  <div className="form-image-preview" style={{ marginTop: '10px' }}>
                    <img 
                      src={restaurantForm.image} 
                      alt="Restaurant Preview" 
                      style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                    />
                  </div>
                )}
              </div>
              <button type="submit" className="modal-submit-btn">Create Store</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Restaurant Modal */}
      {showEditRestaurantModal && (
        <div className="modal-overlay" onClick={() => setShowEditRestaurantModal(false)}>
          <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Restaurant Details</h2>
              <button className="modal-close-btn" onClick={() => setShowEditRestaurantModal(false)}>✕</button>
            </div>
            <form onSubmit={handleEditRestaurant} className="modal-form">
              {error && <div className="auth-error-message">{error}</div>}
              <div className="form-group">
                <label>Restaurant Name <span style={{ color: '#eb5757' }}>*</span></label>
                <input
                  type="text"
                  value={restaurantForm.name}
                  onChange={(e) => setRestaurantForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Cuisine Description</label>
                <input
                  type="text"
                  value={restaurantForm.description}
                  onChange={(e) => setRestaurantForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Latitude <span style={{ color: '#eb5757' }}>*</span></label>
                  <input
                    type="number"
                    step="any"
                    value={restaurantForm.lat}
                    onChange={(e) => setRestaurantForm(prev => ({ ...prev, lat: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Longitude <span style={{ color: '#eb5757' }}>*</span></label>
                  <input
                    type="number"
                    step="any"
                    value={restaurantForm.lng}
                    onChange={(e) => setRestaurantForm(prev => ({ ...prev, lng: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Restaurant Image <span style={{ color: '#eb5757' }}>*</span></label>
                <label className="custom-file-upload">
                  📁 Choose Restaurant Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'restaurant')}
                  />
                </label>
                {restaurantForm.image && (
                  <div className="form-image-preview" style={{ marginTop: '10px' }}>
                    <img 
                      src={restaurantForm.image} 
                      alt="Restaurant Preview" 
                      style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                    />
                  </div>
                )}
              </div>
              <button type="submit" className="modal-submit-btn">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay" onClick={() => setShowAddProductModal(false)}>
          <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Product / Dish</h2>
              <button className="modal-close-btn" onClick={() => setShowAddProductModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddProduct} className="modal-form">
              {error && <div className="auth-error-message">{error}</div>}
              <div className="form-group">
                <label>Dish Name <span style={{ color: '#eb5757' }}>*</span></label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Classic Margherita"
                />
              </div>
              <div className="form-group">
                <label>Ingredients Description</label>
                <input
                  type="text"
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Fresh tomatoes, mozzarella cheese and basil"
                />
              </div>
              <div className="form-group">
                <label>Price (ILS) <span style={{ color: '#eb5757' }}>*</span></label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g. 55"
                />
              </div>
              <div className="form-group">
                <label>Product Image <span style={{ color: '#eb5757' }}>*</span></label>
                <label className="custom-file-upload">
                  📁 Choose Dish Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'product')}
                  />
                </label>
                {productForm.image && (
                  <div className="form-image-preview" style={{ marginTop: '10px' }}>
                    <img 
                      src={productForm.image} 
                      alt="Product Preview" 
                      style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                    />
                  </div>
                )}
              </div>
              <button type="submit" className="modal-submit-btn">Add Product</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && (
        <div className="modal-overlay" onClick={() => setShowEditProductModal(false)}>
          <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Product / Dish</h2>
              <button className="modal-close-btn" onClick={() => setShowEditProductModal(false)}>✕</button>
            </div>
            <form onSubmit={handleEditProduct} className="modal-form">
              {error && <div className="auth-error-message">{error}</div>}
              <div className="form-group">
                <label>Dish Name <span style={{ color: '#eb5757' }}>*</span></label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Ingredients Description</label>
                <input
                  type="text"
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Price (ILS) <span style={{ color: '#eb5757' }}>*</span></label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Product Image <span style={{ color: '#eb5757' }}>*</span></label>
                <label className="custom-file-upload">
                  📁 Choose Dish Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'product')}
                  />
                </label>
                {productForm.image && (
                  <div className="form-image-preview" style={{ marginTop: '10px' }}>
                    <img 
                      src={productForm.image} 
                      alt="Product Preview" 
                      style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                    />
                  </div>
                )}
              </div>
              <button type="submit" className="modal-submit-btn">Save Dish Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
