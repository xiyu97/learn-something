#!usr/bin/env python3
# -*- coding: utf-8 -*-

' a test module'

__author__ = 'Holger'

import sys

def test():
    # 用list存储了命令行的所有参数, argv至少有一个元素，因为第一个参数永远是该.py文件的名称
    args = sys.argv
    print(args)
    if len(args) == 1:
        print('Hello, world!')
    elif len(args == 2):
        print('Hello, %s!' % args[1])
    else:
        print('Too many arguments!')

if __name__ == '__main__':
    test()


## 用类似_abc、__xy这样的函数或变量就是非公开的（private）
def _private_1(name):
    return 'Hello, %s' % name

def _private_2(name):
    return 'Hi, %s' % name

## 在模块里公开greeting()函数，而把内部逻辑用private函数隐藏起来
def greeting(name):
    if len(name) < 3:
        return _private_1(name)
    else:
        return _private_2(name)