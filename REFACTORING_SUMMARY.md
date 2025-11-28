# FAQ and Skin Types Refactoring Summary

## Overview

Refactored the FAQ and Skin Types system to use document IDs as references instead of hardcoded English values and Arabic labels. This allows admins to change names without affecting existing data.

## Changes Made

### 1. **Skin Types System**

#### Before:

- Admin entered: `value` (English, e.g., "oily") and `label` (Arabic, e.g., "دهنية")
- Users stored: `skinType: "oily"` (string value)
- Problem: Changing the label didn't update existing users

#### After:

- Admin enters: `name` (Arabic only, e.g., "بشرة دهنية")
- System generates: Document ID automatically
- Users store: `skinType: "documentId123"` (reference to skin type document)
- Benefit: Changing the name updates for all users automatically

#### Files Modified:

- `src/components/dashboard/SkinTypeModal.jsx` - Simplified to single name field
- `src/components/dashboard/UserModal.jsx` - Uses document IDs
- `src/pages/RegisterPage.jsx` - Uses document IDs
- `src/pages/AdminDashboardPage.jsx` - Display shows name and ID

### 2. **FAQ Types System**

#### Before:

- Admin entered: `value` (English, e.g., "booking") and `label` (Arabic, e.g., "الحجز")
- FAQs stored: `category: "booking"` (string value)
- Problem: Changing the label didn't update existing FAQs

#### After:

- Admin enters: `name` (Arabic only, e.g., "الحجز والمواعيد")
- System generates: Document ID automatically
- FAQs store: `category: "documentId456"` (reference to FAQ type document)
- Benefit: Changing the name updates for all FAQs automatically

#### Files Modified:

- `src/components/admin/FAQTypeModal.jsx` - Simplified to single name field
- `src/components/admin/FAQModal.jsx` - Uses document IDs for categories
- `src/pages/AdminDashboardPage.jsx` - Display shows names, filter uses IDs
- `src/services/faqService.js` - Added `reorderFAQTypes()` function

### 3. **FAQ Types Ordering Feature**

#### New Feature:

- Admin can now drag and drop FAQ types to reorder them
- Order is saved automatically to Firestore
- Uses HTML5 drag-and-drop API

#### Implementation:

- Added `draggable` attribute to FAQ type items
- Implemented `onDragStart`, `onDragOver`, and `onDrop` handlers
- Added grip icon to indicate draggable items
- Calls `reorderFAQTypes()` service function to persist order

## Benefits

1. **Flexibility**: Admin can rename types without breaking references
2. **Maintainability**: Single source of truth for type names
3. **Scalability**: Easy to add new fields to types in the future
4. **User Experience**: Consistent naming across the application
5. **Ordering**: FAQ types can be reordered by drag and drop

## Testing Checklist

- [ ] Create new skin type - verify it appears in registration and admin user forms
- [ ] Edit skin type name - verify it updates everywhere
- [ ] Delete skin type - verify it's removed from dropdowns
- [ ] Create new FAQ type - verify it appears in FAQ form dropdown
- [ ] Edit FAQ type name - verify existing FAQs show new name
- [ ] Drag and drop FAQ types - verify order is saved and persists
- [ ] Filter FAQs by category - verify it works with new IDs
- [ ] Register new user with skin type - verify it saves as document ID
- [ ] Edit existing user skin type - verify it saves correctly

## Future Enhancements

1. Add skin type descriptions or properties
2. Add FAQ type icons or colors
3. Implement skin types ordering (similar to FAQ types)