import sys

with open('rohling.txt','w') as file1:
    for x in range(8):

        for y in range (14):
            file1.write("1")
        file1.write('\n')

file1.close()
