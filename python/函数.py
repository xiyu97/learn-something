print(abs(-456),'\n')
print(hex(1024),'\n')   # 将整数转为16进制

from 基础 import ptArr  # 导入
ptArr([1,2,3])
print('\n')

import math

def move(x, y, step, angle=0):
    nx = x + step * math.cos(angle)
    ny = y - step * math.sin(angle)
    return nx, ny

x, y = move(100, 100, 60, math.pi / 6)
print(x, y)

r = move(100, 100, 60, math.pi / 6)
print(r)        # python函数返回的多个值 其实是一个tuple

def powerN(x,n=2):
    s=1
    while n > 0:
        n = n - 1
        s = s * x
    return s

print(powerN(2,5), '\n')

def fact(n):
    if n == 1:
        return 1
    return n * (n - 1)
print('10 的阶乘是: ' , fact(10), '\n')