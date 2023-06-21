$(()=>{
    console.log('doctest report')

    // 左侧 tab 切换
    $('.menus>a').on('click',function(){
        $(this).siblings().removeClass('active')
        $(this).addClass('active')
        $('.content-list>.content').removeClass('active')
        $('.content-list>.content').eq($(this).index()).addClass('active')
    })
})