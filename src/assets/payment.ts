export interface PaymentCard {
    id: number;
    number: string;
    expiry: string;
    isPrimary: boolean;
  }
  const card: PaymentCard[] = [
    { id: 1, number: '**** **** **** 1234', expiry: '12/25', isPrimary: true },
    { id: 2, number: '**** **** **** 5678', expiry: '03/26', isPrimary: false },
  ];  

export default card;