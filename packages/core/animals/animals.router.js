import express from 'express';
import * as yup from 'yup';
import { validate } from '@agriness/middleware';
import { list, put, remove, get } from './animals.manager';
import { authenticate } from '../auth/auth.oauth';

const animalsRouter = express.Router();

export default animalsRouter;

/**
 * @swagger
 *
 * definitions:
 *  Data:
 *    type: object
 *    properties:
 *     initials:
 *       type: string
 *     description:
 *       type: string
 *  Animal:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      name:
 *        type: string
 *      type:
 *        type: string
 *      status:
 *        type: number
 *      locale:
 *        type: string
 *      purchaseWeight:
 *        type: number
 *      breed:
 *        type: string
 *      trackingCode:
 *        type: string
 *      birthDate:
 *        type: number
 *        description: Timestamp
 *      entryDate:
 *        type: number
 *        description: Timestamp
 *      productionPhase:
 *        $ref: '#/definitions/Data'
 *      farmType:
 *        $ref: '#/definitions/Data'
 */

/**
 * @swagger
 * /animals:
 *   get:
 *     description: List animals
 *     produces:
 *      - application/json
 *     parameters:
 *       - in: query
 *         name: page
 *         type: number
 *         description: page to list -> 1 to (n - 1)
 *         example: 1
 *       - in: query
 *         name: limit
 *         type: number
 *         description: size of list
 *         example: 10
 *       - in: query
 *         name: query
 *         type: string
 *         description: query used to filter by name or locale
 *         example: porco
 *     responses:
 *       '200':
 *         description: animals list
 *         schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Animal'
 *       '204':
 *         description: no animals found
 */
animalsRouter.get(
  '/',
  authenticate(),
  validate({
    path: 'query',
    schema: { page: yup.number().default(1), limit: yup.number().default(10), query: yup.string() },
  }),
  async (req, res, next) => {
    try {
      const animals = await list(req.validData);

      if (animals.length) res.json(animals);
      else res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
);

/**
 * @swagger
 * /animals:
 *   post:
 *     description: Create an animal
 *     produces:
 *      - application/json
 *     parameters:
 *       - in: body
 *         name: animal
 *         schema:
 *           $ref: '#/definitions/Animal'
 *     responses:
 *       '200':
 *         description: animals list
 *         schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Animal'
 *       '204':
 *         description: no animals found
 */
animalsRouter.post(
  '/',
  authenticate(),
  validate({
    path: 'body',
    schema: {
      name: yup.string().required(),
      type: yup.string().required(),
      status: yup.number().required(),
      locale: yup.string(),
      birthDate: yup.number(),
      entryDate: yup.number(),
      purchaseWeight: yup.number(),
      breed: yup.string(),
      trackingCode: yup.string(),
      productionPhase: yup.object({
        initials: yup.string(),
        description: yup.string(),
      }),
      farmType: yup.object({
        initials: yup.string(),
        description: yup.string(),
      }),
    },
  }),
  (req, res, next) => {
    put(req.validData)
      .then(animal => res.status(201).json(animal))
      .catch(next);
  },
);

/**
 * @swagger
 * /animals/:id:
 *   get:
 *     description: Get an animal
 *     produces:
 *      - application/json
 *     parameters:
 *       - in: parameter
 *         name: id
 *         type: string
 *         description: animal id
 *     responses:
 *       '200':
 *         description: animal
 *         schema:
 *          $ref: '#/definitions/Animal'
 *       '204':
 *         description: no animal found
 */
animalsRouter.get('/:id', authenticate(), async (req, res, next) => {
  try {
    const animal = await get(req.validData);

    if (animal) return res.json(animal);
    return res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

/**
 * @swagger
 * /animals/:id:
 *   put:
 *     description: update an animal
 *     produces:
 *      - application/json
 *     parameters:
 *       - in: parameter
 *         name: id
 *         type: string
 *         description: animal id
 *       - in: body
 *         name: name
 *         type: string
 *       - in: body
 *         name: status
 *         type: number
 *         example: 1
 *         description: animal status
 *     responses:
 *       '200':
 *         description: animal
 *         schema:
 *          $ref: '#/definitions/Animal'
 */
animalsRouter.put(
  '/:id',
  authenticate(),
  validate({ path: 'params', schema: { id: yup.string().required() } }),
  validate({ path: 'body', schema: { name: yup.string().required(), status: yup.number().required() } }),
  (req, res, next) => {
    put(req.validData)
      .then(animal => res.json(animal))
      .catch(next);
  },
);

/**
 * @swagger
 * /animals/:id:
 *   delete:
 *     description: delete an animal
 *     produces:
 *      - application/json
 *     parameters:
 *       - in: parameter
 *         name: id
 *         type: string
 *         description: animal id
 *     responses:
 *       '200':
 *         description: animal deleted
 */
animalsRouter.delete(
  '/:id',
  authenticate(),
  validate({ path: 'params', schema: { id: yup.string().required() } }),
  (req, res, next) => {
    remove(req.validData)
      .then(() => res.status(200).end())
      .catch(next);
  },
);
