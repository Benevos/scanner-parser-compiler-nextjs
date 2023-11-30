import math

number = 23
boolean = 1

if boolean == 0:
    result = math.floor(number)
elif boolean == 1:
    result = math.ceil(number)
    
else:
    raise Exception('Se esperaba una opcion valida')  

