/**
 * @openapi
 * /mail:
 *  get:
 *    tags:
 *      - website
 *    summary: Get a list of emails
 *    description: Get a list of mails sent to [contact@adrianleung.dev](mailto:contact@adrianleung.dev).
 *    security:
 *      - ApiKeyAuth: []
 *      - JwtAuth: []
 *    responses:
 *      200:
 *        description: A JSON array of emails received
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                mail:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Mail'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 *  post:
 *    tags:
 *      - website
 *    summary: Send an email
 *    description: Send an amail to [contact@adrianleung.dev](mailto:contact@adrianleung.dev).
 *    requestBody:
 *      description: Email content to be saved
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              email:
 *                type: string
 *              message:
 *                type: string
 *    responses:
 *      200:
 *        description: Email successfully saved
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 */

module.exports = require('./route');
