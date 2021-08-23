class Animal(object):
    # 类的内部变量名前加上两个下划线__ 就是私有变量( private )
    # 类的实例无法访问私有变量, 
    # 如果要访问私有变量，需在内部实现如get_course和get_score这样的函数

    # def __init__(self, course, score):  # 也就是构造函数
    #     self.__course = course
    #     self.__score = score

    def __init__(self, name):
        self.name = name
    
    # 在类中定义的函数和普通函数只有一点不同，就是第一个函数永远是实例变量self，
    # 调用时，不用传递该参数。
    def run(self):
        print('Animal %s is running...' % self.name)
    
    # def get_course(self):
    #     return self.__course

    # def get_score(self):
    #     return self.__score
    
    # def set_course(self, co):
    #     self.__course = co

    # def set_score(self, sc):
    #     self.__score = sc




# stu = Student('Math',120)
# print(stu)      # <__main__.Student object at 0x000000F0F4EA20B8>
# stu.say('Surprise! Motherfucker!')
# stu.say()

# stu.set_course('Music')
# stu.set_score(100)

# print(stu.get_course())
# print(stu.get_score())


# ---------------------继承
class Dog(Animal):
    # 覆写
    def run(self):
        print('Dog %s is running...' % self.name)

dog = Dog('小黑')
dog.run()

# print(isinstance(dog, Dog))   # True
# print(isinstance(dog, Animal))    # True


# ---------------------多态

## 定义一个函数，传入一个带有run方法的类的实例，执行两次run
def run_twice(animal):
    animal.run()
    animal.run()

class Rubbite(Animal):
    def run(self):
        print('Rubbite %s is running...' % self.name)

class Cat(Animal):
    def run(self):
        print('Cat %s is running...' % self.name)

## 非继承于Animal类，但有run方法
class Timer(object):
    def run(self):
        print('Timer is running...')

run_twice(Dog('小黑'))
run_twice(Rubbite('小白'))
run_twice(Cat('小花'))

## 事实上，run_twice方法传入的实例不必只是Animal, 只要这个类带有run方法就行
run_twice(Timer())


# ---------------------获取对象信息

## 基本类型都可以用type()判断: 
print(type(123))    # <class 'int'>
print(type(123.12))    # <class 'float'>
print(type('123'))      # <class 'str'>
print(type(True))   # <class 'bool'>
print(type(None))   # <class 'NoneType'>
## 引用类型也可以: 
print(type(dog))   # <class '__main__.Dog'>
print(type(object))   # <class 'type'>

## 判断两个变量类型是否相等
print(type(123) == type(456))       # True

import types
def fn():
    pass

print(type(fn) == types.FunctionType)   # True
print(type(abs) == types.BuiltinFunctionType)   # True
print(type(lambda x: x) == types.LambdaType)   # True
print(type((x for x in range(10))) == types.GeneratorType)   # True

print(dir(dog))     # dir()方法获取对象的所有属性和方法



# ----------------------实例属性和类属性
# class Student(object):
#     def __init__(self, name):
#         self.name = name

# s = Student('Bob')
# s.score = 90


class Student(object):
    name = 'holger'

s = Student()
print(s.name)       # holger    由于实例并没有name属性，所以会继续查找class的name属性
print(Student.name)       # holger     打印类的name属性

s.name = 'Bob'          # 给实例绑定name属性
print(s.name)       # Bob       由于实例属性优先级比类属性高，它会屏蔽掉类的name属性
print(Student.name)       # holger      但是类属性并未消失，用Student.name仍然可以访问

# del s.name     # 删除实例的name属性
# print(s.name)       # holger    由于实例的name属性没有找到，类的name属性就显示出来了

del Student.name
print(s.name)       # Bob
# print(Student.name)     # AttributeError: type object 'Student' has no attribute 'name'