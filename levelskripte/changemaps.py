import sys
import random

Spielfeld = [[1 for x in range(20)] for y in range(10)]

def podest_block(pos0,posy,mat):
    if posy > 16:
        posy = random.randint(1,17)

    if  posy < 1:
        posy = random.randint(1,17)

    if pos0 > 7:
        pos0 = random.randint(0,8)

    mat[pos0][posy] =0
    mat[pos0+1][posy] =0
    mat[pos0+1][posy-1] =0
    mat[pos0+1][posy+1] =0

    return mat

def I_block(pos0,posy,mat):
    if pos0 > 5:
        pos0 = random.randint(0,6)

    mat[pos0][posy] =0
    mat[pos0+1][posy] =0
    mat[pos0+2][posy] =0
    mat[pos0+3][posy] =0

    return mat

def turned_I_block(pos0,posy,mat):
    if posy > 15:
        posy = random.randint(0,16)

    mat[pos0][posy] =0
    mat[pos0][posy+1] =0
    mat[pos0][posy+2] =0
    mat[pos0][posy+3] =0

    return mat

def twobytwo_block(pos0,posy,mat):
    if posy > 17:
        posy = random.randint(0,18)

    if pos0 > 7:
        pos0 = random.randint(0,8)

    mat[pos0][posy] =0
    mat[pos0][posy+1] =0
    mat[pos0+1][posy] =0
    mat[pos0+1][posy+1] =0

    return mat

def U_block(pos0,posy,mat):
    if posy > 16:
        posy = random.randint(0,17)

    if pos0 > 6:
        pos0 = random.randint(0,7)

    mat[pos0][posy] =0
    mat[pos0+1][posy] =0
    mat[pos0+2][posy] =0
    mat[pos0+2][posy+1] =0
    mat[pos0+2][posy+2] =0
    mat[pos0+1][posy+2] =0
    mat[pos0][posy+2] =0

    return mat

def turned_U_block(pos0,posy,mat):

    if posy > 16:
        posy = random.randint(0,17)

    if pos0 > 6:
        pos0 = random.randint(0,7)

    mat[pos0][posy] =0
    mat[pos0+1][posy] =0
    mat[pos0+2][posy] =0
    mat[pos0][posy+1] =0
    mat[pos0+2][posy+2] =0
    mat[pos0+1][posy+2] =0
    mat[pos0][posy+2] =0

    return mat

def L_block(pos0,posy,mat):
    if posy > 16:
        posy = random.randint(0,17)

    if pos0 > 7:
        pos0 = random.randint(0,8)

    mat[pos0][posy] =0
    mat[pos0+1][posy] =0
    mat[pos0+2][posy] =0
    mat[pos0+2][posy+1] =0

    return mat

def check_deadends(mat):

    return mat

def set_block(feld):
    posx = random.randint(0,19)
    posy = random.randint(0,9)
    block = random.randint(0,6)

    if block == 0:
        return podest_block(posy,posx,feld)

    if block == 1:
        return I_block(posy,posx,feld)

    if block == 2:
        return turned_I_block(posy,posx,feld)

    if block == 3:
        return twobytwo_block(posy,posx,feld)

    if block == 4:
        return U_block(posy,posx,feld)

    if block == 5:
        return turned_U_block(posy,posx,feld)

    if block == 6:
        return L_block(posy,posx,feld)


def map2file(map):
    with open ('maoneuneunenu.txt','w') as neue_map:
        for x in range(10):
            for y in range(20):
                neue_map.write("%s" % map[x][y])
            neue_map.write("\n")
    neue_map.close()


map2file(set_block(set_block(set_block(set_block(set_block(Spielfeld))))))
