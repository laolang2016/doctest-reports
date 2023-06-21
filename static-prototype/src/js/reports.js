$(() => {
    console.log('doctest report')

    // 左侧 tab 切换
    $('.menus>a').on('click', function () {
        $(this).siblings().removeClass('active')
        $(this).addClass('active')
        $('.content-list>.content').removeClass('active')
        $('.content-list>.content').eq($(this).index()).addClass('active')
    })

    // dashboard 切换
    $('#statistics-toggle').on('click', function () {
        $(this).toggleClass('active')
        $('.statistics').toggleClass('active')
    })

    // 成功失败过滤
    $('.filter-toggle').hover(function () {
        $('.filter-box').addClass('active')
    }, function () {
        $('.filter-box').removeClass('active')
    })

    $('#filter-success').on('click', function () {
        console.log('success')
    })
    $('#filter-failed').on('click', function () {
        console.log('failed')
    })
    $('#filter-all').on('click', function () {
        console.log('all')
    })

    /**
     * 绘制统计图
     * @param {number} successCount 成功的数量
     * @param {number} failedCount 失败的数量
     * @param {string} id canvas id
     */
    const drawStatistics = (successCount, failedCount, id) => {
        var canvas = document.getElementById(id);
        var ctx = canvas.getContext("2d");

        const _successCount = successCount * 1000
        const _failedCount = failedCount * 1000
        const totalCount = _successCount + _failedCount
        const failedEnd = _failedCount / totalCount * 2 + 0.5
        const persent = Math.floor(_successCount / totalCount * 100) + '%'

        ctx.beginPath();
        ctx.arc(50, 40, 30, failedEnd * Math.PI, 2.5 * Math.PI)
        ctx.lineWidth = 15
        ctx.strokeStyle = '#00af00'
        ctx.stroke()
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(50, 40, 30, 0.5 * Math.PI, failedEnd * Math.PI)
        ctx.lineWidth = 15
        ctx.strokeStyle = '#f7464a'
        ctx.stroke()
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = '#00af00'
        ctx.font = '15px Arial, sans-serif'
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillText(persent, 50, 40)
        ctx.closePath();
    }


    // ---------------------------------------
    $('#statistics-toggle').click()

    drawStatistics(7, 3, 'suite-chart')
    drawStatistics(7, 3, 'case-chart')
    drawStatistics(60, 40, 'assert-chart')

})