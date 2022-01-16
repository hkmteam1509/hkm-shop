$(document).ready(function(){
    let selectedColor = -1;
    const detailHolder = $(".detail-holder");
    const productColorPicker = $(".product-color").toArray();
    const productQuantity = $("#product-quantity");
    const spanMaximum = document.getElementById("product-maximum");
    const productID = parseInt($("#product-id").val());
    let totalQuantity = parseInt(spanMaximum.innerText);
    const user =document.getElementById("user");
    const lastname = document.getElementById("lastname-holder");
    const firstname = document.getElementById("firstname-holder");
    let details = [];
    detailHolder.toArray().forEach((item, index)=>{
        let color = item.dataset.color;
        let quantity = item.dataset.quantity;
        quantity = parseInt(quantity);
        let detailID = parseInt(item.dataset.id);
        if(quantity > 0){
            details.push( {
                detailID,
                color,
                quantity
            })
        }
    });
    let n = productColorPicker.length;
    for(let i = 0 ; i < n ; i++){
        productColorPicker[i].onclick = function(){
            selectedColor = i;
            spanMaximum.innerText = details[i].quantity;
            let quantity = parseInt(productQuantity.val());
            if(quantity > details[i].quantity){
                productQuantity.val( details[i].quantity);
                productQuantity.siblings("h5").text( details[i].quantity);
            }
        }
    }
    $("#add-to-cart").click(function(){
        if(selectedColor >= 0){
            if(user){
                $.ajax({
                    url:'/me/cart/api',
                    method: 'post',
                    data:{
                        productID,
                        detailID: details[selectedColor].detailID,
                        quantity: parseInt(productQuantity.val()),
                    },
                    success: function(data){
                        console.log(data);
                        const userId = parseInt(user.innerText);
                        console.log(userId);
                        $.ajax({
                            url:'/me/cart/api/header',
                            method: 'get',
                            data:{
                                userId
                            },
                            success: function(data){
                                console.log(data);
                                const nItem = data.length;
                                $(".cart-content-short").text(nItem);
                                $(".cart-content-long").text(nItem + " item (s)");
                                if(nItem > 0){
                                    $(".cart.westeros-dropdown").empty();
                                    $(".cart.westeros-dropdown").append(`
                                    <li class="item clearfix" style="padding: 10px 0; text-align:center; height: auto">
                                        <h5>Lastest product</h5>
                                    </li>
                                    `)
                                    for(let i = 0 ; i < ((nItem < 3) ? nItem : 3) ; i++){
                                        let newItem = `<li class="item clearfix">
                                                            <div class="picture">
                                                                <figure class="liquid">
                                                                    <img src="` + data[i].image +`" alt="product1">
                                                                </figure>
                                                            </div>
                                                            <div class="description">									
                                                                <p class="highlighted category">`+ data[i].cate + `</p>
                                                                <h6>`+data[i].proName+`</h6>
                                                            </div>
                                                            <div class="quantity">
                                                                <h6>`+ data[i].quantity +`</h6>
                                                            </div>
                                                            <div class="price">
                                                                <p class="highlighted">$`+ data[i].quantity*data[i].price +`.00</p>
                                                            </div>
                                                        </li>`
                                        $(".cart.westeros-dropdown").append(newItem);
                                    }
                                    $(".cart.westeros-dropdown").append(`<li class="order clearfix">
                                                                            <a href="/me/cart" class="button secondary">Go to Cart</a>
                                                                        </li>`); 
                                    alert("Add product to cart successfully!");
                                }
                            },
                            error:function(response){  
                                alert('Bad Request'); 
                            } 
                        });
                        alert("Add product to cart successfully!");
                    },
                    error:function(response){  
                        alert('Bad Request'); 
                    } 
                })
            }
            else{
                document.getElementById("no-user-form-checkout").submit();
            }
        }
        else{
            alert("please choose product color !");
        }
    })
    productQuantity.change(function(){
        let quantity = parseInt(productQuantity.val());
        if(selectedColor < 0){
            totalQuantity = parseInt(spanMaximum.innerText);
        }else{
            totalQuantity = details[selectedColor].quantity;
        }
        if(quantity > totalQuantity){
            productQuantity.val(totalQuantity);
            $(this).siblings("h5").text(totalQuantity);
        }
    });

    $("#buy-now-btn").click(function(){
        if(selectedColor >= 0){
            if(user){
                let form = document.createElement("form");
                form.method = "get";
                form.action = "/me/checkout";
                let inputProductID = document.createElement("input");
                let inputDetailID = document.createElement("input");
                let inputQuantity = document.createElement("input");
                inputProductID.value = productID;
                inputProductID.name = "proID";
                inputDetailID.value = details[selectedColor].detailID;
                inputDetailID.name = "detailID";
                inputQuantity.value = parseInt(productQuantity.val());
                inputQuantity.name = "quantity";
                form.append(inputDetailID);
                form.append(inputProductID);
                form.append(inputQuantity);
                document.body.appendChild(form);
                form.submit();
            }
            else{
                document.getElementById("no-user-form-cart").submit();
            }
        }
        else{
            alert("please choose product color !");
        }
    });

    $("#post-review-btn").click(function(){
        console.log("get in to ajax")
        let userID=null;

        let author = "";
        if (user){
            userID=parseInt(user.innerText);
        }

        if(lastname && firstname){
            author = firstname.innerText + " " + lastname.innerText;
        }

        let rate=document.querySelectorAll("#user-rater .filled").length;
        let authorName=$('input[name=authorName]').val();
        let sumary=$('input[name=sumary]').val();
        let com=$('input[name=com').val();

        $.ajax({
            url:'/shop/api/rate',
            method: 'post',
            data:{
                userID,
                proID:productID,
                authorName,
                rate,
                sumary,
                com,
            },
            success:function(data){

                alert("Your comment has been added successfully");
                $('input[name=authorName]').val(author);
                $('input[name=sumary]').val("");
                $('input[name=com').val("");

            }
        })
    })

})

