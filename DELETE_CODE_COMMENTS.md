# DELETE Implementation - Code Comments & Examples

## Service Layer Integration

### Location: `src/views/mainpages/services/ApiEndpoint.js`

```javascript
// =====================================================
// DELETE API Service Functions
// =====================================================

/**
 * Delete a Forex request (Admin only)
 * POST /api/forex/request/:id
 * 
 * @param {string} id - The MongoDB ID of the forex request
 * @returns {Promise} Response with success/error status
 * 
 * Example:
 * const response = await deleteForexRequest('507f1f77bcf86cd799439011');
 * // Response: { success: true, data: {...deleted record...} }
 */
export const deleteForexRequest = (id) => {
  return instance.delete(`/api/forex/request/${id}`);
};

/**
 * Delete a GIC form
 * DELETE /auth/deleteGicForm/:id
 * 
 * @param {string} id - The MongoDB ID of the GIC form
 * @returns {Promise} Response with success/error status
 */
export const deleteGicForm = (id) => {
  return instance.delete(`/auth/deleteGicForm/${id}`);
};

/**
 * Delete a Blocked Account record
 * DELETE /auth/deleteBlockedAccount/:id
 * 
 * @param {string} id - The MongoDB ID of the blocked account
 * @returns {Promise} Response with success/error status
 */
export const deleteBlockedAccount = (id) => {
  return instance.delete(`/auth/deleteBlockedAccount/${id}`);
};

/**
 * Delete an OSHC entry
 * DELETE /api/oshc/:id
 * 
 * Permissions:
 * - Agents: Can delete only their own records
 * - Admins: Can delete any record
 * 
 * @param {string} id - The MongoDB ID of the OSHC entry
 * @returns {Promise} Response with success/error status
 */
export const deleteOshc = (id) => {
  return instance.delete(`/api/oshc/${id}`);
};

/**
 * Delete a Student Funding request (Admin only)
 * DELETE /api/student-funding/admin/delete/:id
 * 
 * @param {string} id - The MongoDB ID of the student funding request
 * @returns {Promise} Response with success/error status
 */
export const deleteStudentFunding = (id) => {
  return instance.delete(`/api/student-funding/admin/delete/${id}`);
};

/**
 * Delete a Payment Tagging record (Admin only)
 * DELETE /api/payment-tagging/admin/delete/:id
 * 
 * @param {string} id - The MongoDB ID of the payment tagging record
 * @returns {Promise} Response with success/error status
 */
export const deletePaymentTagging = (id) => {
  return instance.delete(`/api/payment-tagging/admin/delete/${id}`);
};
```

---

## View Implementation Pattern

### Location: Any detail/view component

```javascript
// ============================================
// DELETE FUNCTIONALITY IMPLEMENTATION
// ============================================

import { useNavigate } from 'react-router-dom';
import { deleteForexRequest } from '../../services/ApiEndpoint';
import { 
  AlertDialog, 
  AlertDialogBody,
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogContent, 
  AlertDialogOverlay 
} from '@chakra-ui/react';

/**
 * STATE SETUP
 * Initialize delete-related state variables
 */
function YourViewComponent() {
  const navigate = useNavigate();
  const toast = useToast();
  
  // DELETE functionality states
  // isDeleteDialogOpen: Controls visibility of confirmation dialog
  // isDeleting: Tracks API call in progress (prevents double-clicks)
  // cancelRef: Reference for Chakra AlertDialog focus management
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const cancelRef = React.useRef();

  /**
   * HANDLE DELETE
   * 
   * Process:
   * 1. Set loading state to prevent double-clicks
   * 2. Call delete API function with record ID
   * 3. Handle success: show toast, close dialog, navigate away
   * 4. Handle errors: show specific error messages
   * 5. Finally: reset loading state
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Call the DELETE API function
      const response = await deleteForexRequest(id);
      
      // Check if deletion was successful
      if (response.data.success) {
        // Show success notification
        toast({
          title: 'Success',
          description: 'Forex record deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Close the confirmation dialog
        setIsDeleteDialogOpen(false);
        
        // Navigate user back to list view
        navigate('/admin/forex');
      }
    } catch (error) {
      console.error('Error deleting Forex record:', error);
      
      // Handle different error scenarios
      // This provides specific, user-friendly error messages
      let errorMessage = 'Failed to delete Forex record';
      
      // 404: Record doesn't exist or already deleted
      if (error.response?.status === 404) {
        errorMessage = 'Forex record not found or already deleted';
      } 
      // 401: Authentication/authorization issue
      else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized - Admin access required';
      } 
      // Use backend error message if available
      else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      // Show error notification
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      // Always reset loading state when done
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* 
        DELETE BUTTON
        - Only show when not in edit mode (to avoid confusion)
        - Disabled while deleting to prevent double-clicks
        - Uses red color scheme and trash icon for consistency
      */}
      {!isEditing && (
        <Button
          colorScheme="red"
          leftIcon={<Icon as={FiTrash2} />}
          onClick={() => setIsDeleteDialogOpen(true)}
          isDisabled={loading || isDeleting}
        >
          Delete
        </Button>
      )}

      {/* 
        DELETE CONFIRMATION DIALOG (Chakra UI)
        
        Key features:
        - Shows only when isDeleteDialogOpen is true
        - cancelRef maintains focus for accessibility
        - Cancel button closes without deleting
        - Delete button triggers handleDelete
        - Disabled state prevents interaction while deleting
      */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Forex Record
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this Forex record? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              {/* Cancel button - closes dialog without deleting */}
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteDialogOpen(false)}
                isDisabled={isDeleting}
              >
                Cancel
              </Button>
              
              {/* Delete button - calls handleDelete */}
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={isDeleting}
                loadingText="Deleting..."
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
```

