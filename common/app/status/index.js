/**
 * @openapi
 * /status:
 *  get:
 *    tags:
 *      - website
 *    summary: Get the current status of the API server
 *    description: Get the current status of the API server
 *    responses:
 *      200:
 *        description: Information about the API server
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Status'
 *      503:
 *        $ref: '#/components/responses/ServerUnavailable'
 */

module.exports = require('./route');
