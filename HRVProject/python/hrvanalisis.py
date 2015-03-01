# -*- coding: utf-8 -*-
"""
Created on Thu Apr  2 17:37:50 2015

@author: ieb-ufsc
"""


from hrvclassA import hrvclass
import numpy as np
import matplotlib.pyplot as plt
from scipy import interpolate
from scipy import signal
import sys

#argumentos enviados por nodejs
for v in sys.argv[1:]:
    print v

rr1 = np.loadtxt('/home/diegopaez/Escritorio/BBB BoneScript Web Server/node+python/python/rrmarcusbasal.txt')

rr = rr1

hrvAnalisis = hrvclass() # inicializa la clase
rr_new = hrvAnalisis.filtrohrv(rr,1) # filter and resample the signal
Vt = hrvAnalisis.vectorTempo()
np.savetxt('basal3min.txt', rr_new, fmt = '%10.2f')
np.savetxt('vtempo.txt', Vt, fmt = '%10.2f')

#
# analisis de tiempo
resultado = []

#analisis en frequencia
#Pxx,Fxx,pVLF,pLF,pHF,lfhf,pTotal  = hrvAnalisis.freqDomainHRV(rr_new,fs = 4.0)

resultado.append(hrvAnalisis.mediahrv())
resultado.append(hrvAnalisis.Bpm())
resultado.append(hrvAnalisis.SDNN())
resultado.append(hrvAnalisis.RMSSD())
resultado.append(hrvAnalisis.NN50())
resultado.append(hrvAnalisis.pNN50())

#np.savetxt('S1-3min.txt', rr_new, fmt = '%10.3f')
np.savetxt('resultado3mins1.txt', resultado, fmt = '%10.3f')

#
#
