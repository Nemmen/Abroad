# DELETE Integration Quick Reference

## Quick Start - Add DELETE to a New View

### 1. Import Required Components
```javascript
import { useNavigate } from 'react-router-dom';
import { deleteForexRequest } from '../../services/ApiEndpoint'; // Choose the appropriate delete function
import { 
  AlertDialog, AlertDialogBody, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
} from '@chakra-ui/react'; // For Chakra UI views
// OR
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'; // For MUI views
```

### 2. Add State in Component
```javascript
const navigate = useNavigate();
const toast = useToast();
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
const cancelRef = React.useRef(); // Only for Chakra UI
```

### 3. Add Delete Handler
```javascript
const handleDelete = async () => {
  setIsDeleting(true);
  try {
    const response = await deleteForexRequest(id); // Use appropriate delete function
    
    if (response.data.success) {
      toast({
        title: 'Success',
        description: 'Record deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setIsDeleteDialogOpen(false);
      navigate('/admin/forex'); // Navigate to appropriate list
    }
  } catch (error) {
    console.error('Error deleting record:', error);
    
    let errorMessage = 'Failed to delete record';
    if (error.response?.status === 404) {
      errorMessage = 'Record not found or already deleted';
    } else if (error.response?.status === 401) {
      errorMessage = 'Unauthorized - Admin access required';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    toast({
      title: 'Error',
      description: errorMessage,
      status: 'error',
      duration: 4000,
      isClosable: true,
    });
  } finally {
    setIsDeleting(false);
  }
};
```

### 4. Add Delete Button to UI
```javascript
<Button
  colorScheme="red"
  leftIcon={<Icon as={FiTrash2} />}
  onClick={() => setIsDeleteDialogOpen(true)}
  isDisabled={loading || isEditing}
>
  Delete
</Button>
```

### 5. Add Confirmation Dialog (Chakra UI)
```javascript
<AlertDialog
  isOpen={isDeleteDialogOpen}
  leastDestructiveRef={cancelRef}
  onClose={() => setIsDeleteDialogOpen(false)}
>
  <AlertDialogOverlay>
    <AlertDialogContent>
      <AlertDialogHeader fontSize="lg" fontWeight="bold">
        Delete Record
      </AlertDialogHeader>

      <AlertDialogBody>
        Are you sure you want to delete this record? This action cannot be undone.
      </AlertDialogBody>

      <AlertDialogFooter>
        <Button
          ref={cancelRef}
          onClick={() => setIsDeleteDialogOpen(false)}
          isDisabled={isDeleting}
        >
          Cancel
        </Button>
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
```

### 5. Add Confirmation Dialog (Material UI)
```javascript
<Dialog
  open={isDeleteDialogOpen}
  onClose={() => setIsDeleteDialogOpen(false)}
>
  <DialogTitle>Delete Record</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete this record? This action cannot be undone.
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

## Available DELETE API Functions

Import from `src/views/mainpages/services/ApiEndpoint.js`:

```javascript
import { 
  deleteForexRequest,
  deleteGicForm, 
  deleteBlockedAccount,
  deleteOshc, 
  deleteStudentFunding,
  deletePaymentTagging 
} from '../../services/ApiEndpoint';
```

Each function takes an `id` parameter:
```javascript
const response = await deleteForexRequest(id);
```

---

## Navigation Paths

After successful deletion, navigate to:

| Service | Admin Path | Agent Path |
|---------|-----------|-----------|
| Forex | `/admin/forex` | `/agent/forex` |
| GIC | `/admin/gic` | `/agent/gic` |
| OSHC | `/admin/oshc` | `/agent/oshc` |
| Student Funding | `/admin/student-funding` | `/agent/student-funding` |
| Payment Tagging | `/admin/payment-tagging` | `/agent/payment-tagging` |
| Blocked Account | `/admin/blocked` | `/agent/blocked` |

---

## Error Messages

Default error messages shown to users:

| Error Code | Message | When |
|-----------|---------|------|
| 404 | "Record not found or already deleted" | Record doesn't exist |
| 401 | "Unauthorized - Admin access required" | Missing/invalid auth token |
| 400 | "Invalid record ID" | Malformed ID format |
| 500 | Server error message | Database/server issue |

---

## Common Issues & Solutions

### Issue: Delete button not appearing
**Solution:** Check if `isEditing` state is true. Delete button should only show in view mode.

### Issue: Dialog won't close after delete
**Solution:** Ensure `setIsDeleteDialogOpen(false)` is called in the success block.

### Issue: Loading state not working
**Solution:** Verify `isDeleting` state is being used for button `isLoading` and `disabled` props.

### Issue: Wrong navigation path
**Solution:** Check the path matches the service and user role (admin vs agent).

### Issue: Authentication fails (401)
**Solution:** Verify token is in localStorage at key `token_auth`. Check browser DevTools Network tab.

---

## Best Practices

✅ Always show confirmation dialog before deleting
✅ Disable button while deleting to prevent double-clicks
✅ Show loading indicator with "Deleting..." text
✅ Display success/error toasts
✅ Navigate away after successful deletion
✅ Handle specific error scenarios with appropriate messages
✅ Only show delete button in view mode (not edit mode)
✅ Use trash icon for consistency: `<Icon as={FiTrash2} />`
✅ Never delete without explicit user action
✅ Log errors to console for debugging

---

## Testing

Use Postman or curl to test DELETE endpoints:

```bash
# Forex
curl -X DELETE http://localhost:4000/api/forex/request/{id} \
  -H "Authorization: Bearer YOUR_TOKEN"

# GIC
curl -X DELETE http://localhost:4000/auth/deleteGicForm/{id} \
  -H "Authorization: Bearer YOUR_TOKEN"

# OSHC
curl -X DELETE http://localhost:4000/api/oshc/{id} \
  -H "Authorization: Bearer YOUR_TOKEN"

# Student Funding
curl -X DELETE http://localhost:4000/api/student-funding/admin/delete/{id} \
  -H "Authorization: Bearer YOUR_TOKEN"

# Payment Tagging
curl -X DELETE http://localhost:4000/api/payment-tagging/admin/delete/{id} \
  -H "Authorization: Bearer YOUR_TOKEN"

# Blocked Account
curl -X DELETE http://localhost:4000/auth/deleteBlockedAccount/{id} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Support

For issues or questions about DELETE integration:
1. Check this guide first
2. Review implemented examples in the codebase
3. Check browser console for errors
4. Check network tab in DevTools for API response
5. Verify backend DELETE endpoint is working
