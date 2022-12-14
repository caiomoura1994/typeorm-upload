import Transaction from '../models/Transaction';
import csvParse from "csv-parse";
import fs from "fs";
import CategoriesRepository from '../repositories/CategoriesRepository';
import { getCustomRepository, In } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const categoriesRepository = getCustomRepository(CategoriesRepository)
    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const contactsReadStream = fs.createReadStream(filePath)
    const parsers = csvParse({
      from_line: 2,
      delimiter: ','
    })
    const parseCSV = contactsReadStream.pipe(parsers)
    const categories: string[] = []
    const transactions: any[] = []
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) => cell.trim())
      categories.push(category)
      transactions.push({ title, type, value, category })
    })
    await new Promise(resolve => parseCSV.on('end', resolve))

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories)
      }
    })
    const existentCategoriesTitles = existentCategories.map(category => category.title)
    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index)
    const newCategories = categoriesRepository.create(addCategoryTitles.map(title => ({
      title
    })))
    await categoriesRepository.save(newCategories)
    const finalCategories = [...newCategories, ...existentCategories]
    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        ...transaction,
        category: finalCategories.find(category => category.title === transaction.category)
      }))
    )
    await transactionsRepository.save(createdTransactions)
    await fs.promises.unlink(filePath)
    return createdTransactions
    // return transactions;
  }
}

export default ImportTransactionsService;
