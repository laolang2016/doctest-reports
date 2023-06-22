# -*- coding: utf-8 -*-
# !/bin/python3


import json
import xml.dom.minidom

datapath = 'F:/github/doctest-reports/reports-cli/testdata/result.xml'

# 顶层 CMakeLists.txt 所在路径
top_cmakescript_path = '/home/laolang/code/doctest-study'

# json 数据
data = {}
json_data = {}


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
    """
    计算每个 suite 是否成功, 统计所有 suite 成功和失败的数量
    :param suites: suites 信息列表
    """
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
    """
    解析断言信息
    :param expression: 断言 xml 节点列表
    :return: 断言信息
    """
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
    """
    解析 subcase 信息
    :param sub_case: subcase xml 节点
    :return: subcase 信息
    """
    sub_case_info = {'name': sub_case.getAttribute('name')}
    expressions = sub_case.getElementsByTagName('Expression')
    if 0 != len(expressions):
        sub_case_info['expressions'] = parse_expression(expressions)
        sub_case_info['success'] = False
    else:
        sub_case_info['success'] = True
    return sub_case_info


def parse_test_case(testcase):
    """
    解析 testcase 信息
    :param testcase: testcase xml 节点
    :return: testcase 信息
    """
    case_info = {'name': testcase.getAttribute('name'),
                 'source_line':
                     compress_source_name(testcase.getAttribute('filename')) + ':' + testcase.getAttribute('line')}
    sub_cases = testcase.getElementsByTagName('SubCase')
    if 0 != len(sub_cases):
        sub_case_infos = []
        for sub_case in sub_cases:
            sub_case_infos.append(parse_sub_case(sub_case))
        case_info['subcases'] = sub_case_infos
        subcase_success_count = 0
        subcase_failed_count = 0
        for subcase in case_info['subcases']:
            if subcase['success']:
                subcase_success_count = subcase_success_count + 1
            else:
                subcase_failed_count = subcase_failed_count + 1
        case_info['subcase_success'] = subcase_success_count
        case_info['subcase_failed'] = subcase_failed_count

    results_asserts = testcase.getElementsByTagName('OverallResultsAsserts')
    for assert_info in results_asserts:
        case_info['success'] = assert_info.getAttribute('test_case_success') == 'true'
        if not case_info['success'] and 0 == len(sub_cases):
            case_info['expressions'] = parse_expression(testcase.getElementsByTagName('Expression'))
        break
    return case_info


def parse_test_suite(suite):
    """
    解析 suite 信息
    :param suite: suite xml 节点
    :return: suite 信息
    """
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
    """
    解析 doctest 输出的 xml 信息
    :param xmlpath: xml 路径
    """
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


def fill_id():
    """
    填充 suite , testcase , subcase , expression 的 id 信息
    """
    suite_id_prefix = 'suite_id_'
    suite_id_curr = 1
    case_id_prefix = 'case_id_'
    case_id_curr = 1
    subcase_id_prefix = 'sub_case_id_'
    subcase_id_curr = 1
    assert_id_prefix = 'assert_id_'
    assert_id_curr = 1

    for suite in data['suites']:
        suite['id'] = suite_id_prefix + str(suite_id_curr)
        suite_id_curr = suite_id_curr + 1
        for case_info in suite['cases']:
            case_info['id'] = case_id_prefix + str(case_id_curr)
            case_id_curr = case_id_curr + 1
            if 'expressions' in case_info:
                for expression_info in case_info['expressions']:
                    expression_info['id'] = assert_id_prefix + str(assert_id_curr)
                    assert_id_curr = assert_id_curr + 1
            if 'subcases' in case_info:
                for subcase_info in case_info['subcases']:
                    subcase_info['id'] = subcase_id_prefix + str(subcase_id_curr)
                    subcase_id_curr = subcase_id_curr + 1
                    if 'expressions' in case_info:
                        for sub_case_expression_info in case_info['expressions']:
                            sub_case_expression_info['id'] = assert_id_prefix + str(assert_id_curr)
                            assert_id_curr = assert_id_curr + 1


def refactor_data():
    """
    重新组织数组, 添加页面跳转 id 信息
    """
    case_list_id_prefix = 'case_list_id_'
    case_list_id_curr = 1
    subcase_list_id_prefix = 'subcase_list_id_'
    subcase_list_id_curr = 1
    expressions_list_id_prefix = 'expressions_list_id_'
    expressions_list_id_curr = 1

    suites = []
    for suite in data['suites']:
        suite_info = {
            'id': suite['id'],
            'name': suite['name'],
            'success': suite['success']
        }

        case_list_info = {
            'id': case_list_id_prefix + str(case_list_id_curr)
        }
        case_list_id_curr = case_list_id_curr + 1
        case_list = []
        for case in suite['cases']:
            case_info = {
                'id': case['id'],
                'name': case['name'],
                'success': case['success'],
                'source_line': case['source_line'],
                'has_subcase': 'subcases' in case
            }
            if case_info['has_subcase']:
                case_info['subcase_success'] = case['subcase_success']
                case_info['subcase_failed'] = case['subcase_failed']
                subcases_info_list = []
                for subcase in case['subcases']:
                    subcase_info = {
                        'id': subcase_list_id_prefix + str(subcase_list_id_curr),
                        'subcases_list': {
                            'id': subcase['id'],
                            'name': subcase['name'],
                            'success': subcase['success']
                        }
                    }
                    subcase_list_id_curr = subcase_list_id_curr + 1
                    if not subcase['success']:
                        subcase_info['has_expressions'] = True
                        subcase_info['expressions_list'] = {
                            'id': expressions_list_id_prefix + str(expressions_list_id_curr),
                            'expressions': subcase['expressions']
                        }
                        expressions_list_id_curr = expressions_list_id_curr + 1
                        pass
                    else:
                        subcase_info['has_expressions'] = False
                    subcases_info_list.append(subcase_info)
                case_info['subcases_info_list'] = subcases_info_list
            else:
                case_info['has_expressions'] = 'expressions' in case
                if case_info['has_expressions']:
                    case_info['expressions_list'] = {
                        'id': expressions_list_id_prefix + str(expressions_list_id_curr),
                        'expressions': case['expressions']
                    }
                    expressions_list_id_curr = expressions_list_id_curr + 1

            case_list.append(case_info)
            pass
        case_list_info['case_list'] = case_list

        suite_info['case_list_info'] = case_list_info
        suites.append(suite_info)

    json_data['suites'] = suites
    json_data['suiteAccount'] = data['suiteAccount']
    json_data['assertCount'] = data['assertCount']
    json_data['caseCount'] = data['caseCount']


if __name__ == '__main__':
    parse_xml(datapath)
    fill_id()
    refactor_data()
    print(json.dumps(json_data, ensure_ascii=False))
    print(json.dumps(data, ensure_ascii=False))
