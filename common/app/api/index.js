/**
 * @openapi
 * /api:
 *  get:
 *    tags:
 *      - website
 *    summary: Get a list of API keys
 *    description: Get a list of API keys for [adrianleung.dev](https://adrianleung.dev)'s admin tools.
 *    security:
 *      - ApiKeyAuth: []
 *      - JwtAuth: []
 *    responses:
 *      200:
 *        description: A JSON array with a list of API keys
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
 *                    type: string
 *              example:
 *                data:
 *                  - 'SecretApiKeyToUse'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 *  post:
 *    tags:
 *      - website
 *    summary: Generate a new API key
 *    description: Generate a new API key for [adrianleung.dev](https://adrianleung.dev)'s admin tools.
 *    security:
 *      - ApiKeyAuth: []
 *      - JwtAuth: []
 *    responses:
 *      200:
 *        description: A new API key to use
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *              example:
 *                data: 'aNewApiKeyToUse'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 * 
 * /api/{apiKey}:
 *  get:
 *    tags:
 *      - website
 *    summary: Get an API key's information
 *    description: Gets information about a specific API key for [adrianleung.dev](https://adrianleung.dev)'s admin tools.
 *    security:
 *      - ApiKeyAuth: []
 *      - JwtAuth: []
 *    parameters:
 *      - name: apiKey
 *        in: path
 *        description: API key to receive information about
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Information about the API key
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    iat:
 *                      type: object
 *                      properties:
 *                        _seconds:
 *                          type: number
 *                        _nanoseconds:
 *                          type: number
 *              example:
 *                data:
 *                  id: 'SecretApiKeyToUse'
 *                  iat:
 *                    _seconds: 1234567890
 *                    _nanoseconds: 45000000
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 */

module.exports = require('./route');
