# -*- coding: utf-8 -*-
"""
@author: diegopaez
"""
import numpy as np
a = np.array([1,2,3])
b = np.array([4,5,6])
np.savetxt("test.txt", (a,b), fmt="%d")
