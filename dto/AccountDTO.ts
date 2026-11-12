export class AccountDTO {
    owner: string;
    currency: string | undefined;

    constructor(owner: string, currency?: string) {
        this.owner = owner;
        this.currency = currency;

    }
}