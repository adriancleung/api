/**
 * @openapi
 * /about:
 *  get:
 *    tags:
 *      - website
 *    summary: Get about section content
 *    description: Get about section content for [adrianleung.dev](https://adrianleung.dev).
 *    responses:
 *      200:
 *        description: An HTML section content
 *        content:
 *          text/html:
 *            schema:
 *              type: string
 *            example: |-
 *              <p>About me...</p>
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      500:
 *        $ref: '#/components/responses/GeneralError'
 */

module.exports = require('./route');
