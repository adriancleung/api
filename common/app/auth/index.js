/**
 * @openapi
 * /auth/login:
 *  post:
 *    tags:
 *      - website
 *    summary: Log in to Adrian's admin interface
 *    description: Log in to [adrianleung.dev](https://adrianleung.dev)'s admin interface.
 *    requestBody:
 *      description: User's email and password
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *    responses:
 *      200:
 *        description: User credentials
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                username:
 *                  type: string
 *                  format: email
 *                accessToken:
 *                  type: string
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 * 
 * /auth/signup:
 *  post:
 *    tags:
 *      - website
 *    summary: Create an account for Adrian's admin interface
 *    description: Create an account to access [adrianleung.dev](https://adrianleung.dev)'s admin interface.
 *    requestBody:
 *      description: User's email and password
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *    responses:
 *      200:
 *        description: Successfully created a user account
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 * 
 * /auth/verify:
 *  post:
 *    tags:
 *      - website
 *    summary: Verify if JWT is still valid
 *    description: Verify if the provided JWT is still a valid token to access [adrianleung.dev](https://adrianleung.dev)'s admin interface.
 *    security:
 *      - JwtAuth: []
 *    responses:
 *      200:
 *        description: User credentials
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: string
 *                message:
 *                  type: string
 *                  default: Authorized
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      403:
 *        $ref: '#/components/responses/Forbidden'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 */

module.exports = require('./route');
