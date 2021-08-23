print('please input something')
# name = input()
# print(name)
print(26/3)
print('''
    one
    two
    three
''')
print(1 == True)
print(0 or 1)
print(0 and 1)
print(not 1)

# age = input('please input your age: ')
# if int(age) > 20:
#     print('you are old')
# else:
#     print('you are young')
# print('\n')


# list
arr = [1,2,3]
print(len(arr))

def ptArr(arr):
    for item in arr:
        print(item)

arr.append(4)
ptArr(arr)
print('\n')
arr.insert(1,'insert')
ptArr(arr)
print('\n')

# tuple     元素不可变，但当元素为list时，改变list内部元素是可以的  (1,2,[3,4])
tp = (1,2,3)
ptArr(tp)
print('\n')


ptArr('12212')      # 字符串也可以循环打印出字符
print('\n')


# dict 字典
obj = {'a':1,'b':2}
for item in obj:
    print('obj['+ item +'] => ', obj[item])

# 要迭代value，可以用for value in d.values()
for v in obj.values():
    print(v)

# 同时迭代key和value，可以用for k, v in d.items()
for k,v in obj.items():
    print(k,v)

print('\n')

# set不可重复集合
arr1 = set([1,1,2,5,3,3])
ptArr(arr1)
print('\n')