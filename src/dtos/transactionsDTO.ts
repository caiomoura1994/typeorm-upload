export interface ICreateTransaction {
    title: string;
    type: 'income' | 'outcome';
    value: number;
    category: string;
}