---

## Material UI Alternative

### For MUI-based components (like Agent Forex View)

```javascript
// Use Dialog instead of AlertDialog for Material UI components
<Dialog
  open={isDeleteDialogOpen}
  onClose={() => setIsDeleteDialogOpen(false)}
>
  <DialogTitle>Delete Forex Record</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete this Forex record? This action cannot be undone.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setIsDeleteDialogOpen(false)}
      disabled={isDeleting}
    >
      Cancel
    </Button>
    <Button
      onClick={handleDelete}
      color="error"
      variant="contained"
      disabled={isDeleting}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  </DialogActions>
</Dialog>
```

---

## Error Handling Examples

### Handling API Errors

```javascript
/**
 * Common HTTP status codes and how to handle them:
 */

try {
  const response = await deleteForexRequest(id);
  
  if (response.data.success) {
    // Success case - handled above
  }
} catch (error) {
  // 404: Record not found or already deleted
  if (error.response?.status === 404) {
    // User likely already deleted it elsewhere
    // Navigate them back to list
    navigate('/admin/forex');
  }
  
  // 401: Missing or invalid authentication token
  else if (error.response?.status === 401) {
    // User needs to log in again
    // Backend will handle redirect to login
  }
  
  // 403: User doesn't have permission
  else if (error.response?.status === 403) {
    // e.g., agent trying to delete another agent's record
  }
  
  // 400: Bad request (invalid ID format, etc.)
  else if (error.response?.status === 400) {
    // Shouldn't happen if frontend validates IDs
  }
  
  // 500: Server error
  else if (error.response?.status === 500) {
    // Database or server issue - user can retry
  }
  
  // Network error (no response)
  else if (!error.response) {
    // Network connection issue
  }
}
```

---

## Testing the DELETE Feature

### Manual Testing Steps

```javascript
/**
 * Test Case 1: Successful Deletion
 * Expected: Record deleted, toast shown, navigate to list
 */
1. Navigate to any detail/view page
2. Click Delete button
3. Confirm in dialog
4. Verify: "Success" toast appears
5. Verify: Auto-navigated to list view
6. Verify: Record no longer in list (refresh if needed)

/**
 * Test Case 2: Cancel Deletion
 * Expected: Dialog closes, no deletion occurs
 */
1. Click Delete button
2. Click Cancel in dialog
3. Verify: Dialog closes
4. Verify: Still on detail page
5. Verify: Record still exists

/**
 * Test Case 3: Handle 404 Error
 * Expected: User-friendly error message
 */
1. Manually delete record via API
2. Try to delete same record from UI
3. Verify: Error toast shows "Record not found or already deleted"

/**
 * Test Case 4: Handle 401 Error
 * Expected: Shows unauthorized message
 */
1. Clear token from localStorage
2. Try to delete
3. Verify: Error toast shows "Unauthorized"

/**
 * Test Case 5: Double-Click Prevention
 * Expected: Button disabled while deleting
 */
1. Click Delete
2. Confirm
3. Quickly try to click Delete button again
4. Verify: Button is disabled (loadingText showing)
```

---

## Maintenance Notes

### When Adding DELETE to a New Service

1. Add DELETE function to `ApiEndpoint.js`
   - Include JSDoc comment with endpoint path
   - Include @param and @returns documentation
   - Note any permission requirements

2. Add delete state to component
   ```javascript
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const cancelRef = React.useRef();
   ```

3. Add delete handler with proper error handling

4. Add delete button (only in view mode)

5. Add confirmation dialog (use Chakra or MUI consistently)

6. Test all error scenarios

### Common Mistakes to Avoid

❌ Deleting without confirmation dialog
❌ Not showing loading state
❌ Not handling specific error codes
❌ Navigating before API responds
❌ Allowing multiple simultaneous deletes
❌ Not disabling button in edit mode
❌ Showing technical error messages to users
❌ Missing error logging for debugging

### Performance Considerations

- Dialog opens instantly (no data fetching)
- API call is single request (no cascading calls)
- Navigation happens after confirmed success
- Loading state prevents redundant requests
- Error toast dismisses automatically

---

## Token & Authentication

### How Auth Works

```javascript
/**
 * All DELETE requests automatically include auth token via interceptor
 * 
 * No manual token handling needed - just call the delete function
 * 
 * Flow:
 * 1. User clicks Delete button
 * 2. handleDelete calls deleteForexRequest(id)
 * 3. Axios interceptor adds: Authorization: Bearer {token}
 * 4. Token retrieved from localStorage['token_auth']
 * 5. Request sent to backend
 * 6. Backend validates token and permissions
 * 7. Response handled (success or error)
 */

// The token is AUTOMATICALLY added by the interceptor:
// (in ApiEndpoint.js)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token_auth');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// So you DON'T need to do this manually in components
```

---

## Debugging Checklist

If DELETE isn't working:

```javascript
1. Check browser console
   - Any JavaScript errors?
   - API response in Network tab?

2. Verify token exists
   - Check: localStorage.getItem('token_auth')
   - Should not be empty or null

3. Verify API endpoint
   - Check Network tab for correct URL
   - Check status code (200=success, 401=auth, 404=not found)

4. Verify component state
   - Is isDeleteDialogOpen true?
   - Is isDeleting true during request?

5. Check network request
   - Method should be DELETE
   - Headers should include Authorization: Bearer
   - URL should match API docs

6. Backend logs
   - Check server console for error details
   - Database connection issues?
   - Permission validation failed?
```

