$(document).ready(function(){
    const submitRegisterBtn = document.querySelector("#submit-register-btn");
    const passwordBox = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const registerLink = document.getElementById("register-link");
    const firstnameFeedback = document.getElementById("my-invalid-firstname");
    const lastnameFeedback = document.getElementById("my-invalid-lastname");
    const usernameFeedback = document.getElementById("my-invalid-username");
    const emailFeedback = document.getElementById("my-invalid-email");
    const passwordFeedback = document.getElementById("my-invalid-password");
    const comfirmFeedback = document.getElementById("my-invalid-confirm");
    const registerForm = document.getElementById("register-form");
    submitRegisterBtn.addEventListener("click", function(e){
        let isSubmitable = true;
        const username = registerForm["username"];
        const firstname = registerForm["firstname"];
        const lastname = registerForm["lastname"];
        const password = registerForm["password"];
        const email = registerForm["email"];
        const confirmPassword = registerForm["confirmPassword"];
        document.querySelectorAll('.my-invalid-feedback').forEach(ele=>{
            ele.style.display="none";
        });
        if(username.value.length < 1){
            usernameFeedback.style.display="block";
            username.style.marginBottom="5px";
            isSubmitable = false;
        }
        else{
            usernameFeedback.style.display="none";
            username.style.marginBottom="22px";
        }

        if(lastname.value.length < 1){
            lastnameFeedback.style.display="block";
            lastname.style.marginBottom="5px";
            isSubmitable = false;
        }
        else{
            lastnameFeedback.style.display="none";
            lastname.style.marginBottom="22px";
        }

        if(firstname.value.length < 1){
            firstnameFeedback.style.display="block";
            firstname.style.marginBottom="5px";
            isSubmitable = false;
        }
        else{
            firstnameFeedback.style.display="none";
            firstname.style.marginBottom="22px";
        }

        if(email.value.length < 1){
            emailFeedback.style.display="block";
            email.style.marginBottom="5px";
            isSubmitable = false;
        }
        else{
            emailFeedback.style.display="none";
            email.style.marginBottom="22px";
        }

        if(password.value.length < 1){
            passwordFeedback.style.display="block";
            password.style.marginBottom="5px";
            isSubmitable = false;
        }
        else{
            passwordFeedback.style.display="none";
            password.style.marginBottom="22px";
        }
        if(!isSubmitable){
            return;
        }
        if(confirmPassword.value !== password.value){
            comfirmFeedback.style.display="block";
            confirmPassword.style.marginBottom="5px";
            isSubmitable = false;
        }
        else{
            comfirmFeedback.style.display="none";
            confirmPassword.style.marginBottom="22px";
        }
        if(!isSubmitable){
            return;
        }
        console.log("here");
        $.ajax({
            url:'/account/api/check-username',
            method: 'post',
            data:{
                username: username.value,
                email: email.value
            },
            success: function(data){
                console.log(data);
                let isOK = true;
                if(data.isExisted){
                    isOK = false
                    document.getElementById("username-existed").style.display="block";
                    username.style.marginBottom="5px";
                }
                if(data.isInvalidEmail){
                    isOK = false;
                    emailFeedback.style.display="block";
                    email.style.marginBottom="5px";
                }					
                if(isOK){
                    registerForm.submit();
                }
            },
            error: function(err){
                console.log(err);
                alert("Some error has occurred, please try again.");
            }
        })
    })
})
