$(()=>{
    console.log('doctest report')

    // 左侧 tab 切换
    $('.menus>a').on('click',function(){
        $(this).siblings().removeClass('active')
        $(this).addClass('active')
        $('.content-list>.content').removeClass('active')
        $('.content-list>.content').eq($(this).index()).addClass('active')
    })

    // dashboard 切换
    $('#statistics-toggle').on('click',function(){
        $(this).toggleClass('active')
        $('.statistics').toggleClass('active')
    })

    // 成功失败过滤
    $('.filter-toggle').hover(function(){
        $('.filter-box').addClass('active')
    },function(){
        $('.filter-box').removeClass('active')
    })

    $('#filter-success').on('click',function(){
        console.log('success')
    })
    $('#filter-failed').on('click',function(){
        console.log('failed')
    })
    $('#filter-all').on('click',function(){
        console.log('all')
    })

    $('#statistics-toggle').click()
})