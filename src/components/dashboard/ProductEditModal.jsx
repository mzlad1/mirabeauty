import React, { useState, useEffect } from "react";
import "./ProductEditModal.css";
import { 
  uploadMultipleImages, 
  deleteImage, 
  setPrimaryImage, 
  getPrimaryImage,
  validateImageFile 
} from "../../utils/imageUpload";

const ProductEditModal = ({ isOpen, onClose, onSubmit, product }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    category: product?.category || "",
    categoryName: product?.categoryName || "",
    brand: product?.brand || "",
    images: product?.images || [],
    primaryImageIndex: product?.primaryImageIndex || 0,
    inStock: product?.inStock !== undefined ? product.inStock : true,
    rating: product?.rating || 4.5,
    reviewsCount: product?.reviewsCount || 0,
    benefits: product?.benefits || [],
    ingredients: product?.ingredients || [],
    howToUse: product?.howToUse || "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        category: product.category || "",
        categoryName: product.categoryName || "",
        brand: product.brand || "",
        images: product.images || [],
        primaryImageIndex: product.primaryImageIndex || 0,
        inStock: product.inStock !== undefined ? product.inStock : true,
        rating: product.rating || 4.5,
        reviewsCount: product.reviewsCount || 0,
        benefits: product.benefits || [],
        ingredients: product.ingredients || [],
        howToUse: product.howToUse || "",
      });
    } else {
      // Reset form for new product
      setFormData({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        categoryName: "",
        brand: "",
        images: [],
        primaryImageIndex: 0,
        inStock: true,
        rating: 4.5,
        reviewsCount: 0,
        benefits: [],
        ingredients: [],
        howToUse: "",
      });
      setSelectedFiles([]);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalFormData = { ...formData };

      // Upload new images if any
      if (selectedFiles.length > 0) {
        setUploadingImages(true);
        const uploadedImages = await uploadMultipleImages(
          selectedFiles,
          `products/${product?.id || 'new'}`
        );
        finalFormData.images = [...finalFormData.images, ...uploadedImages];
        setUploadingImages(false);
      }

      // Ensure we have at least one image for new products
      if (!product && finalFormData.images.length === 0) {
        alert("يجب إضافة صورة واحدة على الأقل");
        return;
      }

      await onSubmit(finalFormData);
      onClose();
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error submitting product edit:", error);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];

    for (const file of files) {
      if (validateImageFile(file)) {
        validFiles.push(file);
      } else {
        alert(`الملف ${file.name} غير صالح. يجب أن يكون صورة أقل من 5MB`);
      }
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (index) => {
    const imageToRemove = formData.images[index];
    try {
      await deleteImage(imageToRemove.url);
      const newImages = formData.images.filter((_, i) => i !== index);
      let newPrimaryIndex = formData.primaryImageIndex;
      
      // Adjust primary index if needed
      if (index === formData.primaryImageIndex) {
        newPrimaryIndex = 0;
      } else if (index < formData.primaryImageIndex) {
        newPrimaryIndex = formData.primaryImageIndex - 1;
      }

      setFormData(prev => ({
        ...prev,
        images: newImages,
        primaryImageIndex: newPrimaryIndex
      }));
    } catch (error) {
      console.error("Error removing image:", error);
      alert("حدث خطأ أثناء حذف الصورة");
    }
  };

  const setPrimaryImageIndex = (index) => {
    setFormData(prev => ({
      ...prev,
      primaryImageIndex: index
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle array fields (benefits and ingredients)
  const addArrayItem = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], ""]
    }));
  };

  const removeArrayItem = (fieldName, index) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (fieldName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => i === index ? value : item)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="product-edit-modal-overlay">
      <div className="product-edit-modal">
        <div className="product-edit-modal-header">
          <h3>{product ? "تعديل منتج" : "إضافة منتج"}</h3>
          <button className="product-edit-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-edit-modal-form">
          <div className="product-edit-form-row">
            <div className="product-edit-form-group">
              <label htmlFor="name">اسم المنتج *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="product-edit-form-input"
              />
            </div>
          </div>

          <div className="product-edit-form-row">
            <div className="product-edit-form-group">
              <label htmlFor="description">الوصف *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="product-edit-form-textarea"
                rows="3"
              />
            </div>
          </div>

          <div className="product-edit-form-row-2">
            <div className="product-edit-form-group">
              <label htmlFor="price">السعر *</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="product-edit-form-input"
                placeholder="مثال: 150 شيكل"
              />
            </div>

            <div className="product-edit-form-group">
              <label htmlFor="originalPrice">السعر الأصلي (اختياري)</label>
              <input
                type="text"
                id="originalPrice"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="product-edit-form-input"
                placeholder="مثال: 180 شيكل"
              />
            </div>
          </div>

          <div className="product-edit-form-row-2">
            <div className="product-edit-form-group">
              <label htmlFor="category">رمز الفئة *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="product-edit-form-input"
              >
                <option value="">اختر الفئة</option>
                <option value="skincare">عناية بالبشرة</option>
                <option value="anti-aging">مكافحة الشيخوخة</option>
                <option value="whitening">تفتيح البشرة</option>
                <option value="serums">سيروم</option>
                <option value="masks">ماسكات</option>
                <option value="eye-care">عناية بالعين</option>
                <option value="sunscreen">واقي الشمس</option>
                <option value="body-care">عناية بالجسم</option>
              </select>
            </div>

            <div className="product-edit-form-group">
              <label htmlFor="categoryName">اسم الفئة *</label>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                required
                className="product-edit-form-input"
                placeholder="مثال: العناية بالبشرة"
              />
            </div>
          </div>

          <div className="product-edit-form-row-2">
            <div className="product-edit-form-group">
              <label htmlFor="brand">العلامة التجارية *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="product-edit-form-input"
                placeholder="مثال: ميرا بيوتي"
              />
            </div>

            <div className="product-edit-form-group">
              <label htmlFor="rating">التقييم (1-5)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="product-edit-form-input"
              />
            </div>
          </div>

          <div className="product-edit-form-row">
            <div className="product-edit-form-group">
              <label>الفوائد</label>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="array-input-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => updateArrayItem('benefits', index, e.target.value)}
                    className="product-edit-form-input"
                    placeholder="مثال: إشراق فوري للبشرة"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('benefits', index)}
                    className="remove-array-item-btn"
                    style={{ 
                      background: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      padding: '8px 12px',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('benefits')}
                className="add-array-item-btn"
                style={{ 
                  background: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  padding: '8px 16px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                <i className="fas fa-plus"></i> إضافة فائدة
              </button>
            </div>
          </div>

          <div className="product-edit-form-row">
            <div className="product-edit-form-group">
              <label>المكونات</label>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="array-input-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateArrayItem('ingredients', index, e.target.value)}
                    className="product-edit-form-input"
                    placeholder="مثال: فيتامين C 20%"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('ingredients', index)}
                    className="remove-array-item-btn"
                    style={{ 
                      background: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      padding: '8px 12px',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('ingredients')}
                className="add-array-item-btn"
                style={{ 
                  background: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  padding: '8px 16px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                <i className="fas fa-plus"></i> إضافة مكون
              </button>
            </div>
          </div>

          <div className="product-edit-form-row">
            <div className="product-edit-form-group">
              <label htmlFor="howToUse">طريقة الاستخدام</label>
              <textarea
                id="howToUse"
                name="howToUse"
                value={formData.howToUse}
                onChange={handleChange}
                className="product-edit-form-input"
                placeholder="مثال: يُطبق صباحاً قبل المرطب وواقي الشمس"
                rows="3"
              />
            </div>
          </div>

          <div className="product-edit-form-row">
            <div className="product-edit-form-group">
              <label>الصور *</label>
              
              {/* File Upload */}
              <div className="image-upload-section">
                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="image-upload-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="imageUpload" className="image-upload-button">
                  <span>اختر صور</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </label>
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="selected-files-preview">
                  <h4>الصور المحددة للرفع:</h4>
                  <div className="files-grid">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="file-preview-item">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name}
                          className="file-preview-image"
                        />
                        <div className="file-preview-info">
                          <span className="file-name">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(index)}
                            className="remove-file-btn"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Images */}
              {formData.images.length > 0 && (
                <div className="existing-images">
                  <h4>الصور الحالية:</h4>
                  <div className="images-grid">
                    {formData.images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img 
                          src={image.url} 
                          alt={`صورة ${index + 1}`}
                          className="existing-image"
                        />
                        <div className="image-controls">
                          <button
                            type="button"
                            onClick={() => setPrimaryImageIndex(index)}
                            className={`primary-btn ${index === formData.primaryImageIndex ? 'active' : ''}`}
                          >
                            {index === formData.primaryImageIndex ? 'صورة رئيسية' : 'جعل رئيسية'}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="remove-image-btn"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadingImages && (
                <div className="upload-progress">
                  <span>جاري رفع الصور...</span>
                </div>
              )}
            </div>
          </div>

          <div className="product-edit-form-row">
            <div className="product-edit-form-group product-edit-checkbox-group">
              <label className="product-edit-checkbox-label">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                />
                متوفر في المخزون
              </label>
            </div>
          </div>

          <div className="product-edit-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="product-edit-btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="product-edit-btn-primary"
              disabled={loading}
            >
              {loading ? "جاري الحفظ..." : product ? "تحديث" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
