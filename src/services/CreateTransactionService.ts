import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import { ICreateTransaction } from '../dtos/transactionsDTO';
import Transaction from '../models/Transaction';
import CategoriesRepository from '../repositories/CategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';

class CreateTransactionService {
  public async execute(transactionInput: ICreateTransaction): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const categoriesRepository = getCustomRepository(CategoriesRepository)
    const { total } = await transactionsRepository.getBalance()
    if (transactionInput.type === 'outcome' && transactionInput.value > total) throw new AppError("Outcome need to be higer then total");
    const findedCategory = await categoriesRepository.findOne({ where: { title: transactionInput.category } })
    let createdCategoryId = findedCategory?.id
    if (!findedCategory) {
      const createdCategoryInput = { title: transactionInput.category };
      const createdCategory = categoriesRepository.create(createdCategoryInput)
      const { id } = await categoriesRepository.save(createdCategory)
      createdCategoryId = id
    }
    const transaction = transactionsRepository.create({
      ...transactionInput,
      category_id: createdCategoryId
    })
    await transactionsRepository.save(transaction)
    return transaction
  }
}

export default CreateTransactionService;
