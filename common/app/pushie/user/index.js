/**
 * @openapi
 * /pushie/user:
 *  get:
 *    tags:
 *      - pushie
 *    summary: Get user's notifications
 *    description: Get user's notifications.
 *    security:
 *      - PushieJwtAuth: []
 *    responses:
 *      200:
 *        $ref: '#/components/responses/ListOfNotifications'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 *  post:
 *    tags:
 *      - pushie
 *    summary: Create a new user
 *    description: Create a new user.
 *    security:
 *      - PushieJwtAuth: []
 *    requestBody:
 *      description: Create a new user based on the user's email address
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *    responses:
 *      200:
 *        description: A new pushie API key for the user to use
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 *  delete:
 *    tags:
 *      - pushie
 *    summary: Delete user's notification
 *    description: Delete a select notification from a user.
 *    security:
 *      - PushieJwtAuth: []
 *    requestBody:
 *      description:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Notification'
 *    responses:
 *      200:
 *        description: Successfully delete a user's notification
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 * 
 * /pushie/user/api:
 *  get:
 *    tags:
 *      - pushie
 *    summary: Get user's API key
 *    description: Get user's API key to create push notifications.
 *    security:
 *      - PushieJwtAuth: []
 *    responses:
 *      200:
 *        description: Retrieved user's API key
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 *            example: 'SecretPushieApiKey'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 *  post:
 *    tags:
 *      - pushie
 *    summary: Create a new API key for a user
 *    description: Create a new API key for a user to create push notifications.
 *    security:
 *      - PushieJwtAuth: []
 *    responses:
 *      200:
 *        description: Successfully created a new API key
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 *            example: 'ANewScretPushieApiKey'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 */

module.exports = require('./route');
