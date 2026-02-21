import { Router } from 'express';
import { z } from 'zod';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { Role } from '../types';

const router = Router();

// All user management routes require admin access
router.use(authenticate);
router.use(authorize(Role.ADMIN));

// Validation schemas
const updateRoleSchema = z.object({
    role: z.enum(['admin', 'staff']),
});

// Routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id/role', validate(updateRoleSchema), userController.updateUserRole);
router.delete('/:id', userController.deleteUser);

export default router;
