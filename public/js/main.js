//前台的js代码
let loginTab = document.querySelectorAll('.j_userTab span')[0]; //登录切换按钮
let regTab = document.querySelectorAll('.j_userTab span')[1]; //注册切换按钮
let loginBox = document.getElementById('login');        //登录盒子
let regBox = document.getElementById('register');       //注册盒子

//点击登录按钮
if(loginTab){
    loginTab.onclick = function () {
        this.classList.add('user_cur');
        regTab.classList.remove('user_cur')
        loginBox.style.display = 'inline-block';
        regBox.style.display = 'none';
    }
}

//点击注册按钮
if(regTab){
    regTab.onclick = function () {
        this.classList.add('user_cur');
        loginTab.classList.remove('user_cur')
        loginBox.style.display = 'none';
        regBox.style.display = 'inline-block';
    }
}


let login = document.querySelector('.user_login_btn');          //登录按钮
let username = document.getElementById('username');
let password = document.getElementById('password');
let loginTip  = document.querySelector('#login .user_err');

let regUser = document.getElementById('regUser');
let regPsd = document.getElementById('regPsd');
let regRepsd = document.getElementById('regRepsd');
let register = document.querySelector('.user_register_btn');    //注册按钮
let regTip  = document.querySelector('#register .user_err');     //注册的提示信息

let logOut = document.querySelector('.user_loginOut');//退出按钮

//点击注册按钮
if(register){
    register.onclick = function () {
        console.log(1);
        ajax({
            url:'/api/register',
            type:'post',
            data:{
                username:regUser.value,
                password:regPsd.value,
                repassword:regRepsd.value,
            },
            success(msg){
                let data = JSON.parse(msg);
                console.log(data.msg)
                regTip.innerText = data.msg;
                setTimeout(()=>{
                    if(!data.code){
                        window.location.reload()
                    }
                },1000)
            }
        })
    }
}
if(login){
    login.onclick= function () {
        ajax({
            url:'/api/login',
            type:'post',
            data:{
                username:username.value,
                password:password.value,
            },
            success(msg){
                let data = JSON.parse(msg);
                loginTip.innerText = data.msg;
                //刷新页面
                setTimeout(()=>{
                    if(!data.code) {
                        window.location.reload();
                    }
                },1000)
            }
        })

    }
}

if(logOut){
    logOut.onclick= function (){
        ajax({
            url:'/api/logout',
            type:'get',
            success(msg){
                window.location.reload();
            }
        })
    }
}





