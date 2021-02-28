/**
 * @openapi
 * /pushie/token:
 *  get:
 *    tags:
 *      - pushie
 *    summary: Get user's device ID token
 *    description: Get user's device ID token for sending push notifications.
 *    security:
 *      - PushieJwtAuth: []
 *    responses:
 *      200:
 *        description: User's device ID token
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 *  post:
 *    tags:
 *      - pushie
 *    summary: Save user's device ID token
 *    description: Save user's device ID token for sending push notifications.
 *    security:
 *      - PushieJwtAuth: []
 *    requestBody:
 *      description: User's device ID token
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *    responses:
 *      200:
 *        description: Successfully saved user's device ID token
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 */

module.exports = require('./route');
