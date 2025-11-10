export interface Product {
    name: string;
    color: string;
    bgColor: string;
}

export const PRODUCTS: Product[] = [
    { name: "Cloud Services", color: "text-blue-700", bgColor: "bg-blue-100" },
    { name: "Enterprise Software", color: "text-purple-700", bgColor: "bg-purple-100" },
    { name: "Mobile App", color: "text-green-700", bgColor: "bg-green-100" },
    { name: "Web Platform", color: "text-orange-700", bgColor: "bg-orange-100" },
    { name: "API Services", color: "text-pink-700", bgColor: "bg-pink-100" },
    { name: "Hardware", color: "text-gray-700", bgColor: "bg-gray-100" },
    { name: "Consulting", color: "text-indigo-700", bgColor: "bg-indigo-100" },
    { name: "Other", color: "text-slate-700", bgColor: "bg-slate-100" },
];

export const getProductColor = (productName: string): Product => {
    const product = PRODUCTS.find(p => p.name === productName);
    return product || PRODUCTS[PRODUCTS.length - 1]; // Default to "Other"
};