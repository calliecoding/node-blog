//处理提交评论

let commentArea = document.getElementById('comment');
let hidden = document.getElementById('hidden');
let commentBtn = document.getElementById('commentBtn');
let discussList = document.querySelector('.discuss_list');
let disAmount = document.querySelector('.disAmount');
let previous = document.querySelector('.previous');
let next = document.querySelector('.next');
let commentDetail = document.querySelector('.comment_detail');



/*提交评论*/
commentBtn.onclick = function(){
    if(commentArea.value.trim()==="")return;
    ajax({
        url:'/comment',
        type:'post',
        data:{
            //评论的内容
            comment:commentArea.value,
            //当前这篇文章的id
            contentId:hidden.value,
        },
        success(msg){
            msg = JSON.parse(msg);
            commentArea.value ='';//清空评论区
            if(msg.code){
                //用户未登录,无法评论
                alert('请先登录')
                return
            }
            comments = msg.comment.reverse();//数组对象
            renderComment(comments,page,limit)
        }
    })
};

/*渲染评论函数*/
function renderComment(comments,page,limit){
    let html = '';

    /*
    第1页  [0,3]条
    第2页   [4,7]条
    第3页    [8,11]条

    第n页    [n+4,n+3]条
    */

    let pageMax = Math.ceil(comments.length/limit);

    //限制page的取值范围
    page = Math.max(1,page);
    page=Math.min(pageMax,page);

    let start = limit*(page-1);
    let end = start+limit;// [limit,]当length<limit时
    //限制end
    end=Math.min(end,comments.length);

    if(comments.length===0){return}

    for(let i=start;i<end;i++){
        html+=`
            <li>
                <p class="discuss_user">${comments[i].author}<span></span><i>发表于 ${new Date(comments[i].time).toLocaleString()}</i></p>
                <div class="discuss_userMain">
                    ${comments[i].comment}
                </div>
            </li>`
    }
    discussList.innerHTML = html;
    disAmount.innerText = comments.length;

    if(comments.length){
        //有评论记录
        commentDetail.innerText = `${page}/${pageMax}`;
    }else{
        //没有评论记录
        commentDetail.innerText = `0/0`;

    }
}

/*分页*/
let page =1;
let limit =4;
let comments =[]; //同步代码优先于异步代码

next.onclick = function(){
    page++; //全局的page
    renderComment(comments,page,limit)
};
previous.onclick = function(){
    page--; //全局的page
    renderComment(comments,page,limit)
};

/*初始加载页面的时候,显示评论内容*/
ajax({
    url:'/comment',
    type:'get',
    data:{
        //当前这篇文章的id
        contentId:hidden.value,
    },
    success(msg){
        msg = JSON.parse(msg)
        comments = msg.comment.reverse();//数组对象
        renderComment(comments,page,limit)
    }
})

