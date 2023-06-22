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

    
    drawStatistics(dashboardData.suiteAccount.success, dashboardData.suiteAccount.failed, 'suite-chart')
    drawStatistics(dashboardData.assertCount.success, dashboardData.assertCount.failed, 'case-chart')
    drawStatistics(dashboardData.caseCount.success, dashboardData.caseCount.failed, 'assert-chart')

    $('#suite-success-count').text(dashboardData.suiteAccount.success)
    $('#suite-failed-count').text(dashboardData.suiteAccount.failed)
    $('#case-success-count').text(dashboardData.assertCount.success)
    $('#case-failed-count').text(dashboardData.assertCount.failed)
    $('#assert-success-count').text(dashboardData.caseCount.success)
    $('#assert-failed-count').text(dashboardData.caseCount.failed)


    dashboardData.suites.forEach(suite => {
        // suite 列表
        const arr = new Array()
        arr.push(`<div class="suite-item" case-list-info="${suite.case_list_info.id}">`)
        arr.push(`<span class="suite-name">${suite.name}</span>`)
        arr.push('<span class="tip">')
        arr.push(`<i class="pass">${suite.case_success}</i>`)
        arr.push(`<i class="failed">${suite.case_failed}</i>`)
        arr.push('</span>')
        arr.push('</div>')
        $('#test-suite').append(arr.join("\n"))

        // test case 列表

        suite.case_list_info.case_list.forEach(caseInfo => {
            const arr = new Array()
            if (caseInfo.success) {
                arr.push(`<div class="case-item" success="1" case-list-id=${suite.case_list_info.id}>`)
            } else {
                if (caseInfo.has_subcase) {
                    arr.push(`<div class="case-item" success="0" case-list-id=${suite.case_list_info.id} list-type="subcase" subcase-list-info=${caseInfo.subcases_info_list.id}>`)
                } else {
                    arr.push(`<div class="case-item" success="0" case-list-id=${suite.case_list_info.id} list-type="expression" expression-list-info=${caseInfo.expressions_list.id}>`)
                }
            }

            arr.push(`<span class="case-name">${caseInfo.name}<i class="source-line">${caseInfo.source_line}</i></span>`)
            arr.push(`<span class="tip">`)
            if (caseInfo.success) {
                arr.push(`<span class="iconfont icon-duigou success"></span>`)
                arr.push(`</span>`)
                arr.push(`</div>`)
            } else {
                if (caseInfo.has_subcase) {
                    arr.push(`<i class="pass-count">${caseInfo.subcase_success}</i>`)
                    arr.push(`<i class="failed-count">${caseInfo.subcase_failed}</i>`)
                    arr.push(`</span>`)
                    arr.push(`</div>`)
                } else {
                    arr.push(`<span class="iconfont icon-duigou failed"></span>`)
                    arr.push(`</span>`)
                    arr.push(`</div>`)
                }
            }
            $('#test-case').append(arr.join("\n"))

            if (caseInfo.has_expressions) {
                caseInfo.expressions_list.expressions.forEach(expression => {
                    const arr = new Array()
                    arr.push(`<div class="detail-item" expressions-list-id=${caseInfo.expressions_list.id}>`)
                    arr.push(`<div class="expr">`)
                    arr.push(`<span>${expression.original}</span>`)
                    arr.push(`<span>${expression.expanded}</span>`)
                    arr.push(`</div>`)
                    arr.push(`<div class="source-line">`)
                    arr.push(`${expression.source_line}`)
                    arr.push(`</div>`)
                    if (expression.info) {
                        arr.push(`<div class="info">`)
                        arr.push(`${expression.info}`)
                        arr.push(`</div>`)
                    }
                    arr.push(`</div>`)
                    $('#detail').append(arr.join("\n"))
                })
            }

            if (caseInfo.has_subcase) {
                caseInfo.subcases_info_list.subcase_list.forEach(subcase => {
                    const arr = new Array()
                    if (subcase.success) {
                        arr.push(`<div class="subcase-item" success="1" subcase-list-id=${caseInfo.subcases_info_list.id}>`)
                    } else {
                        arr.push(`<div class="subcase-item" success="0" subcase-list-id=${caseInfo.subcases_info_list.id} expression-list-info=${subcase.expressions_list.id}>`)
                    }

                    arr.push(`<span class="subcase-name">${subcase.name}<i class="source-line">${subcase.source_line}</i></span>`)
                    arr.push(`<span class="tip">`)
                    if (!subcase.success) {
                        arr.push(`<span class="iconfont icon-cuowu failed"></span>`)
                    } else {
                        arr.push(`<span class="iconfont icon-duigou success"></span>`)
                    }
                    arr.push(`</span>`)
                    arr.push(`</div>`)
                    $('#subcase').append(arr.join("\n"))

                    if (subcase.has_expressions) {
                        subcase.expressions_list.expressions.forEach(expression => {
                            const arr = new Array()
                            arr.push(`<div class="detail-item" expressions-list-id=${subcase.expressions_list.id}>`)
                            arr.push(`<div class="expr">`)
                            arr.push(`<span>${expression.original}</span>`)
                            arr.push(`<span>${expression.expanded}</span>`)
                            arr.push(`</div>`)
                            arr.push(`<div class="source-line">`)
                            arr.push(`${expression.source_line}`)
                            arr.push(`</div>`)
                            if (expression.info) {
                                arr.push(`<div class="info">`)
                                arr.push(`${expression.info}`)
                                arr.push(`</div>`)
                            }
                            arr.push(`</div>`)
                            $('#detail').append(arr.join("\n"))
                        })
                    }
                })
            }
        })

    })


    

    $('.subcase-item').on('click', function () {
        if ('1' === $(this).attr('success')) {
            $('.detail-item').removeClass('show')
        } else {
            const expressionListId = $(this).attr('expression-list-info')
            const selector = `div[expressions-list-id='${expressionListId}']`
            $("div[expressions-list-id^='expressions_list_id']").removeClass('show')
            $(selector).addClass('show')
        }
    })

    $('.case-item').on('click', function () {
        if ('1' === $(this).attr('success')) {
            $('.subcase-item').removeClass('show')
            $('.detail-item').removeClass('show')
        } else {
            if ('subcase' === $(this).attr('list-type')) {
                const subcaseListId = $(this).attr('subcase-list-info')
                const selector = `div[subcase-list-id='${subcaseListId}']`
                $("div[subcase-list-id^='subcase_list_id']").removeClass('show')
                $(selector).addClass('show')
                $(selector).eq(0).click()
                $(this).addClass('active').siblings().removeClass('active')
            } else if ('expression' === $(this).attr('list-type')) {
                const expressionListId = $(this).attr('expression-list-info')
                const selector = `div[expressions-list-id='${expressionListId}']`
                $("div[expressions-list-id^='expressions_list_id']").removeClass('show')
                $(selector).addClass('show')
                $('.subcase-item').removeClass('show')
            }
        }
    })

    $('.suite-item').on('click', function () {
        const caseListId = $(this).attr('case-list-info')
        const selector = `div[case-list-id='${caseListId}']`
        $("div[case-list-id^='case_list_id']").removeClass('show')
        $(selector).addClass('show')
        $(selector).eq(0).click()
        $(this).addClass('active').siblings().removeClass('active')
    })

    

    $('.suite-item').eq(0).click()
})