export interface IProduct {
    productId: number;
    productName: string;
    type: string;
    isOffer: boolean;
    price: number;
    available: boolean;
    inCart:boolean;
    discountPercentage: number;
    imageUrl: string;
}