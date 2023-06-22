const dashboardData = {
    "suites": [
        {
            "id": "suite_id_1",
            "name": "test_calc",
            "success": false,
            "case_success": 0,
            "case_failed": 3,
            "case_list_info": {
                "id": "case_list_id_1",
                "case_list": [
                    {
                        "id": "case_id_1",
                        "name": "test_calc_add_1",
                        "success": false,
                        "source_line": "test/test_util_calc.cpp:14",
                        "has_subcase": true,
                        "subcase_success": 1,
                        "subcase_failed": 1,
                        "subcases_info_list": {
                            "id": "subcase_list_id_1",
                            "subcase_list": [
                                {
                                    "id": "sub_case_id_1",
                                    "name": "test_calc_add_1_1",
                                    "success": true,
                                    "source_line": "test/test_util_calc.cpp:16",
                                    "has_expressions": false
                                },
                                {
                                    "id": "sub_case_id_2",
                                    "name": "test_calc_add_1_2",
                                    "success": false,
                                    "source_line": "test/test_util_calc.cpp:20",
                                    "has_expressions": true,
                                    "expressions_list": {
                                        "id": "expressions_list_id_1",
                                        "expressions": [
                                            {
                                                "source_line": "test/test_util_calc.cpp:22",
                                                "original": "4 == calc->add(1, 2)",
                                                "expanded": "4 == 3"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "id": "case_id_2",
                        "name": "test_calc_add_2",
                        "success": false,
                        "source_line": "test/test_util_calc.cpp:26",
                        "has_subcase": false,
                        "has_expressions": true,
                        "expressions_list": {
                            "id": "expressions_list_id_2",
                            "expressions": [
                                {
                                    "source_line": "test/test_util_calc.cpp:30",
                                    "original": "expected == actual",
                                    "expanded": "4 == 3",
                                    "info": "add2 测试失败. 期望:4, 实际:3",
                                    "id": "assert_id_1"
                                }
                            ]
                        }
                    },
                    {
                        "id": "case_id_3",
                        "name": "test_calc_add_3",
                        "success": false,
                        "source_line": "test/test_util_calc.cpp:33",
                        "has_subcase": false,
                        "has_expressions": true,
                        "expressions_list": {
                            "id": "expressions_list_id_3",
                            "expressions": [
                                {
                                    "source_line": "test/test_util_calc.cpp:35",
                                    "original": "4 == calc->add(1, 2)",
                                    "expanded": "4 == 3",
                                    "id": "assert_id_2"
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            "id": "suite_id_2",
            "name": "匿名 suite",
            "success": false,
            "case_success": 1,
            "case_failed": 2,
            "case_list_info": {
                "id": "case_list_id_2",
                "case_list": [
                    {
                        "id": "case_id_4",
                        "name": "test_sum",
                        "success": true,
                        "source_line": "test/test_util_calc.cpp:39",
                        "has_subcase": false,
                        "has_expressions": false
                    },
                    {
                        "id": "case_id_5",
                        "name": "test_sum2",
                        "success": false,
                        "source_line": "test/test_util_calc.cpp:45",
                        "has_subcase": false,
                        "has_expressions": true,
                        "expressions_list": {
                            "id": "expressions_list_id_4",
                            "expressions": [
                                {
                                    "source_line": "test/test_util_calc.cpp:48",
                                    "original": "4 == calc->add(1, 2)",
                                    "expanded": "4 == 3",
                                    "id": "assert_id_3"
                                }
                            ]
                        }
                    },
                    {
                        "id": "case_id_6",
                        "name": "test_sum3",
                        "success": false,
                        "source_line": "test/test_util_calc.cpp:51",
                        "has_subcase": false,
                        "has_expressions": true,
                        "expressions_list": {
                            "id": "expressions_list_id_5",
                            "expressions": [
                                {
                                    "source_line": "test/test_util_calc.cpp:54",
                                    "original": "4 == calc->add(1, 2)",
                                    "expanded": "4 == 3",
                                    "info": "test_sum3 测试失败.",
                                    "id": "assert_id_4"
                                },
                                {
                                    "source_line": "test/test_util_calc.cpp:55",
                                    "original": "4 == calc->add(1, 2)",
                                    "expanded": "4 == 3",
                                    "info": "test_sum3 测试失败.",
                                    "id": "assert_id_5"
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ],
    "suiteAccount": {
        "success": 0,
        "failed": 2
    },
    "assertCount": {
        "success": 1,
        "failed": 1
    },
    "caseCount": {
        "success": 1,
        "failed": 5,
        "skipped": 0
    }
}