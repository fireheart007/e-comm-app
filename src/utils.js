export function getItemCount(cartItems){
    return cartItems.reduce((count,cartItem)=>cartItem.quantity+count,0); //counting no. of items in the cart
}

export function getSubTotal(cartItems){
    return cartItems.reduce((sum,{product,quantity})=>product.price*quantity+sum,0);
}