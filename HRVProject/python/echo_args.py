import sys
import numpy as np

a = np.array([1,2,3])
b = np.array([4,5,6])
#np.savetxt("test2.txt", (a,b), fmt="%d")

# simple argument echo script
control = []
for v in sys.argv[1:]:
    control.append(v)
    print v

#np.savetxt("control.txt", control, fmt="%s")

if(control[0]=="hello"):
    np.savetxt("test1.txt", a, fmt="%d")
if(control[1]=="world"):
    np.savetxt("test2.txt", b, fmt="%d")
