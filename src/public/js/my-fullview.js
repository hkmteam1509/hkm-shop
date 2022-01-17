
	
function genderateReview(comment){
    return comment.map(comment=>{
        let star = ``;
        for(let i = 0 ; i < comment.rate;i++){
            star += 	`<li class="filled">
                            <svg class="svg-star">
                                <use xlink:href="#svg-star"></use>
                            </svg>
                        </li>`
        }
        for (let i=0;i<5-comment.rate;i++){
             star += 	`<li >
                            <svg class="svg-star">
                                <use xlink:href="#svg-star"></use>
                            </svg>
                        </li>`
        }
        return `<div class="sub-item review">
            <h5>${comment.sumary}</h5>
            <ul  class="rating big">
                <ul class="rating big">
                `+ star +`
                </ul>
            </ul>
            <p class="author">${comment.authorName} - ${comment.createdAt} </p>
            <p class="comment">${comment.com}</p>
            </class=>`
        ;
    })
}
function generatePager(paginationArray, prevPage, nextPage){
    let result = [];
        if (paginationArray){
            result.push(`<li>
                        <label style="cursor: pointer;" class="button prev">
                            <input onchange='startSubmit(this);' style="display: none;" id="page-prev" value="${prevPage}" type="radio" name="page"/>
                            <svg class="svg-arrow">
                                <use xlink:href="#svg-arrow"></use>
                            </svg>
                        </label>
                        </li>`)
            paginationArray.forEach(page=>{
                                    if(page.isCurrent){
                                        result.push(`<li class="selected">
                                                        <label style="cursor: pointer;">
                                                            <input onchange='startSubmit(this);' style="display: none;" id="page-${page.page}" value="${page.page}" type="radio" name="page"/>
                                                            ${page.page}
                                                        </label>
                                                    </li>`)
                                    }
                                    else{
                                        result.push(
                                        `<li>
                                            <label style="cursor: pointer;">
                                                <input onchange='startSubmit(this);' style="display: none;" id="page-${page.page}" value="${page.page}" type="radio" name="page"/>
                                                ${page.page}
                                            </label>
                                        </li>`
                                        )
                                    
                                    }							
            })
        result.push(`<li>
                    <label style="cursor: pointer;" class="button next">
                        <input onchange='startSubmit(this);' style="display: none;" id="page-next" value="${nextPage}" type="radio" name="page"/>
                        <svg class="svg-arrow">
                            <use xlink:href="#svg-arrow"></use>
                        </svg>
                    </label>
                    </li>`)
        }
    return result;
}

function startSubmit(ele){
    const data = {};
    const productID = parseInt($("#product-id").val());
    data.proID=productID;
    data.page = $("input[name='page']:checked").val();
    
    if(!data.page){
        data.page = '1';
    }
    if(!ele){
        data.page = '1';
    }
    else if(ele.getAttribute("name") !== "page"){
        data.page = '1';
    }
     $.ajax({
        method:'get',
        url: '/shop/api/rating',
        data: data,
        success: function(data){
            $("#my-pagination").empty();
            if(data.paginationArray && data.paginationArray.length > 0){
                const pageView = generatePager(data.paginationArray, data.prevPage, data.nextPage);
                pageView.forEach(page=>{
                    $("#my-pagination").append(page);
                });
            }
            const reviewView=genderateReview(data.comment);
            $("#review-body").empty();
            reviewView.forEach(comment=>{
                $("#review-body").append(comment);
            });
        },
        error: function(err){
            console.log(err);
            alert("An error has occurred, please try again");
        }
    })
}


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
                        const userId = parseInt(user.innerText);
                        $.ajax({
                            url:'/me/cart/api/header',
                            method: 'get',
                            data:{
                                userId
                            },
                            success: function(data){
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
                startSubmit(null);
                $('input[name=authorName]').val(author);
                $('input[name=sumary]').val("");
                $('input[name=com').val("");
            }
        })
    })
})