export interface OrderCreatedMessage {
    orderId: string
    amount: number
    client: {
        id: string
    }
}