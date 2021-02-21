/**
 * @openapi
 * /resume:
 *  get:
 *    tags:
 *      - website
 *    summary: Get resume section content
 *    description: Get resume section content for [adrianleung.dev](https://adrianleung.dev)
 *    responses:
 *      200:
 *        description: Base64-encoded resume file
 *        content:
 *          text/html:
 *            schema:
 *              type: string
 *              format: byte
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 */

module.exports = require('./route');
