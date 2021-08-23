# 切片

arr = list(range(100))  # 建立100以内的数列
print(arr[:10])         # 输出前10位
print(arr[-10:])        # 输出后10位
print(arr[10:20])       # 输出前11到20位
print(arr[:10:2])       # 输出前10个数，每隔2位取一个
print(arr[::5])         # 输出所有数，每隔5位取一个
print(arr[:])           # 甚至什么都不写，只写[:]就可以原样复制一个list
    # tuple同理，但输出为tuple

# 迭代(略过)

# 列表生成式
a = list(range(1, 11))
print(a,'\n')

b = [x * x for x in range(1, 11)]
print(b,'\n')

c = [x * x for x in range(1, 11) if x % 2 == 0]     # 筛选
print(c,'\n')

d = [m + n for m in 'ABC' for n in 'XYZ']       # 还可以使用两层循环，可以生成全排列
print(d,'\n')

# 生成器
g = (x * x for x in range(1, 11))
print(g,'\n')       # <generator object <genexpr> at 0x00000008EAE11F48>
print(next(g),'\n')

for n in g:
    print(n)

# def fib(max):           # 斐波拉契数列
#     n, a, b = 0, 0, 1
#     while n < max:
#         print(b)
#         a, b = b, a + b
#             # 上面的赋值语句a, b = b, a + b
#             # 相当于：
#             # t = (b, a + b) # t是一个tuple
#             # a = t[0]
#             # b = t[1]
#         n = n + 1
#     return 'done'
# fib(6)

def fib(max):           # 用生成器定义斐波拉契数列
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
            # 上面的赋值语句a, b = b, a + b
            # 相当于：
            # t = (b, a + b) # t是一个tuple
            # a = t[0]
            # b = t[1]
        n = n + 1
    return 'done'
gg = fib(6)
while True:
    try:
        x = next(g)
        print('g:', x)
    except StopIteration as e:          # 捕获异常获取生成器的return
        print('Generator return value:', e.value)
        break

# 杨辉三角
def triangles():
    list = [1]
    while True:
        yield list
        list = [1] + [list[x] + list[x+1] for x in range(len(list)-1)] + [1]
tr = triangles()
print(next(tr))
print(next(tr))
print(next(tr))
print(next(tr))
print(next(tr))

# 迭代器

# 生成器不但可以作用于for循环，还可以被next()函数不断调用并返回下一个值，直到最后抛出StopIteration错误表示无法继续返回下一个值了。

# 可以被next()函数调用并不断返回下一个值的对象称为迭代器：Iterator。

# 可以使用isinstance()判断一个对象是否是Iterator对象：

from collections.abc import Iterator

isinstance((x for x in range(10)), Iterator)    # True
isinstance([], Iterator)                        # False
isinstance({}, Iterator)                        # False
isinstance('abc', Iterator)                     # False

# 生成器都是Iterator对象，但list、dict、str虽然是Iterable，却不是Iterator。

# 把list、dict、str等Iterable变成Iterator可以使用iter()函数：

isinstance(iter([]), Iterator)                  # True
isinstance(iter('abc'), Iterator)               # True

# 为什么list、dict、str等数据类型不是Iterator？

# 这是因为Python的Iterator对象表示的是一个数据流，Iterator对象可以被next()函数调用并不断返回下一个数据，直到没有数据时抛出StopIteration错误。可以把这个数据流看做是一个有序序列，但我们却不能提前知道序列的长度，只能不断通过next()函数实现按需计算下一个数据，所以Iterator的计算是惰性的，只有在需要返回下一个数据时它才会计算。

# Iterator甚至可以表示一个无限大的数据流，例如全体自然数。而使用list是永远不可能存储全体自然数的。