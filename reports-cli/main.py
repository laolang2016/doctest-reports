# -*- coding: utf-8 -*-
# !/bin/python3


import json
import xml.dom.minidom

datapath = 'F:/github/doctest-reports/reports-cli/testdata/result.xml'

# 顶层 CMakeLists.txt 所在路径
top_cmakescript_path = '/home/laolang/code/doctest-study'

# json 数据
data = {}


def compress_source_name(filename):
    """
    压缩文件名

    将源码中的顶层 CMakeLists.txt 所在路径去掉, 如果文件名不是以顶层 CMakeLists.txt 路径开头, 则原样返回
    :param filename: 源码文件名
    :return: 不包含顶层 CMakeLists.txt 路径的文件名
    """
    start_with_top_path = filename.startswith(top_cmakescript_path)
    if not start_with_top_path:
        return filename
    resultname = filename[len(top_cmakescript_path):]
    if resultname.startswith('/'):
        resultname = resultname[1:]
    return resultname


def parse_suite_count(suites):
    suite_account = {}
    suite_success_count = 0
    suite_failed_count = 0
    for suite_info in suites:
        suite_info['success'] = True
        suite_success_count = suite_success_count + 1
        for case_info in suite_info['cases']:
            if not case_info['success']:
                suite_info['success'] = False
                suite_failed_count = suite_failed_count + 1
                suite_success_count = suite_success_count - 1
                break
    suite_account['success'] = suite_success_count
    suite_account['failed'] = suite_failed_count
    data['suiteAccount'] = suite_account


def parse_assert_count(root_node):
    """
    统计断言数量
    :param root_node: doctest xml 根节点
    :return:
    """
    asserts_info = root_node.getElementsByTagName('OverallResultsAsserts')
    for info in asserts_info:
        data['assertCount'] = {'success': int(info.getAttribute('successes')),
                               'failed': int(info.getAttribute('failures'))
                               }
        break


def parse_case_count(root_node):
    """
    统计测试用例数量
    :param root_node: doctest xml 根节点
    """
    asserts_info = root_node.getElementsByTagName('OverallResultsTestCases')
    for info in asserts_info:
        data['caseCount'] = {'success': int(info.getAttribute('successes')),
                             'failed': int(info.getAttribute('failures')),
                             'skipped': int(info.getAttribute('skipped'))
                             }
        break


def parse_expression(expression):
    expressions = []
    for expr in expression:
        expr_info = {
            'source_line': compress_source_name(expr.getAttribute('filename')) + ':' + expr.getAttribute('line')
        }
        originals = expr.getElementsByTagName('Original')
        for original in originals:
            expr_info['original'] = original.childNodes[0].data.strip()
            break
        expandeds = expr.getElementsByTagName('Expanded')
        for expanded in expandeds:
            expr_info['expanded'] = expanded.childNodes[0].data.strip()
            break
        infos = expr.getElementsByTagName('Info')
        for info in infos:
            expr_info['info'] = info.childNodes[0].data.strip()
            break
        expressions.append(expr_info)

    return expressions


def parse_sub_case(sub_case):
    sub_case_info = {'name': sub_case.getAttribute('name')}
    expressions = sub_case.getElementsByTagName('Expression')
    if 0 != len(expressions):
        sub_case_info['expressions'] = parse_expression(expressions)
        sub_case_info['success'] = False
    else:
        sub_case_info['success'] = True
    return sub_case_info


def parse_test_case(testcase):
    case_info = {'name': testcase.getAttribute('name'),
                 'source_line':
                     compress_source_name(testcase.getAttribute('filename')) + ':' + testcase.getAttribute('line')}
    sub_cases = testcase.getElementsByTagName('TestSuite')
    if 0 == len(sub_cases):
        results_asserts = testcase.getElementsByTagName('OverallResultsAsserts')
        for assert_info in results_asserts:
            case_info['success'] = assert_info.getAttribute('test_case_success') == 'true'
            if not case_info['success']:
                case_info['expressions'] = parse_expression(testcase.getElementsByTagName('Expression'))
            break
    else:
        sub_case_infos = []
        for sub_case in sub_cases:
            sub_case_infos.append(parse_sub_case(sub_case))
    return case_info


def parse_test_suite(suite):
    suite_info = {}
    suite_name = suite.getAttribute('name')
    if 0 == len(suite_name):
        suite_name = '匿名 suite'
    suite_info['name'] = suite_name
    test_cases = suite.getElementsByTagName('TestCase')
    case_infos = []
    for testcase in test_cases:
        case_infos.append(parse_test_case(testcase))
    suite_info['cases'] = case_infos

    return suite_info


def parse_xml(xmlpath):
    dom_tree = xml.dom.minidom.parse(xmlpath)
    root_node = dom_tree.documentElement
    test_suites = root_node.getElementsByTagName('TestSuite')
    suites = []
    for suite in test_suites:
        suites.append(parse_test_suite(suite))
    data['suites'] = suites
    parse_suite_count(suites)
    parse_assert_count(root_node)
    parse_case_count(root_node)
    print(json.dumps(data, ensure_ascii=False))


if __name__ == '__main__':
    parse_xml(datapath)
