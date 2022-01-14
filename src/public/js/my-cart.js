$(document).ready(function(){
    $("#go-checkout-btn").hide(0);
    const checkboxAll = $("#my-checkbox-all");
    const productItemCheckbox = $("input[name='products[]']");
    const productItemQuantity = $("input[name='quantityProducts[]']");
    const removeCart = $(".remove-cart");
    // all change
    checkboxAll.change(function(){
        let isCheckedAll = $(this).prop('checked');
        productItemCheckbox.prop('checked', isCheckedAll) ;
        if(!isCheckedAll){
            $("#total-cost").text("$0.00");
        }else{
            let total = 0;
            productItemQuantity.toArray().forEach(item=>{
                let price = item.dataset.price;
                price = parseInt(price);
                let quantity = item.value;
                quantity = parseInt(quantity);
                total += price*quantity;
            });	
            $("#total-cost").text("$"+total+".00");
        }
        if(total == 0){
            $("#go-checkout-btn").hide(0);
        }else{
            $("#go-checkout-btn").show(0);
        }
    });

    //item change
    productItemCheckbox.change(function(){
        let isCheckedAll = productItemCheckbox.length === $("input[name='products[]']:checked").length;
        checkboxAll.prop('checked',isCheckedAll );
        let total = 0;
        let checkboxList = productItemCheckbox.toArray();
        productItemQuantity.toArray().forEach((item, index)=>{
            if(checkboxList[index].checked){
                let price = item.dataset.price;
                price = parseInt(price);
                let quantity = item.value;
                quantity = parseInt(quantity);
                total += price*quantity;		
            }
        });	
        $("#total-cost").text("$"+total+".00");
        if(total == 0){
            $("#go-checkout-btn").hide(0);
        }else{
            $("#go-checkout-btn").show(0);
        }
    });
    
    productItemQuantity.change(function(){
        let input = $(this);
        let cartID = $(this).data("id");
        let quantity = $(this).val();
        const price = $(this).data("price");
        $.ajax({
            url:'/me/cart/api/update-quantity',
            method: 'post',
            data:{
                cartID,
                quantity
            },
            success: function(data){
                if(data.isOverflow){
                    alert("There are only "+ data.quantity + " quantity remaining for this item")
                }else{
                    
                }
                input.val(data.quantity);
                input.siblings("h5").text(data.quantity);
                $("#product-total-price-" + data.cartID).text("$"+data.quantity*price+".00")
            },
            error: function(err){
                alert("Bad request");
            }
        })
    });

    removeCart.click(function(){
        let cartID = $(this).data("id");
        $.ajax({
            url:'/me/cart/api/delete',
            method: 'delete',
            data:{
                cartID,
            },
            success: function(data){
                $("#product-cart-" + cartID).remove();
            },
            error: function(err){
                alert("Bad request");
            }
        })
    });

});
