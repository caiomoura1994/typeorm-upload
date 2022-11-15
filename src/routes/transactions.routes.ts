import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { ICreateTransaction } from '../dtos/transactionsDTO';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository)
  const balance = await transactionsRepository.getBalance()
  const transactions = await transactionsRepository.find()
  return response.json({ transactions, balance })
});

transactionsRouter.post('/', async (request, response) => {
  const transactionInput: ICreateTransaction = request.body
  const createTransaction = new CreateTransactionService()
  const transaction = await createTransaction.execute(transactionInput)
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  const createTransaction = new DeleteTransactionService()
  await createTransaction.execute(id as string)
  return response.status(204).send();
});

transactionsRouter.post('/import', async (request, response) => {
});

export default transactionsRouter;
