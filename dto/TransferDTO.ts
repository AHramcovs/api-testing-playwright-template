export class TransferDTO {
    toId: number;
    amount: number;

    constructor(toId: number, amount: number) {
        this.toId = toId;
        this.amount = amount;
    }
}
