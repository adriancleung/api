import express from 'express';
const router = express.Router({ mergeParams: true });

router.post('/');
router.get('/');
router.get('/:notification_id');
router.put('/:notification_id');
router.delete('/:notification_id');

export default router;
