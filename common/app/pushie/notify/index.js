/**
 * @openapi
 * /pushie/notify:
 *  post:
 *    tags:
 *      - pushie
 *    summary: Create and send a push notification
 *    description: Create a pushie notification and send to user's device.
 *    security:
 *      - PushieNotificationAuth: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              shortDescription:
 *                type: string
 *              description:
 *                type: string
 *                nullable: true
 *              label:
 *                type: string
 *                nullable: true
 *    responses:
 *      200:
 *        $ref: '#/components/responses/SuccessfulNotification'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 */

module.exports = require('./route');
