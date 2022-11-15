import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';
// import CreateTransactionService from '../services/CreateTransactionService';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const { income } = await this
      .createQueryBuilder('transaction')
      .where("transaction.type = :transactionType", { transactionType: 'income' })
      .select('SUM(transaction.value)', 'income')
      .getRawOne();
    const { outcome } = await this
      .createQueryBuilder('transaction')
      .where("transaction.type = :transactionType", { transactionType: 'outcome' })
      .select('SUM(transaction.value)', 'outcome')
      .getRawOne();
    const total = Number(income) - Number(outcome);
    return {
      income: Number(income),
      outcome: Number(outcome),
      total
    };
  }
}

export default TransactionsRepository;
