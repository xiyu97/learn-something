# # from 基础 import ptArr  # 导入

# def f(x):
#     return x * x

# m = map(f,[1,2,3,4,5,6,7,8,9])
# # ptArr(m)
# print(m,'\n')

# # 利用reduce将[1, 3, 5, 7, 9]转化成整数13579
import functools, time

# def fn(x, y):
#     return x * 10 + y

# r = reduce(fn, [1, 3, 5, 7, 9])
# print(r,'\n')

# # filter
# def is_odd(n):
#     return n % 2 == 1

# f = list(filter(is_odd, [1, 2, 4, 5, 6, 9, 10, 15]))
# print(f,'\n')


# # sorted
# # 默认从大到小
# print(sorted([36, 5, -12, 9, -21]),'\n')                # [-21, -12, 5, 9, 36]
# print(sorted([36, 5, -12, 9, -21], key=abs),'\n')       # [5, 9, -12, -21, 36]
# print(sorted(['bob', 'about', 'Zoo', 'Credit']),'\n')   # ['Credit', 'Zoo', 'about', 'bob']


# # 匿名函数 lambda x: x + 1
# L = list(filter(lambda n: n % 2 == 1 , range(1, 20)))
# print(L,'\n')



# 闭包
def count():
    fs = []
    for i in range(1,4):
        def f(j):
            return lambda: j * j
        fs.append(f(i))
    return fs

# f1,f2,f3 = count()
# print(f1(),f2(),f3())


# 装饰器

### 定义一个能打印函数执行时间的decorator
def log(func):
    @functools.wraps(func)      # 防止函数func的__name__属性被改变
    def wrapper(*args, **kw):
        print('call %s():' % (func.__name__, ))
        return func(*args, **kw)
    return wrapper

### 把decorator置于函数的定义处
@log        # 相当于执行了now = log(now)
def now():
    print("2020-6-28")
f = now
# f()
# print(now.__name__)     # now
# print(f.__name__)

# now()
# print(now.__name__)     # 装饰器装饰后，now的__name__属性已经变为wrapper

### 定义一个能打印函数执行时间的decorator
def metric(func):
    @functools.wraps(func)      # 防止函数func的__name__属性被改变
    def wrapper(*args):
        t1 = time.time()
        result = func(*args)
        t2 = time.time()
        print('%s executed in %s ms' % (func.__name__, t2 - t1))
        return result
    return wrapper

@metric
def fast(x, y):
    # pass
    time.sleep(0.0233)
    return x + y

@metric
def slow(x, y, z):
    time.sleep(0.2333)
    return x * y * z

# f = fast(11, 22)
# s = slow(11, 22, 33)
# print('f = %d, s = %d' % (f, s))


# 偏函数
# print(int('100000', base=2))
# print(int('12345', base=8))
# print(int('12345', base=16))

### functools.partial的作用就是，把一个函数的某些参数给固定住（也就是设置默认值），
### 返回一个新的函数，调用这个新函数会更简单
int2 = functools.partial(int, base = 2)
print(int2('101010'))