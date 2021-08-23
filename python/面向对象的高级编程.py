# -------------使用__slots__
class Student(object):
    __slots__ = ('name','age')      # 用tuple定义允许绑定的属性名称

s = Student()
s.name = 'Bob'
print(s.name)

from types import MethodType
def set_age(self,age):
    self.age = age

# s.set_age = MethodType(set_age, s)      # 给实例绑定一个方法，对其他实例不起作用
Student.set_age = set_age      # 给class绑定方法，作用于所有实例
s.set_age(25)
print(s.age)

# s.score = 99    # score是不允许绑定的    AttributeError: 'Student' object has no attribute 'score'
# 注意：
#       __slots__定义的属性仅对当前类实例起作用，对继承的子类不起作用



#----------------------使用@property 这是python内置的装饰器，负责把一个方法变成属性调用的
class PropertyTest(object):
    @property
    def score(self):
        return self._score
    
    @score.setter   # @property本身又创建了另一个装饰器@score.setter, 把一个setter方法变成属性赋值
    def score(self, value):
        if not isinstance(value, int):
            raise ValueError('score must be an integer!')
        if value < 0 or value > 100:
            raise ValueError('score must between 0 ~ 100!')
        self._score = value
    
    # isA是只读属性
    @property
    def isA(self):
        return self._score >= 60


p = PropertyTest()
p.score = 80        # 实际转化为p.set_score(60)
print(p.score)      # 相当于p.get_score()
# p.isA = False      # AttributeError: can't set attribute
print(p.isA)        # True    相当于p.isA()


#---------------------多重继承
class Animal(object):
    pass

# 哺乳类
class Mammal(Animal):
    pass

# 鸟类
class Bird(Animal):
    pass

# 各种动物
# class Dog(Mammal):      # 狗
#     pass

# class Bat(Mammal):      # 蝙蝠
#     pass

# class Parrot(Bird):      # 鹦鹉
#     pass

# class Ostrich(Bird):      # 鸵鸟
#     pass

# 给动物再加上Runnable和Flyable的功能
class Runnable(object):
    def run(self):
        print('Running...')

class Flyable(object):
    def fly(self):
        print('Flying...')


class Dog(Mammal, Runnable):      # 狗
    pass

class Bat(Mammal, Flyable):      # 蝙蝠
    pass

class Parrot(Bird, Flyable):      # 鹦鹉
    pass

class Ostrich(Bird, Runnable):      # 鸵鸟
    pass

## MixIn的目的就是给一个类增加多个功能，这样，在设计类的时候，优先考虑通过多重继承来组合多个功能，

## 而不是设计多层次的复杂的继承关系


#-----------------------定制类
##--------使用__str__、 __repr__
class Student1(object):
    def __init__(self, name):
        self.name = name
    
    # 不使用__str__的话，print(Student1('Bob'))的输出为: 
    # <__main__.Student1 object at 0x00000010C26BDEB8>
    def __str__(self):
        return 'Student1 object (name: %s)' % self.name
    
    __repr__ = __str__      # 这是简便的写法


print(Student1('Bob'))      # Student1 object (name: Bob)

# 但在命令行中直接敲变量，不用print的话，打印出来的还是不好看:
# >>> s1 = Student1('John')
# >>> <__main__.Student1 object at 0x00000010C26BDEB8>

# 因为直接显示变量调用的不是__str__()，而是__repr__()。
# 两者区别是__str__()返回用户看到的字符串，
# 而__repr__()返回程序开发者看到的字符串，也就是说，__repr__()是为调试服务的


##------------使用__iter__、 __getitem__
class Fib(object):
    # def __init__(self):
    #     self.a, self.b = 0, 1

    # 如果一个类想被用于for ... in循环，类似list或tuple那样，就必须实现一个__iter__()方法，
    # 该方法返回一个迭代对象，然后，Python的for循环就会不断调用该迭代对象的__next__()方法拿到循环的下一个值，
    # 直到遇到StopIteration错误时退出循环。
    # def __iter__(self):
    #     return self     # 实例本身就是迭代对象，故返回自己

    # def __next__(self):
    #     self.a, self.b = self.b, self.a + self.b
    #     if self.a > 10:
    #         raise StopIteration()
    #     return self.a
    
    # Fib实例虽然能作用于for循环，看起来和list有点像，
    # 但是，把它当成list来使用还是不行，比如，取第5个元素：
    # >>> Fib()[5]
    # Traceback (most recent call last):
    #   File "<stdin>", line 1, in <module>
    # TypeError: 'Fib' object does not support indexing

    # 要表现得像list那样按照下标取出元素，需要实现__getitem__()方法：
    def __getitem__(self, n):
        if isinstance(n, int): # n是索引
            a, b = 1, 1
            for x in range(n):
                a, b = b, a + b
            return a
        if isinstance(n, slice): # n是切片（模拟list的切片方法）
            start = n.start
            stop = n.stop
            if start is None:
                start = 0
            a, b = 1, 1
            L = []
            for x in range(stop):
                if x >= start:
                    L.append(a)
                a, b = b, a + b
            return L
    
    # 处理找不到所调用的属性的情况
    def __getattr__(self, attr):
        return "This attr ( " + attr + " ) is not exist!"
F = Fib()
print(F.aaa)
# for n in Fib():
#     print(n)

print('Fib()[0] = %d' % Fib()[0])


# 利用__getattr__()实现链式调用api
class Chain(object):
    def __init__(self, path=''):
        self._path = path
    
    def __getattr__(self, path):
        return Chain('%s/%s' % (self._path, path))

    def __str__(self):
        return self._path
    
    __repr__ = __str__


print(Chain('https://api.server.com').status.user.timeline.list)    # https://api.server.com/status/user/timeline/list
print(Chain('https://video.server.com').status.user.timeline.list)    # https://video.server.com/status/user/timeline/list
print(Chain('https://live.server.com').status.user.timeline.list)    # https://live.server.com/status/user/timeline/list